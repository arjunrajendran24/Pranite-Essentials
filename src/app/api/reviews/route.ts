import { NextResponse } from "next/server";
import { createReview, isJudgeMeConfigured } from "@/lib/judgeme";

export const runtime = "nodejs";

type Body = {
  productId?: unknown;
  name?: unknown;
  email?: unknown;
  rating?: unknown;
  body?: unknown;
  title?: unknown;
};

/**
 * POST /api/reviews — create a Judge.me review.
 * Private token stays on the server; body is validated before forwarding.
 */
export async function POST(request: Request) {
  if (!isJudgeMeConfigured()) {
    return NextResponse.json({ ok: false, error: "Reviews are not configured." }, { status: 503 });
  }

  let json: Body;
  try {
    json = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

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
