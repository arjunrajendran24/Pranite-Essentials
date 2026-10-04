"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { QuantitySelector } from "@/components/cart/QuantitySelector";
import { useCart, type CartProductSnapshot } from "@/components/cart/CartProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cn, EASE_ORGANIC, formatPrice } from "@/lib/utils";

export interface PurchaseOption {
  /** Variant name, e.g. "Pack of 2". */
  title: string;
  available: boolean;
  item: CartProductSnapshot;
}

/**
 * Variant choice (only when a product has several) + quantity + Add to cart +
 * Buy now. On phones/tablets a compact bar slides up from the bottom once the
 * main button scrolls out of view, so purchasing is always one tap away.
 */
export function ProductPurchase({ options }: { options: PurchaseOption[] }) {
  const [selected, setSelected] = useState(() => Math.max(0, options.findIndex((o) => o.available)));
  const [qty, setQty] = useState(1);
  const [sticky, setSticky] = useState(false);
  const [buying, setBuying] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const { add, checkout } = useCart();
  const { item, available } = options[selected];
  const cartLabel = available ? undefined : "Sold out";

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      setSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Back from Shopify checkout via the browser's Back button: re-enable "Buy it now".
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => e.persisted && setBuying(false);
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const buyNow = async () => {
    setBuying(true);
    await add(item, qty, { open: false });
    if (!(await checkout())) setBuying(false);
  };

  return (
    <>
      <div ref={anchor} className="space-y-3">
        {options.length > 1 && (
          <fieldset className="mb-5">
            <legend className="field-label">Choose</legend>
            <div className="flex flex-wrap gap-2">
              {options.map((o, i) => (
                <button
                  key={o.item.variantId}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-pressed={i === selected}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
                    i === selected
                      ? "border-forest-700 bg-forest-700 text-cream-50"
                      : "border-forest-700/20 bg-cream-50 text-ink-700 hover:border-forest-700/60",
                    !o.available && "line-through decoration-1 opacity-60",
                  )}
                >
                  {o.title} · <span className="tabular-nums">{formatPrice(o.item.price)}</span>
                  {!o.available && <span className="sr-only"> (sold out)</span>}
                </button>
              ))}
            </div>
          </fieldset>
        )}
        <div className="flex flex-wrap gap-3">
          <QuantitySelector value={qty} onChange={setQty} />
          <AddToCartButton item={item} quantity={qty} disabled={!available} label={cartLabel} className="min-w-[13rem] flex-1" />
        </div>
        <Button variant="secondary" size="lg" className="w-full" onClick={buyNow} disabled={!available || buying} aria-busy={buying || undefined}>
          {buying ? "Opening secure checkout…" : "Buy it now"}
        </Button>
        <ButtonLink href="/contact?topic=bulk-order" variant="ghost" size="md" className="w-full" icon="arrow-right">
          Bulk order enquiry
        </ButtonLink>
        {!available && (
          <p className="text-sm text-ink-500">
            Sold out for now — fresh batches arrive regularly. Follow us on Instagram to hear first.
          </p>
        )}
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
                {item.image && <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-base leading-tight text-forest-900">{item.name}</p>
                <p className="text-sm font-semibold tabular-nums text-ink-700">{formatPrice(item.price)}</p>
              </div>
              <AddToCartButton item={item} quantity={qty} size="md" label={available ? "Add" : "Sold out"} disabled={!available} className="px-5" />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
