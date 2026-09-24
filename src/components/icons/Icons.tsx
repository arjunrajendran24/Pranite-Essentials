import { cn } from "@/lib/utils";

/* ==========================================================================
   UI icons — 24px grid, 1.5 stroke, round joins. Decorative by default
   (aria-hidden); give the *button* an accessible label instead.
   ========================================================================== */

const ui = {
  bag: (
    <>
      <path d="M5.5 8.5h13l-1.1 11.2a1.5 1.5 0 0 1-1.5 1.3H8.1a1.5 1.5 0 0 1-1.5-1.3L5.5 8.5Z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 8h16M4 16h11" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <path d="M5 4h3.6l1.9 4.8-2.4 1.5a11 11 0 0 0 5.6 5.6l1.5-2.4L20 15.4V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  ),
  "map-pin": (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  package: (
    <>
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" />,
  pause: <path d="M8.5 5.5v13M15.5 5.5v13" />,
  leaf: (
    <>
      <path d="M5 19C4 11 9 5 19 4c1 10-5 15-13 15" />
      <path d="M5 19 15 8" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />,
} as const;

export type IconName = keyof typeof ui;

export function Icon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("size-5 shrink-0", className)}
    >
      {ui[name]}
    </svg>
  );
}

/* ==========================================================================
   Botanical line illustrations — 48px grid. Every shape has pathLength="1" so
   `.draw-icon` can draw it in with a pure-CSS stroke-dashoffset transition.
   ========================================================================== */

const L = { pathLength: 1 } as const;

const botanical = {
  sun: (
    <>
      <circle cx="24" cy="24" r="8" {...L} />
      <path
        d="M24 6v5M24 37v5M6 24h5M37 24h5M11.3 11.3l3.5 3.5M33.2 33.2l3.5 3.5M36.7 11.3l-3.5 3.5M11.3 36.7l3.5-3.5"
        {...L}
      />
    </>
  ),
  spots: (
    <>
      <circle cx="22" cy="26" r="15" {...L} />
      <circle cx="17" cy="22" r="2.2" {...L} />
      <circle cx="25" cy="31" r="1.6" {...L} />
      <circle cx="27.5" cy="20" r="1.1" {...L} />
      <path d="M40 4v9M35.5 8.5h9" {...L} />
    </>
  ),
  pores: (
    <>
      <circle cx="21" cy="21" r="12" {...L} />
      <path d="m30 30 11 11" {...L} />
      <circle cx="17" cy="18" r="1.3" {...L} />
      <circle cx="24" cy="23" r="1.3" {...L} />
      <circle cx="18.5" cy="26" r="1" {...L} />
    </>
  ),
  tone: (
    <>
      <circle cx="24" cy="24" r="15" {...L} />
      <path d="M9.5 24c5-4.5 9.5 4.5 14.5 0s9.5-4.5 14.5 0" {...L} />
      <path d="M13 17c4-3 7 3 11 0s7-3 11 0" {...L} />
    </>
  ),
  drop: (
    <>
      <path d="M24 6c-6 9-12 15.5-12 22a12 12 0 0 0 24 0c0-6.5-6-13-12-22Z" {...L} />
      <path d="M18 29a6.5 6.5 0 0 0 5.5 5.5" {...L} />
    </>
  ),
  feather: (
    <>
      <path d="M40 7c-14 1-25 11-27 25-.3 2.3-.3 4.3 0 6 9 .5 18-4 23-12 4-6 5-13 4-19Z" {...L} />
      <path d="M8 42 31 17" {...L} />
      <path d="M19 30h9M24 23h8" {...L} />
    </>
  ),
  leaf: (
    <>
      <path d="M10 38C8 22 18 10 38 8c2 20-10 30-26 30" {...L} />
      <path d="M10 38 30 16" {...L} />
    </>
  ),
  flask: (
    <>
      <path d="M18.5 6h11M21 6v12L10 37a4 4 0 0 0 3.5 6h21a4 4 0 0 0 3.5-6L27 18V6" {...L} />
      <path d="M14 30h20" {...L} />
      <circle cx="21" cy="36" r="1.6" {...L} />
      <circle cx="27.5" cy="34" r="1" {...L} />
    </>
  ),
  rabbit: (
    <>
      <circle cx="24" cy="31" r="10" {...L} />
      <path d="M19.5 22c-3-6-4-13-1-15s6 5 5 14M28.5 22c3-6 4-13 1-15s-6 5-5 14" {...L} />
      <path d="M22.5 35.5h3" {...L} />
      <circle cx="20" cy="30" r="0.9" {...L} />
      <circle cx="28" cy="30" r="0.9" {...L} />
    </>
  ),
  sparkle: (
    <>
      <path d="M22 6c1.5 9 4 11.5 13 13-9 1.5-11.5 4-13 13-1.5-9-4-11.5-13-13 9-1.5 11.5-4 13-13Z" {...L} />
      <path d="M37 30c.6 3.2 1.6 4.2 4.8 4.8-3.2.6-4.2 1.6-4.8 4.8-.6-3.2-1.6-4.2-4.8-4.8 3.2-.6 4.2-1.6 4.8-4.8Z" {...L} />
    </>
  ),
  orange: (
    <>
      <circle cx="24" cy="24" r="16" {...L} />
      <circle cx="24" cy="24" r="12.5" {...L} />
      <path d="M24 12v24M13.2 18l21.6 12M13.2 30l21.6-12" {...L} />
    </>
  ),
  molecule: (
    <>
      <circle cx="14" cy="32" r="4" {...L} />
      <circle cx="24" cy="18" r="4" {...L} />
      <circle cx="36" cy="30" r="4" {...L} />
      <circle cx="35" cy="9" r="3" {...L} />
      <path d="m16.4 28.8 5.3-7.6M27.1 20.6l6 6.6M27 15.8l5.4-4.6" {...L} />
    </>
  ),
  milk: (
    <>
      <path d="M19 6h10v5l4 6v21a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4V17l4-6V6Z" {...L} />
      <path d="M15 25c3-2 6 2 9 0s6-2 9 0" {...L} />
    </>
  ),
  dropper: (
    <>
      <path d="M31 7.5a5 5 0 0 1 7 0l1.5 1.5a5 5 0 0 1 0 7L36 19.5 28 11.5l3-4Z" {...L} />
      <path d="M29 14 14 29l-2 6.5 6.5-2L33.5 18.5" {...L} />
      <path d="M9 41.5c0-1.6 1.6-3.6 2.2-4.2.6.6 2.2 2.6 2.2 4.2a2.2 2.2 0 0 1-4.4 0Z" {...L} />
    </>
  ),
  sls: (
    <>
      <circle cx="24" cy="24" r="17" {...L} />
      <path d="M24 13.5c-3 4.5-6 7.8-6 11a6 6 0 0 0 12 0c0-3.2-3-6.5-6-11Z" {...L} />
      <path d="M12 36 36 12" {...L} />
    </>
  ),
  paraben: (
    <>
      <circle cx="24" cy="24" r="17" {...L} />
      <path d="M24 35V22" {...L} />
      <path d="M24 24c0-5 3-8 8-8 0 5-3 8-8 8ZM24 29c0-4-2.5-6.5-7-6.5 0 4 2.5 6.5 7 6.5Z" {...L} />
    </>
  ),
  shield: (
    <>
      <path d="M24 5.5 38 11v11c0 9-6 16-14 20.5C16 38 10 31 10 22V11l14-5.5Z" {...L} />
      <path d="m18 23.5 4.5 4.5L31 19.5" {...L} />
    </>
  ),
  hand: (
    <>
      <path
        d="M16 26V12a2.5 2.5 0 0 1 5 0v10M21 22V9a2.5 2.5 0 0 1 5 0v13M26 22V11a2.5 2.5 0 0 1 5 0v14M31 25v-7a2.5 2.5 0 0 1 5 0v10c0 8-5 14-13 14-5 0-8-3-11-7l-4.5-6.5a2.5 2.5 0 0 1 4-3L16 26"
        {...L}
      />
    </>
  ),
} as const;

export type BotanicalName = keyof typeof botanical;

export function BotanicalIcon({
  name,
  className,
  draw = false,
  strokeWidth = 1.4,
}: {
  name: BotanicalName;
  className?: string;
  /** Draw the strokes in when an ancestor (or this svg) gets `.is-inview`. */
  draw?: boolean;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("size-10 shrink-0", draw && "draw-icon", className)}
    >
      {botanical[name]}
    </svg>
  );
}
