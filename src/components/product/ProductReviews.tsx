import { Reveal } from "@/components/motion/Reveal";
import { RatingBadge } from "@/components/product/StarRating";
import { ReviewForm } from "@/components/product/ReviewForm";
import { ReviewsList } from "@/components/product/ReviewsList";
import type { ProductReview, ReviewSummary } from "@/lib/judgeme";

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

      {reviews.length > 0 && <ReviewsList reviews={reviews} />}

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
