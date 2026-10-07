/**
 * Judge.me reviews client (server only).
 *
 * Tokens live in env — never import this module from a client component.
 * Public token is enough for widget HTML; private token is required for
 * listing/creating reviews.
 */
import type { JudgeMeProduct, JudgeMeReview, ProductReview, ReviewSummary } from "./types";

export type { ProductReview, ReviewSummary } from "./types";

const REVIEWS_REVALIDATE_SECONDS = 300;

function shopDomain() {
  return (
    process.env.JUDGEME_SHOP_DOMAIN?.trim() ||
    process.env.SHOPIFY_STORE_DOMAIN?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "") ||
    ""
  );
}

function privateToken() {
  return process.env.JUDGEME_PRIVATE_TOKEN?.trim() || "";
}

/** True when Judge.me credentials are present — callers can skip the section. */
export function isJudgeMeConfigured() {
  return Boolean(shopDomain() && privateToken());
}

/** `gid://shopify/Product/123` → `123` */
export function shopifyProductNumericId(gid: string) {
  const match = gid.match(/Product\/(\d+)/);
  return match?.[1] ?? "";
}

async function judgeMeFetch<T>(url: string, init?: RequestInit & { revalidate?: number }): Promise<T | null> {
  const { revalidate, ...rest } = init ?? {};
  try {
    const res = await fetch(url, {
      ...rest,
      headers: { Accept: "application/json", ...(rest.headers ?? {}) },
      ...(revalidate === undefined ? { cache: "no-store" as const } : { next: { revalidate } }),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function reviewsUrl(params: Record<string, string | number | boolean | undefined>) {
  const q = new URLSearchParams({
    shop_domain: shopDomain(),
    api_token: privateToken(),
  });
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    q.set(k, String(v));
  }
  return `https://api.judge.me/api/v1/reviews?${q}`;
}

export async function getJudgeMeProduct(handle: string): Promise<JudgeMeProduct | null> {
  if (!isJudgeMeConfigured()) return null;
  const q = new URLSearchParams({
    shop_domain: shopDomain(),
    api_token: privateToken(),
    handle,
  });
  const data = await judgeMeFetch<{ product: JudgeMeProduct }>(
    `https://api.judge.me/api/v1/products/-1?${q}`,
    { revalidate: REVIEWS_REVALIDATE_SECONDS },
  );
  return data?.product ?? null;
}

function reshapeReview(r: JudgeMeReview): ProductReview {
  const pictures = (r.pictures ?? [])
    .filter((p) => !p.hidden)
    .map((p) => p.urls?.huge || p.urls?.mega || p.urls?.original || p.urls?.compact || p.urls?.small)
    .filter((u): u is string => Boolean(u));

  return {
    id: r.id,
    title: (r.title ?? "").trim(),
    body: (r.body ?? "").trim(),
    rating: r.rating,
    createdAt: r.created_at,
    reviewerName: (r.reviewer?.name ?? "Customer").trim() || "Customer",
    verified: r.verified === "buyer",
    pictures,
  };
}

function summarize(reviews: ProductReview[]): ReviewSummary {
  if (!reviews.length) return { average: 0, count: 0 };
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return {
    average: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

/**
 * Published reviews for a product handle, newest first.
 * Returns an empty list (not an error) when Judge.me isn't configured.
 */
export async function getProductReviews(
  handle: string,
  { page = 1, perPage = 20 }: { page?: number; perPage?: number } = {},
): Promise<{ summary: ReviewSummary; reviews: ProductReview[] }> {
  const empty = { summary: { average: 0, count: 0 }, reviews: [] as ProductReview[] };
  if (!isJudgeMeConfigured()) return empty;

  const product = await getJudgeMeProduct(handle);
  if (!product) return empty;

  const data = await judgeMeFetch<{ reviews: JudgeMeReview[] }>(
    reviewsUrl({
      product_id: product.id,
      page,
      per_page: Math.min(perPage, 100),
      published: true,
    }),
    { revalidate: REVIEWS_REVALIDATE_SECONDS },
  );

  const reviews = (data?.reviews ?? [])
    .filter((r) => r.published && !r.hidden)
    .map(reshapeReview);

  return { summary: summarize(reviews), reviews };
}

/** Compact rating for product cards / title rows. */
export async function getReviewSummary(handle: string): Promise<ReviewSummary | null> {
  const { summary } = await getProductReviews(handle, { perPage: 100 });
  return summary.count > 0 ? summary : null;
}

/** Batch summaries for a catalog grid (small catalogs — one request per product). */
export async function getReviewSummaries(handles: string[]): Promise<Record<string, ReviewSummary>> {
  const entries = await Promise.all(
    handles.map(async (handle) => {
      const summary = await getReviewSummary(handle);
      return summary ? ([handle, summary] as const) : null;
    }),
  );
  return Object.fromEntries(entries.filter((e): e is readonly [string, ReviewSummary] => e !== null));
}

export type CreateReviewInput = {
  /** Shopify product gid or numeric id. */
  productId: string;
  name: string;
  email: string;
  rating: number;
  body: string;
  title?: string;
  /** Public HTTPS image URLs (JPG/PNG). Max 5 — Judge.me fetches and stores them. */
  pictureUrls?: string[];
};

export type CreateReviewResult = { ok: true } | { ok: false; error: string };

/** Submit a review. Uses the private token — call only from a Route Handler. */
export async function createReview(input: CreateReviewInput): Promise<CreateReviewResult> {
  if (!isJudgeMeConfigured()) {
    return { ok: false, error: "Reviews are not configured." };
  }

  const externalId = input.productId.includes("/")
    ? shopifyProductNumericId(input.productId)
    : input.productId.replace(/\D/g, "");

  if (!externalId) return { ok: false, error: "Missing product." };

  const name = input.name.trim();
  const email = input.email.trim();
  const body = input.body.trim();
  const rating = Math.round(input.rating);
  const title = input.title?.trim();
  const pictureUrls = (input.pictureUrls ?? [])
    .map((u) => u.trim())
    .filter((u) => /^https:\/\//i.test(u))
    .slice(0, 5);

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (rating < 1 || rating > 5) return { ok: false, error: "Please choose a rating from 1 to 5." };
  if (body.length < 10) return { ok: false, error: "Please write a little more about your experience." };

  // Judge.me docs require JSON with `picture_urls` as a string array.
  // Form-urlencoded `picture_urls[]` is silently ignored (review is created without photos).
  const payload: Record<string, unknown> = {
    shop_domain: shopDomain(),
    platform: "shopify",
    id: externalId,
    name,
    email,
    rating,
    body,
  };
  if (title) payload.title = title;
  if (pictureUrls.length > 0) payload.picture_urls = pictureUrls;

  const endpoint = `https://judge.me/api/v1/reviews?${new URLSearchParams({
    shop_domain: shopDomain(),
    api_token: privateToken(),
  })}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Api-Token": privateToken(),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 422 || /duplicate|already/i.test(text)) {
        return { ok: false, error: "You’ve already reviewed this product with this email." };
      }
      return { ok: false, error: "Could not submit your review. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the reviews service. Please try again." };
  }
}
