import { cn } from "@/lib/utils";

/**
 * The Pranite sprout — a vector echo of the logo's tree-in-a-P mark
 * (brown trunk, two leaves, a single drop). Each part carries a data-part
 * attribute so the splash timeline can grow it piece by piece.
 */
export function LeafMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 120 150"
      className={cn("overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <circle data-part="halo" pathLength={1} cx="60" cy="72" r="54" fill="none" stroke="var(--color-sage-300)" strokeWidth="1" />
      <g fill="none" stroke="var(--color-bark-600)" strokeLinecap="round">
        <path data-part="trunk" pathLength={1} d="M60 138C60 122 59 108 60 96c1-16 8-30 22-40" strokeWidth="5" />
        <path data-part="branch" pathLength={1} d="M60 110c-5-12-13-20-24-26" strokeWidth="4" />
        <path data-part="ground" pathLength={1} d="M46 138h28" strokeWidth="4" />
      </g>
      <g data-part="leaf-r">
        <path d="M80 60c-8-20 0-42 24-50 6 24-4 44-24 50Z" fill="var(--color-leaf-400)" />
        <path d="M81.5 57c5-12 11-26 20-40" fill="none" stroke="var(--color-forest-600)" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
      </g>
      <g data-part="leaf-l">
        <path d="M39 86c-19 2-31-14-31-36 20 2 34 16 31 36Z" fill="var(--color-leaf-500)" />
        <path d="M37 83c-7-9-15-18-24-28" fill="none" stroke="var(--color-forest-600)" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
      </g>
      <path
        data-part="drop"
        d="M74 100s-6.5 8-6.5 12.5a6.5 6.5 0 0 0 13 0C80.5 108 74 100 74 100Z"
        fill="var(--color-forest-700)"
      />
    </svg>
  );
}
