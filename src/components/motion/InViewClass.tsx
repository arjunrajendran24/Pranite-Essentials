"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Adds `.is-inview` once the element scrolls into view — used to trigger
 * pure-CSS effects such as `.draw-icon` stroke drawing (no per-frame JS).
 */
export function InViewClass({
  children,
  className,
  amount = 0.4,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return (
    <div ref={ref} className={cn(className, inView && "is-inview")}>
      {children}
    </div>
  );
}
