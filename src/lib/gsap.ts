"use client";

/**
 * Central GSAP registry. Only client components that actually run GSAP import
 * this file, so GSAP never ships in the shared first-load bundle — it is split
 * into the chunks of the routes (and lazily-loaded sections) that use it.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
gsap.defaults({ ease: "power3.out", duration: 1 });

/** Media-query conditions shared by every gsap.matchMedia() call. */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
} as const;

/** True on devices flagged as low-power by the <head> script (see SplashScript). */
export function isLiteDevice() {
  return typeof document !== "undefined" && document.documentElement.dataset.lite === "1";
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
