import { cn } from "@/lib/utils";

/**
 * Light line-art botanicals used as floating accents (hero, sections).
 * Pure SVG — no images to download, crisp at any size, cheap to transform.
 */

type Props = { className?: string };

export function OrangeSlice({ className }: Props) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("overflow-visible", className)}>
      <circle cx="50" cy="50" r="46" fill="var(--color-citrus-400)" opacity=".92" />
      <circle cx="50" cy="50" r="40" fill="var(--color-citrus-100)" />
      <g fill="var(--color-citrus-400)">
        {Array.from({ length: 10 }).map((_, i) => (
          <path
            key={i}
            d="M50 50 L47 16 Q50 13 53 16 Z"
            transform={`rotate(${i * 36} 50 50)`}
            opacity=".85"
          />
        ))}
      </g>
      <g fill="var(--color-citrus-500)" opacity=".55">
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={i} d="M50 47 L43.5 18.5 Q50 14 56.5 18.5 Z" transform={`rotate(${i * 36 + 18} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="4" fill="var(--color-citrus-100)" />
    </svg>
  );
}

export function LeafSprig({ className }: Props) {
  return (
    <svg
      viewBox="0 0 120 160"
      aria-hidden="true"
      fill="none"
      stroke="var(--color-forest-600)"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("overflow-visible", className)}
    >
      <path d="M60 156C58 120 62 70 84 8" />
      {[
        { y: 128, d: "M59.5 128c-14-3-26-14-30-30 16 1 27 12 30 30Z" },
        { y: 104, d: "M60.5 104c13-4 24-16 27-32-15 2-26 14-27 32Z" },
        { y: 82, d: "M63 82c-14-4-24-16-26-31 15 2 25 13 26 31Z" },
        { y: 58, d: "M67 58c12-5 21-17 22-31-13 3-22 14-22 31Z" },
        { y: 38, d: "M72 38c-11-5-18-15-18-27 12 3 18 12 18 27Z" },
      ].map((l) => (
        <path key={l.y} d={l.d} fill="var(--color-sage-200)" fillOpacity=".55" />
      ))}
    </svg>
  );
}

export function SingleLeaf({ className }: Props) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={cn("overflow-visible", className)}>
      <path d="M12 70C8 38 30 12 70 8c4 40-22 62-58 62Z" fill="var(--color-leaf-400)" />
      <path d="M12 70 58 20" stroke="var(--color-forest-600)" strokeWidth="1.4" strokeLinecap="round" opacity=".6" fill="none" />
    </svg>
  );
}

/** Soft organic wave used to bridge two coloured sections. */
export function WaveDivider({ className, flip = false }: Props & { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("block h-10 w-full md:h-16", flip && "rotate-180", className)}
    >
      <path d="M0 80V36C180 6 360 0 540 16s360 48 540 44 270-30 360-44v28Z" fill="currentColor" />
    </svg>
  );
}

/** Circular rotating text badge: "Where nature meets science ✦ …". */
export function CircleText({ text, className }: Props & { text: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      <defs>
        <path id="circle-text-path" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
      </defs>
      <text
        fill="currentColor"
        style={{ fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}
      >
        <textPath href="#circle-text-path" textLength="488" lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
