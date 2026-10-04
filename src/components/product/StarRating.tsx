import { cn } from "@/lib/utils";

/**
 * Star rating display. Uses filled gold stars for the average (or exact)
 * rating; half-star via a clipped fill when `average` is fractional.
 */
export function StarRating({
  rating,
  size = "md",
  className,
  label,
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Accessible label; defaults to "Rated X out of 5". */
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(5, rating));
  const sizes = { sm: "size-3.5", md: "size-4.5", lg: "size-5" } as const;

  return (
    <span
      className={cn("inline-flex items-center gap-0.5 text-gold-500", className)}
      role="img"
      aria-label={label ?? `Rated ${clamped.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, clamped - i));
        return (
          <span key={i} className={cn("relative inline-block", sizes[size])} aria-hidden="true">
            <StarPath className="absolute inset-0 text-sand-300" filled />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden text-gold-500" style={{ width: `${fill * 100}%` }}>
                <StarPath className={cn("block", sizes[size])} filled />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

function StarPath({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Compact “★★★★★ 4.9 (12)” row for product titles and cards. */
export function RatingBadge({
  average,
  count,
  size = "md",
  className,
}: {
  average: number;
  count: number;
  size?: "sm" | "md";
  className?: string;
}) {
  if (count <= 0) return null;
  return (
    <p className={cn("flex flex-wrap items-center gap-2 text-ink-600", size === "sm" ? "text-sm" : "text-[0.95rem]", className)}>
      <StarRating rating={average} size={size === "sm" ? "sm" : "md"} />
      <span className="tabular-nums">
        <span className="font-semibold text-forest-800">{average.toFixed(1)}</span>
        <span className="text-ink-400"> · {count} {count === 1 ? "review" : "reviews"}</span>
      </span>
    </p>
  );
}
