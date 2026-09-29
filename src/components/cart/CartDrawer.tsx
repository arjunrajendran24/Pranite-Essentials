"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Icon } from "@/components/icons/Icons";
import { ButtonLink } from "@/components/ui/Button";
import { SingleLeaf } from "@/components/decor/Botanicals";
import { EASE_ORGANIC, formatPrice } from "@/lib/utils";
import { shippingFacts } from "@/content/site";
import { useCart } from "./CartProvider";
import { QuantitySelector } from "./QuantitySelector";
import { CheckoutButton } from "./CheckoutButton";
import { CartNotice } from "./CartNotice";
import { LoginPrompt } from "@/components/account/LoginPrompt";

/**
 * Slide-in cart. Modal dialog semantics: focus moves in on open, Tab is
 * trapped inside, Escape closes, focus returns to whatever opened it.
 */
export function CartDrawer() {
  const { items, isOpen, close, subtotal, count, setQuantity, remove, pending } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  // Close when navigating (e.g. "View cart" / "Checkout" links inside).
  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!isOpen) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]">
          <m.div
            className="absolute inset-0 bg-forest-950/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={close}
            aria-hidden="true"
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream-100 shadow-2xl sm:rounded-l-[2rem]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: EASE_ORGANIC }}
          >
            <div className="flex items-center justify-between border-b border-forest-700/10 px-6 py-5">
              <h2 id="cart-title" className="text-2xl text-forest-900">
                Your cart {count > 0 && <span className="font-sans text-base text-ink-500">({count})</span>}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="grid size-10 place-items-center rounded-full text-ink-700 transition-colors hover:bg-forest-700/8"
                aria-label="Close cart"
              >
                <Icon name="close" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <CartNotice className="w-full text-left" />
                <SingleLeaf className="size-16 opacity-80" />
                <p className="text-h3 text-forest-900">Your cart is empty</p>
                <p className="text-ink-500">Discover formulations where nature meets science.</p>
                <ButtonLink href="/catalog" icon="arrow-right" onClick={close}>
                  Continue shopping
                </ButtonLink>
                <LoginPrompt className="mt-2" onNavigate={close} />
              </div>
            ) : (
              <>
                <CartNotice className="mx-6 mt-4" />
                <ul className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <m.li
                        key={item.variantId}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.4 }}
                        className="flex gap-4"
                      >
                        <Link
                          href={`/products/${item.handle}`}
                          className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-sand-200"
                          onClick={close}
                        >
                          {item.image && <Image src={item.image} alt={item.imageAlt} fill sizes="96px" className="object-cover" />}
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-serif text-lg leading-tight text-forest-900">{item.name}</p>
                              <p className="text-sm text-ink-500">{item.subtitle}</p>
                            </div>
                            <p className="font-semibold tabular-nums text-ink-900">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <QuantitySelector
                              size="sm"
                              value={item.quantity}
                              onChange={(q) => setQuantity(item.variantId, q)}
                              label={`Quantity for ${item.name}`}
                            />
                            <button
                              type="button"
                              onClick={() => remove(item.variantId)}
                              className="link-underline text-sm text-ink-500 hover:text-citrus-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </m.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-forest-700/10 bg-cream-50 px-6 py-6 sm:rounded-bl-[2rem]">
                  <div className="flex items-baseline justify-between">
                    <span className="text-ink-600">Subtotal</span>
                    <span className={`font-serif text-2xl tabular-nums text-forest-900 transition-opacity ${pending ? "opacity-60" : ""}`}>
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-500">
                    <Icon name="truck" className="size-4 text-forest-600" /> {shippingFacts.freeShipping}
                  </p>
                  <div className="mt-5 grid gap-3">
                    <CheckoutButton />
                    <ButtonLink href="/cart" variant="secondary">
                      View cart
                    </ButtonLink>
                  </div>
                  <LoginPrompt className="mt-4 text-center" onNavigate={close} />
                </div>
              </>
            )}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
