"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png";

type PhotoDraft = { id: string; file: File; preview: string };

/**
 * Write-a-review form. Posts to `/api/reviews` so the Judge.me private token
 * never reaches the browser. Optional photos (JPG/PNG, max 5) are hosted
 * server-side then sent to Judge.me as `picture_urls`.
 */
export function ReviewForm({ productId, productName }: { productId: string; productName: string }) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<PhotoDraft[]>([]);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  photosRef.current = photos;

  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.preview));
    };
  }, []);

  const clearPhotos = () => {
    setPhotos((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.preview));
      return [];
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const addPhotos = (list: FileList | null) => {
    if (!list?.length) return;
    setError("");

    const incoming = Array.from(list);
    const next: PhotoDraft[] = [];
    let message = "";

    for (const file of incoming) {
      if (photos.length + next.length >= MAX_PHOTOS) {
        message = `You can attach up to ${MAX_PHOTOS} photos.`;
        break;
      }
      const isImage =
        /image\/(jpeg|jpg|png)/i.test(file.type) || /\.(jpe?g|png)$/i.test(file.name);
      if (!isImage) {
        message = "Photos must be JPG or PNG.";
        continue;
      }
      if (file.size > MAX_BYTES) {
        message = "Each photo must be 10 MB or smaller.";
        continue;
      }
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        preview: URL.createObjectURL(file),
      });
    }

    if (next.length) setPhotos((prev) => [...prev, ...next].slice(0, MAX_PHOTOS));
    if (message) setError(message);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Capture before await — React nulls synthetic event currentTarget afterward.
    const formEl = e.currentTarget;
    setStatus("submitting");
    setError("");

    const data = new FormData(formEl);
    const form = new FormData();
    form.set("productId", productId);
    form.set("name", String(data.get("name") ?? "").trim());
    form.set("email", String(data.get("email") ?? "").trim());
    form.set("title", String(data.get("title") ?? "").trim());
    form.set("body", String(data.get("body") ?? "").trim());
    form.set("rating", String(rating));
    for (const photo of photos) {
      form.append("photos", photo.file, photo.file.name);
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        body: form,
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error || "Could not submit your review.");
        return;
      }
      formEl.reset();
      setRating(5);
      clearPhotos();
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Could not submit your review. Please try again.");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-[1.5rem] border border-forest-700/10 bg-sage-50 px-6 py-8 text-center" role="status">
        <p className="font-serif text-2xl text-forest-900">Thank you</p>
        <p className="mt-2 text-ink-600">
          Your review of {productName} was submitted and will appear once it’s approved.
        </p>
        <button
          type="button"
          className="link-underline mt-5 font-semibold text-forest-700"
          onClick={() => setStatus("idle")}
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="rv-name" className="field-label">
          Name <span aria-hidden="true" className="text-citrus-700">*</span>
        </label>
        <input id="rv-name" name="name" required className="field" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="rv-email" className="field-label">
          Email <span aria-hidden="true" className="text-citrus-700">*</span>
        </label>
        <input id="rv-email" name="email" type="email" required className="field" autoComplete="email" />
      </div>

      <fieldset className="sm:col-span-2">
        <legend className="field-label">Rating</legend>
        <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {Array.from({ length: 5 }, (_, i) => {
            const value = i + 1;
            const active = value <= (hover || rating);
            return (
              <button
                key={value}
                type="button"
                className={cn(
                  "rounded p-1 transition-colors",
                  active ? "text-gold-500" : "text-sand-300 hover:text-gold-400",
                )}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                aria-pressed={rating === value}
                onMouseEnter={() => setHover(value)}
                onClick={() => setRating(value)}
              >
                <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
                  <path
                    d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="sm:col-span-2">
        <label htmlFor="rv-title" className="field-label">
          Title <span className="font-normal text-ink-400">(optional)</span>
        </label>
        <input id="rv-title" name="title" className="field" maxLength={120} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="rv-body" className="field-label">
          Your review <span aria-hidden="true" className="text-citrus-700">*</span>
        </label>
        <textarea
          id="rv-body"
          name="body"
          required
          rows={4}
          className="field min-h-[7rem] resize-y"
          placeholder="How has it worked for your skin?"
        />
      </div>

      <div className="sm:col-span-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor={inputId} className="field-label mb-0">
            Photos <span className="font-normal text-ink-400">(optional)</span>
          </label>
          <p className="text-sm text-ink-400">
            JPG or PNG · up to {MAX_PHOTOS} · 10 MB each
          </p>
        </div>

        <input
          ref={fileRef}
          id={inputId}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          onChange={(e) => addPhotos(e.target.files)}
        />

        <ul className="mt-3 flex flex-wrap gap-3">
          {photos.map((photo) => (
            <li key={photo.id} className="relative">
              <img
                src={photo.preview}
                alt=""
                width={96}
                height={96}
                className="size-24 rounded-xl object-cover ring-1 ring-forest-700/10"
              />
              <button
                type="button"
                className="absolute -right-1.5 -top-1.5 flex size-7 items-center justify-center rounded-full bg-forest-900 text-cream-50 shadow-sm transition hover:bg-forest-700"
                aria-label="Remove photo"
                onClick={() => removePhoto(photo.id)}
              >
                <Icon name="close" className="size-3.5" />
              </button>
            </li>
          ))}

          {photos.length < MAX_PHOTOS && (
            <li>
              <button
                type="button"
                className="flex size-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-sand-400 bg-cream-50 text-ink-500 transition hover:border-forest-600 hover:bg-white hover:text-forest-700"
                onClick={() => fileRef.current?.click()}
              >
                <Icon name="plus" className="size-5" />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em]">Add</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      {error && (
        <p className="sm:col-span-2 text-sm text-[#b4452c]" role="alert">
          {error}
        </p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting…" : "Submit review"}
        </Button>
      </div>
    </form>
  );
}
