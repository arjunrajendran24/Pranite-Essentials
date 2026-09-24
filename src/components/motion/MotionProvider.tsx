"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { EASE_ORGANIC } from "@/lib/utils";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/**
 * App-wide Motion setup.
 * - LazyMotion + `m` components keep the Motion runtime tiny and tree-shaken.
 * - `strict` makes accidental use of the heavy `motion.*` components an error.
 * - reducedMotion="user" drops transform animations for people who ask for it,
 *   keeping only gentle opacity fades.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.8, ease: EASE_ORGANIC }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
