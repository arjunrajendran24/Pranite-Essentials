"use client";

import { useSearchParams } from "next/navigation";
import * as m from "motion/react-m";
import { ButtonLink } from "@/components/ui/Button";
import { LeafMark } from "@/components/decor/LeafMark";
import { shippingFacts } from "@/content/site";
import { EASE_ORGANIC } from "@/lib/utils";

export function OrderConfirmation() {
  const order = useSearchParams().get("order");

  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_ORGANIC }}
      className="wash-botanical flex flex-col items-center rounded-[2.5rem] px-6 py-16 text-center md:px-16"
    >
      <LeafMark className="h-28 w-auto" />
      <p className="eyebrow mt-8">Order confirmed</p>
      <h1 className="text-h2 mt-4 text-forest-900">
        Thank you — your glow is <span className="italic-accent text-forest-600">on its way.</span>
      </h1>
      {order && (
        <p className="mt-6 rounded-full bg-cream-50 px-5 py-2 font-semibold tabular-nums text-forest-800 shadow-card">
          Order #{order}
        </p>
      )}
      <p className="mt-6 max-w-lg text-ink-500">
        {shippingFacts.dispatch}. You’ll receive your tracking details by email and SMS as soon as it ships.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/track-order" variant="secondary">
          Track your order
        </ButtonLink>
        <ButtonLink href="/" icon="arrow-right">
          Back to home
        </ButtonLink>
      </div>
    </m.div>
  );
}
