import type { Money } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Price with Shopify's compare-at price struck through and the saving, when
 * the product is on sale. Server-safe (no client JS).
 */
export function Price({
  price,
  compareAtPrice,
  from = false,
  className,
  compareClassName,
}: {
  price: Money;
  compareAtPrice?: Money;
  /** Prefix "From" when variants are priced differently. */
  from?: boolean;
  className?: string;
  compareClassName?: string;
}) {
  const saving = compareAtPrice ? Math.round((1 - price.amount / compareAtPrice.amount) * 100) : 0;
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span className={cn("tabular-nums", className)}>
        <span className="sr-only">{compareAtPrice ? "Sale price: " : "Price: "}</span>
        {from && <span className="text-[0.7em]">From </span>}
        {formatPrice(price.amount)}
      </span>
      {compareAtPrice && (
        <>
          <s className={cn("text-sm tabular-nums text-ink-400", compareClassName)}>
            <span className="sr-only">Regular price: </span>
            {formatPrice(compareAtPrice.amount)}
          </s>
          {saving > 0 && (
            <span className="rounded-full bg-citrus-100 px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-citrus-700">
              Save {saving}%
            </span>
          )}
        </>
      )}
    </span>
  );
}
