"use client";

import { useEffect, useState } from "react";
import * as m from "motion/react-m";
import { EASE_ORGANIC } from "@/lib/utils";

/**
 * Page transition. A template re-mounts on every navigation, so each new page
 * softly rises in. The very first page load is *not* animated: its content
 * must paint immediately (good LCP, and the splash already handles intros).
 */
let hasNavigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <m.div
      initial={animate ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: EASE_ORGANIC }}
    >
      {children}
    </m.div>
  );
}
