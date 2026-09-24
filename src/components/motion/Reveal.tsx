"use client";

import * as m from "motion/react-m";
import type { Variants } from "motion/react";
import { EASE_ORGANIC } from "@/lib/utils";

/**
 * Scroll reveals built on Motion's `whileInView` (a single shared
 * IntersectionObserver — effectively free on the main thread).
 * Only opacity + transform are animated so it stays on the compositor.
 */

const tags = {
  div: m.div,
  section: m.section,
  article: m.article,
  header: m.header,
  footer: m.footer,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  p: m.p,
  span: m.span,
  h2: m.h2,
  h3: m.h3,
  figure: m.figure,
} as const;

type Tag = keyof typeof tags;

interface RevealProps {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Starting vertical offset in px. */
  y?: number;
  /** Portion of the element that must be visible before it animates. */
  amount?: number;
  id?: string;
}

export function Reveal({ as = "div", children, className, delay = 0, y = 28, amount = 0.25, id }: RevealProps) {
  const Comp = tags[as] as typeof m.div;
  return (
    <Comp
      id={id}
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.95, delay, ease: EASE_ORGANIC }}
    >
      {children}
    </Comp>
  );
}

const groupVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_ORGANIC } },
};

/** Parent that staggers its <RevealItem> children in as it scrolls into view. */
export function RevealGroup({
  as = "div",
  children,
  className,
  stagger = 0.12,
  delay = 0,
  amount = 0.2,
}: Omit<RevealProps, "y"> & { stagger?: number }) {
  const Comp = tags[as] as typeof m.div;
  return (
    <Comp
      className={className}
      variants={groupVariants(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ as = "div", children, className }: Pick<RevealProps, "as" | "children" | "className">) {
  const Comp = tags[as] as typeof m.div;
  return (
    <Comp data-reveal="" className={className} variants={itemVariants}>
      {children}
    </Comp>
  );
}
