"use client";

import { useId, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Icon } from "@/components/icons/Icons";
import { cn, EASE_ORGANIC } from "@/lib/utils";

export interface AccordionItem {
  id?: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

/**
 * Accessible disclosure list (WAI-ARIA accordion pattern): each header is a
 * real <button> with aria-expanded/aria-controls, panels are labelled regions.
 * Panel height animates with Motion; reduced-motion users get an instant swap.
 */
export function Accordion({
  items,
  defaultOpen = [],
  className,
  tone = "dark",
}: {
  items: AccordionItem[];
  defaultOpen?: number[];
  className?: string;
  tone?: "dark" | "light";
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen));
  const baseId = useId();

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className={cn("divide-y", tone === "light" ? "divide-cream-50/15" : "divide-forest-700/12", className)}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.id ?? i} id={item.id}>
            <h3 className="font-sans text-base font-semibold tracking-normal">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className={cn(
                  "group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors",
                  tone === "light" ? "text-cream-50 hover:text-leaf-300" : "text-ink-900 hover:text-forest-600",
                )}
              >
                <span className="text-[1.02rem] leading-snug">{item.title}</span>
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-organic)]",
                    tone === "light" ? "border-cream-50/25" : "border-forest-700/20 group-hover:border-forest-700/50",
                    isOpen && "rotate-45",
                    isOpen && (tone === "light" ? "bg-cream-50/10" : "bg-forest-700/5"),
                  )}
                >
                  <Icon name="plus" className="size-4" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_ORGANIC }}
                  className="overflow-hidden"
                >
                  <div className={cn("pb-6 pr-12 leading-relaxed", tone === "light" ? "text-sage-200" : "text-ink-500")}>
                    {item.content}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
