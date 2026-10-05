"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Write-a-review form. Posts to `/api/reviews` so the Judge.me private token
 * never reaches the browser.
 */
export function ReviewForm({ productId, productName }: { productId: string; productName: string }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Capture before await — React nulls synthetic event currentTarget afterward.
    const form = e.currentTarget;
    setStatus("submitting");
    setError("");

    const data = new FormData(form);
    const payload = {
      productId,
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      title: String(data.get("title") ?? "").trim(),
      body: String(data.get("body") ?? "").trim(),
      rating,
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error || "Could not submit your review.");
        return;
      }
      form.reset();
      setRating(5);
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
