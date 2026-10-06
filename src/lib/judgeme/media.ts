/**
 * Host review photos so Judge.me can fetch them via `picture_urls`.
 * Judge.me does not accept multipart/base64 — only public HTTPS image URLs.
 */
import { put } from "@vercel/blob";

export const REVIEW_PHOTO_MAX = 5;
export const REVIEW_PHOTO_MAX_BYTES = 10 * 1024 * 1024; // 10 MB (Judge.me limit)
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"]);
const ACCEPTED_EXT = /\.(jpe?g|png)$/i;

export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

/** Validate a single review photo against Judge.me rules. */
export function validateReviewPhoto(file: File): string | null {
  if (!ACCEPTED_TYPES.has(file.type) && !ACCEPTED_EXT.test(file.name)) {
    return "Photos must be JPG or PNG.";
  }
  if (file.size <= 0) return "One of the photos looks empty. Please choose another.";
  if (file.size > REVIEW_PHOTO_MAX_BYTES) {
    return "Each photo must be 10 MB or smaller.";
  }
  return null;
}

/**
 * Upload validated photos to Vercel Blob (public). Returns absolute HTTPS URLs
 * for Judge.me `picture_urls`.
 */
export async function uploadReviewPhotos(
  files: File[],
): Promise<{ ok: true; urls: string[] } | { ok: false; error: string }> {
  if (files.length === 0) return { ok: true, urls: [] };
  if (files.length > REVIEW_PHOTO_MAX) {
    return { ok: false, error: `You can attach up to ${REVIEW_PHOTO_MAX} photos.` };
  }

  for (const file of files) {
    const err = validateReviewPhoto(file);
    if (err) return { ok: false, error: err };
  }

  if (!isBlobConfigured()) {
    return {
      ok: false,
      error: "Photo uploads are not configured yet. You can still submit a text review.",
    };
  }

  try {
    const urls: string[] = [];
    for (const file of files) {
      const ext = file.name.match(ACCEPTED_EXT)?.[0]?.toLowerCase() || ".jpg";
      const safeName = `reviews/${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
      const blob = await put(safeName, file, {
        access: "public",
        contentType: file.type || (ext === ".png" ? "image/png" : "image/jpeg"),
        addRandomSuffix: true,
      });
      urls.push(blob.url);
    }
    return { ok: true, urls };
  } catch {
    return { ok: false, error: "Could not upload your photos. Please try again." };
  }
}
