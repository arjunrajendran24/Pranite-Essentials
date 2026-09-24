"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Icon } from "@/components/icons/Icons";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCart, type CartItem } from "./CartProvider";

/**
 * Add-to-cart with a calm confirmation: the label cross-fades to "Added" with
 * a check, then settles back. The cart drawer opens unless `openCart={false}`.
 */
export function AddToCartButton({
  item,
  quantity = 1,
  variant = "primary",
  size = "lg",
  className,
  openCart = true,
  label = "Add to cart",
  disabled,
}: {
  item: Omit<CartItem, "quantity">;
  quantity?: number;
  variant?: "primary" | "citrus" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
  openCart?: boolean;
  label?: string;
  disabled?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = () => {
    add(item, quantity, { open: openCart });
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses({ variant, size, className: cn("overflow-hidden", className) })}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={added ? "added" : "idle"}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2"
        >
          {added ? (
            <>
              <Icon name="check" className="size-[1.1em]" /> Added to cart
            </>
          ) : (
            <>
              <Icon name="bag" className="size-[1.1em]" /> {label}
            </>
          )}
        </m.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {added ? `${item.name} added to cart` : ""}
      </span>
    </button>
  );
}
