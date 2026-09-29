"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/icons/Icons";
import { site } from "@/content/site";

type Result = { kind: "missing"; number: string; email: string } | null;

/**
 * Order help. Orders are placed on Shopify's checkout, so live status lives in
 * the shopper's Shopify account (and in the shipping emails/SMS). This form
 * points there and offers a one-click, pre-filled e-mail to support.
 * To show status inline, connect the Customer Account API and replace `lookup`.
 */
export function TrackOrder() {
  const params = useSearchParams();
  const [order, setOrder] = useState(params.get("order") ?? "");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [result, setResult] = useState<Result>(null);

  const lookup = (number: string, mail: string) => {
    setResult({ kind: "missing", number, email: mail });
  };

  // Arriving from the homepage form: search straight away.
  useEffect(() => {
    const o = params.get("order");
    const e = params.get("email");
    if (o && e) lookup(o, e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(order, email);
        }}
        className="grid content-start gap-5 rounded-[2rem] bg-cream-50 p-7 shadow-card md:p-10"
      >
        <div>
          <label htmlFor="t-order" className="field-label">
            Order number
          </label>
          <input
            id="t-order"
            className="field"
            required
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="e.g. #1001"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="t-email" className="field-label">
            Email address
          </label>
          <input
            id="t-email"
            type="email"
            className="field"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <Button type="submit" size="lg" icon="arrow-right" className="mt-2 w-full">
          Track order
        </Button>
        <p className="text-sm text-ink-500">
          Need help?{" "}
          <Link href="/contact" className="link-underline font-semibold text-forest-700">
            Contact us
          </Link>
        </p>
      </form>

      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {result === null && (
            <m.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <InfoRow icon="package" title="Packed with care" text="Orders are processed and dispatched within 1–3 business days." />
              <InfoRow icon="mail" title="Tracking by email & SMS" text="Once shipped, you’ll receive your tracking number by email and SMS. Allow 24–48 hours for it to activate on the courier’s site." />
              <InfoRow icon="truck" title="At your door in 3–7 days" text="Standard delivery typically takes 3–7 business days depending on your location." />
            </m.div>
          )}

          {result?.kind === "missing" && (
            <m.div
              key="missing"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-[2rem] border border-forest-700/10 bg-cream-50 p-7 md:p-10"
            >
              <p className="eyebrow">Your order {result.number.startsWith("#") ? result.number : `#${result.number}`}</p>
              <h2 className="text-h3 mt-2 text-forest-900">See live status in your account</h2>
              <p className="mt-3 leading-relaxed text-ink-500">
                Sign in with <strong className="text-ink-700">{result.email}</strong> (a one-time code is emailed to
                you, no password needed) to see every order, its status and tracking.
              </p>
              <a
                href={site.accountUrl}
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-forest-700 px-7 font-semibold text-cream-50 transition-colors hover:bg-forest-800"
              >
                View my orders <Icon name="arrow-right" className="size-4" />
              </a>
              <p className="mt-8 leading-relaxed text-ink-500">
                Your tracking link is also sent by email and SMS as soon as your parcel ships. Can’t find it? Send us
                your order number and we’ll look into it right away.
              </p>
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(`Order status: ${result.number}`)}&body=${encodeURIComponent(
                  `Hello Pranite team,\n\nCould you please share the status of my order ${result.number}?\nEmail used at checkout: ${result.email}\n\nThank you!`,
                )}`}
                className="mt-6 inline-flex items-center gap-2 font-semibold text-forest-700"
              >
                <Icon name="mail" className="size-4" />
                <span className="link-underline">Email {site.email}</span>
              </a>
              <p className="mt-2 text-sm text-ink-500">
                or call{" "}
                <a href={site.phoneHref} className="font-semibold text-forest-700">
                  {site.phone}
                </a>
              </p>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InfoRow({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <div className="flex gap-5 rounded-[1.75rem] border border-forest-700/10 bg-cream-50 p-6">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sage-100 text-forest-700">
        <Icon name={icon} />
      </span>
      <div>
        <p className="font-semibold text-forest-900">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">{text}</p>
      </div>
    </div>
  );
}
