import { Reveal } from "@/components/motion/Reveal";
import { RatingBadge, StarRating } from "@/components/product/StarRating";
import { ReviewForm } from "@/components/product/ReviewForm";
import type { ProductReview, ReviewSummary } from "@/lib/judgeme";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return "";
  }
}

/**
 * Product reviews section — summary, list, and write form. Designed to match
 * the Pranite product page: one purpose, no card clutter.
 */
export function ProductReviews({
  productId,
  productName,
  summary,
  reviews,
}: {
  productId: string;
  productName: string;
  summary: ReviewSummary;
  reviews: ProductReview[];
}) {
  return (
    <section aria-labelledby="product-reviews-title" className="container-page max-w-4xl py-24 md:py-32">
      <Reveal>
        <p className="eyebrow">From customers</p>
        <h2 id="product-reviews-title" className="text-h2 mt-4 text-forest-900">
          Reviews of <span className="italic-accent text-forest-600">{productName}</span>
        </h2>
        {summary.count > 0 ? (
          <div className="mt-5">
            <RatingBadge average={summary.average} count={summary.count} />
          </div>
        ) : (
          <p className="mt-5 text-ink-500">Be the first to share how it worked for you.</p>
        )}
      </Reveal>

      {reviews.length > 0 && (
        <ul className="mt-12 divide-y divide-forest-700/10 border-y border-forest-700/10">
          {reviews.map((review, i) => (
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
      )}

      <Reveal delay={0.08} y={16} className="mt-14">
        <h3 className="font-serif text-2xl text-forest-900">Write a review</h3>
        <p className="mt-2 text-ink-500">Honest feedback helps others choose with confidence.</p>
        <div className="mt-8">
          <ReviewForm productId={productId} productName={productName} />
        </div>
      </Reveal>
    </section>
  );
}
