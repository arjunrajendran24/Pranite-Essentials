"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/icons/Icons";
import { SingleLeaf } from "@/components/decor/Botanicals";
import { formatPrice } from "@/lib/utils";
import { shippingFacts } from "@/content/site";
import { useCart } from "./CartProvider";
import { QuantitySelector } from "./QuantitySelector";
import { LoginPrompt } from "@/components/account/LoginPrompt";

/** Full cart page. */
export function CartView() {
  const { items, subtotal, count, setQuantity, remove, hydrated } = useCart();

  if (!hydrated) {
    return <div className="h-72 animate-pulse rounded-[2rem] bg-sand-200/40" aria-busy="true" aria-label="Loading cart" />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[2.5rem] bg-sage-50 px-6 py-20 text-center">
        <SingleLeaf className="w-16" />
        <h2 className="text-h2 mt-6 text-forest-900">Your cart is empty</h2>
        <p className="mt-3 max-w-sm text-ink-500">Discover formulations where nature meets science.</p>
        <ButtonLink href="/catalog" icon="arrow-right" className="mt-8">
          Continue shopping
        </ButtonLink>
        <LoginPrompt className="mt-6" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)] lg:gap-14">
      <section aria-labelledby="cart-items-title">
        <h2 id="cart-items-title" className="sr-only">
          Items in your cart
        </h2>
        <ul className="divide-y divide-forest-700/10 border-y border-forest-700/10">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <m.li
                key={item.handle}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="flex gap-5 py-6 md:gap-7"
              >
                <Link
                  href={`/products/${item.handle}`}
                  className="relative size-28 shrink-0 overflow-hidden rounded-[1.25rem] bg-sand-200 md:size-36"
                >
                  <Image src={item.image} alt={item.imageAlt} fill sizes="144px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <Link href={`/products/${item.handle}`} className="link-underline font-serif text-2xl text-forest-900">
                        {item.name}
                      </Link>
                      <p className="text-sm text-ink-500">{item.subtitle}</p>
                      <p className="mt-1 text-sm tabular-nums text-ink-500">{formatPrice(item.price)} each</p>
                    </div>
                    <p className="font-serif text-xl tabular-nums text-forest-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-5 pt-4">
                    <QuantitySelector value={item.quantity} onChange={(q) => setQuantity(item.handle, q)} label={`Quantity for ${item.name}`} />
                    <button
                      type="button"
                      onClick={() => remove(item.handle)}
                      className="inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-citrus-700"
                    >
                      <Icon name="trash" className="size-4" /> Remove
                    </button>
                  </div>
                </div>
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
        <Link href="/catalog" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest-700">
          <Icon name="chevron-left" className="size-4" /> <span className="link-underline">Continue shopping</span>
        </Link>
      </section>

      <aside aria-labelledby="summary-title" className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[2rem] bg-cream-50 p-7 shadow-card md:p-9">
          <h2 id="summary-title" className="text-h3 text-forest-900">
            Order summary
          </h2>
          <dl className="mt-6 space-y-3 text-ink-600">
            <div className="flex justify-between">
              <dt>
                Subtotal ({count} item{count === 1 ? "" : "s"})
              </dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd className="font-semibold text-forest-700">Free</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-forest-700/10 pt-4 text-ink-900">
              <dt className="font-semibold">Total</dt>
              <dd className="font-serif text-2xl tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <p className="mt-1 text-xs text-ink-500">Inclusive of all taxes</p>
          <ButtonLink href="/checkout" size="lg" icon="arrow-right" className="mt-7 w-full">
            Checkout
          </ButtonLink>
          <LoginPrompt className="mt-4 text-center" />
          <ul className="mt-6 space-y-2 text-sm text-ink-500">
            <li className="flex items-center gap-2">
              <Icon name="truck" className="size-4 text-forest-600" /> {shippingFacts.dispatch}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="lock" className="size-4 text-forest-600" /> Prepaid only — no cash on delivery
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
