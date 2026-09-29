"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Icon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";
import { useCart } from "./CartProvider";

/** Shopify's cart messages (e.g. "only 3 left") and failed updates, shown calmly above the cart. */
export function CartNotice({ className }: { className?: string }) {
  const { notice, dismissNotice } = useCart();
  return (
    <AnimatePresence initial={false}>
      {notice && (
        <m.div
          role="status"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className={cn("flex items-start gap-3 rounded-xl bg-citrus-100 px-4 py-3 text-sm text-citrus-700", className)}
        >
          <p className="flex-1">{notice}</p>
          <button
            type="button"
            onClick={dismissNotice}
            className="-m-1 grid size-6 shrink-0 place-items-center rounded-full hover:bg-citrus-700/10"
            aria-label="Dismiss message"
          >
            <Icon name="close" className="size-3.5" />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
