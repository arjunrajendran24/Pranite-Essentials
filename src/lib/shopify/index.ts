/**
 * Shopify Storefront API client (server only).
 *
 * Products, prices, stock and the cart all come from Shopify; checkout happens
 * on Shopify's hosted checkout via `cart.checkoutUrl`. Only the *Storefront*
 * token is used here — never an Admin API token. It isn't prefixed with
 * NEXT_PUBLIC_, so it never reaches the browser bundle.
 */
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
  PRODUCT_QUERY,
  PRODUCTS_QUERY,
} from "./queries";
import type { Cart, CartMutationPayload, ShopifyCart, ShopifyProduct } from "./types";

const DEFAULT_API_VERSION = "2026-07";

/** Catalog data is cached and refreshed in the background at most this often. */
export const PRODUCTS_REVALIDATE_SECONDS = 300;
export const TAGS = { products: "shopify:products" } as const;

export class ShopifyError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    /** True for Shopify `userErrors` (e.g. "sold out") that are safe to show shoppers. */
    readonly userFacing = false,
  ) {
    super(message);
    this.name = "ShopifyError";
  }
}

function endpoint() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!domain) {
    throw new ShopifyError("SHOPIFY_STORE_DOMAIN is not set. Copy .env.example to .env.local (and add it in Vercel).");
  }
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() || DEFAULT_API_VERSION;
  return `https://${domain}/api/${version}/graphql.json`;
}

type FetchOptions = {
  variables?: Record<string, unknown>;
  /** Cache for this many seconds (ISR). Omit for uncached requests such as the cart. */
  revalidate?: number;
  tags?: string[];
};

/**
 * POST a GraphQL document to the Storefront API. Throws `ShopifyError` on
 * network/HTTP failures and on top-level GraphQL errors.
 */
export async function shopifyFetch<T>(query: string, { variables, revalidate, tags }: FetchOptions = {}): Promise<T> {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
  // Without a token Shopify still serves products and carts ("tokenless" access,
  // with lower limits). Set the token in production.
  if (token) headers["X-Shopify-Storefront-Access-Token"] = token;

  let res: Response;
  try {
    res = await fetch(endpoint(), {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      ...(revalidate === undefined ? { cache: "no-store" } : { next: { revalidate, tags } }),
    });
  } catch (err) {
    throw new ShopifyError(`Could not reach Shopify: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!res.ok) {
    const hint = res.status === 401 || res.status === 403 ? " (check SHOPIFY_STOREFRONT_ACCESS_TOKEN)" : "";
    throw new ShopifyError(`Shopify responded ${res.status} ${res.statusText}${hint}`, res.status);
  }

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) throw new ShopifyError("Shopify returned no data");
  return json.data;
}

/* ---------------------------------------------------------------------------
   Products
   --------------------------------------------------------------------------- */

export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(PRODUCTS_QUERY, {
    variables: { first: 100, sortKey: "CREATED_AT", reverse: false },
    revalidate: PRODUCTS_REVALIDATE_SECONDS,
    tags: [TAGS.products],
  });
  return data.products.nodes;
}

export async function getShopifyProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(PRODUCT_QUERY, {
    variables: { handle },
    revalidate: PRODUCTS_REVALIDATE_SECONDS,
    tags: [TAGS.products],
  });
  return data.product;
}

/**
 * "Green Pranite TANORA Bathing Bar | Kojic Acid & Niacinamide Brightening Soap"
 *   → { name: "TANORA Bathing Bar", subtitle: "Kojic Acid & Niacinamide Brightening Soap" }
 * "TANORA Bathing Bar - Pack of 2 (Save 20%)"
 *   → { name: "TANORA Bathing Bar", subtitle: "Pack of 2 (Save 20%)" }
 */
export function splitProductTitle(title: string, brand = "Green Pranite") {
  const [head, ...rest] = title.split(/\s+[|–—-]\s+/);
  const name = head.replace(new RegExp(`^${brand}\\s+`, "i"), "").trim() || head.trim();
  return { name, subtitle: rest.join(" · ").trim() };
}

/** Shopify's title for the only variant of a product without options. */
export const DEFAULT_VARIANT_TITLE = "Default Title";

/** Subtitle shown for a cart line: the product subtitle plus the variant name, when it adds anything. */
export function lineSubtitle(subtitle: string, variantTitle: string) {
  if (!variantTitle || variantTitle === DEFAULT_VARIANT_TITLE || subtitle.includes(variantTitle)) return subtitle;
  return [subtitle, variantTitle].filter(Boolean).join(" · ");
}

/* ---------------------------------------------------------------------------
   Cart
   --------------------------------------------------------------------------- */

function reshapeCart(cart: ShopifyCart): Cart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: Number(cart.cost.subtotalAmount.amount),
    lines: cart.lines.nodes.map((line) => {
      const { merchandise } = line;
      const { name, subtitle } = splitProductTitle(merchandise.product.title);
      const image = merchandise.image ?? merchandise.product.featuredImage;
      return {
        id: line.id,
        variantId: merchandise.id,
        handle: merchandise.product.handle,
        name,
        subtitle: lineSubtitle(subtitle, merchandise.title),
        price: Number(line.cost.amountPerQuantity.amount),
        image: image?.url ?? "",
        imageAlt: image?.altText ?? merchandise.product.title,
        quantity: line.quantity,
      };
    }),
  };
}

/** Result of a cart mutation. `notice` carries Shopify's warnings (e.g. quantity reduced to what's in stock). */
export type CartMutationResult = { cart: Cart | null; notice?: string };

function unwrap(payload: CartMutationPayload): CartMutationResult {
  // No cart back means the id is unknown or expired — the caller starts a new one.
  if (!payload.cart) return { cart: null };
  if (payload.userErrors.length) {
    throw new ShopifyError(payload.userErrors.map((e) => e.message).join("; "), undefined, true);
  }
  return { cart: reshapeCart(payload.cart), notice: payload.warnings?.[0]?.message };
}

/** Returns null for unknown, expired or already checked-out carts. */
export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(CART_QUERY, { variables: { cartId } });
  return data.cart ? reshapeCart(data.cart) : null;
}

export async function createCart(lines: { merchandiseId: string; quantity: number }[]): Promise<CartMutationResult> {
  const data = await shopifyFetch<{ cartCreate: CartMutationPayload }>(CART_CREATE_MUTATION, { variables: { lines } });
  const result = unwrap(data.cartCreate);
  if (!result.cart) throw new ShopifyError(data.cartCreate.userErrors[0]?.message ?? "Could not create a cart");
  return result;
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<CartMutationResult> {
  const data = await shopifyFetch<{ cartLinesAdd: CartMutationPayload }>(CART_LINES_ADD_MUTATION, {
    variables: { cartId, lines },
  });
  return unwrap(data.cartLinesAdd);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[],
): Promise<CartMutationResult> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartMutationPayload }>(CART_LINES_UPDATE_MUTATION, {
    variables: { cartId, lines },
  });
  return unwrap(data.cartLinesUpdate);
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<CartMutationResult> {
  const data = await shopifyFetch<{ cartLinesRemove: CartMutationPayload }>(CART_LINES_REMOVE_MUTATION, {
    variables: { cartId, lineIds },
  });
  return unwrap(data.cartLinesRemove);
}
