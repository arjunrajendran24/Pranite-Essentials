"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { QuantitySelector } from "@/components/cart/QuantitySelector";
import { useCart, type CartItem } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { EASE_ORGANIC, formatPrice } from "@/lib/utils";

/**
 * Quantity + Add to cart + Buy now. On phones/tablets a compact bar slides up
 * from the bottom once the main button scrolls out of view, so purchasing is
 * always one tap away.
 */
export function ProductPurchase({ item, available }: { item: Omit<CartItem, "quantity">; available: boolean }) {
  const [qty, setQty] = useState(1);
  const [sticky, setSticky] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { add } = useCart();

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      setSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const buyNow = () => {
    add(item, qty, { open: false });
    router.push("/checkout");
  };

  return (
    <>
      <div ref={anchor} className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <QuantitySelector value={qty} onChange={setQty} />
          <AddToCartButton item={item} quantity={qty} disabled={!available} className="min-w-[13rem] flex-1" />
        </div>
        <Button variant="secondary" size="lg" className="w-full" onClick={buyNow} disabled={!available}>
          Buy it now
        </Button>
      </div>

      <AnimatePresence>
        {sticky && (
          <m.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.5, ease: EASE_ORGANIC }}
            className="lite-no-blur fixed inset-x-0 bottom-0 z-[55] border-t border-forest-700/10 bg-cream-50/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_30px_-20px_rgb(31_74_44/0.45)] backdrop-blur-md lg:hidden"
          >
            <div className="mx-auto flex max-w-2xl items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-sand-200">
                <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-base leading-tight text-forest-900">{item.name}</p>
                <p className="text-sm font-semibold tabular-nums text-ink-700">{formatPrice(item.price)}</p>
              </div>
              <AddToCartButton item={item} quantity={qty} size="md" label="Add" disabled={!available} className="px-5" />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
