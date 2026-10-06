import { NextResponse } from "next/server";
import { createReview, isJudgeMeConfigured } from "@/lib/judgeme";
import { REVIEW_PHOTO_MAX, uploadReviewPhotos } from "@/lib/judgeme/media";

export const runtime = "nodejs";

/**
 * POST /api/reviews — create a Judge.me review.
 * Accepts JSON (text-only) or multipart FormData (text + optional photos).
 * Private token and blob token stay on the server.
 */
export async function POST(request: Request) {
  if (!isJudgeMeConfigured()) {
    return NextResponse.json({ ok: false, error: "Reviews are not configured." }, { status: 503 });
  }

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      return await handleMultipart(request);
    }
    return await handleJson(request);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}

async function handleJson(request: Request) {
  const json = (await request.json()) as Record<string, unknown>;
  const result = await createReview({
    productId: String(json.productId ?? ""),
    name: String(json.name ?? ""),
    email: String(json.email ?? ""),
    rating: Number(json.rating),
    body: String(json.body ?? ""),
    title: json.title != null ? String(json.title) : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

async function handleMultipart(request: Request) {
  const form = await request.formData();

  const photos = form
    .getAll("photos")
    .filter((v): v is File => v instanceof File && v.size > 0)
    .slice(0, REVIEW_PHOTO_MAX);

  let pictureUrls: string[] = [];
  if (photos.length > 0) {
    const uploaded = await uploadReviewPhotos(photos);
    if (!uploaded.ok) {
      return NextResponse.json({ ok: false, error: uploaded.error }, { status: 400 });
    }
    pictureUrls = uploaded.urls;
  }

  const result = await createReview({
    productId: String(form.get("productId") ?? ""),
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? ""),
    rating: Number(form.get("rating")),
    body: String(form.get("body") ?? ""),
    title: form.get("title") != null ? String(form.get("title")) : undefined,
    pictureUrls,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
