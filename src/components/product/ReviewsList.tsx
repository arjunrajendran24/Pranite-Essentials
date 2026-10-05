"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { StarRating } from "@/components/product/StarRating";
import type { ProductReview } from "@/lib/judgeme";

const INITIAL_VISIBLE = 5;

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return "";
  }
}

/**
 * Review list with “View more” when there are more than {@link INITIAL_VISIBLE} reviews.
 */
export function ReviewsList({ reviews }: { reviews: ProductReview[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = reviews.length > INITIAL_VISIBLE;
  const visible = expanded || !hasMore ? reviews : reviews.slice(0, INITIAL_VISIBLE);
  const hiddenCount = reviews.length - INITIAL_VISIBLE;

  return (
    <div>
      <ul className="mt-12 divide-y divide-forest-700/10 border-y border-forest-700/10">
        {visible.map((review, i) => (
          <Reveal as="li" key={review.id} delay={Math.min(i * 0.04, 0.2)} y={12} className="py-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <StarRating rating={review.rating} size="sm" />
              <p className="font-semibold text-forest-900">{review.reviewerName}</p>
              {review.verified && (
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-forest-600">
                  Verified
                </span>
              )}
              <time className="text-sm text-ink-400" dateTime={review.createdAt}>
                {formatDate(review.createdAt)}
              </time>
            </div>
            {review.title && <p className="mt-3 font-serif text-xl text-forest-800">{review.title}</p>}
            <p className="mt-2 leading-relaxed text-ink-600">{review.body}</p>
            {review.pictures.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {review.pictures.map((src) => (
                  <li key={src}>
                    {/* Judge.me CDN hosts vary; plain img avoids remotePatterns churn. */}
                    <img
                      src={src}
                      alt=""
                      width={96}
                      height={96}
                      className="size-24 rounded-xl object-cover"
                      loading="lazy"
                    />
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        ))}
      </ul>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            type="button"
            className="link-underline font-semibold text-forest-700"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : `View more (${hiddenCount} more)`}
          </button>
        </div>
      )}
    </div>
  );
}
