"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/icons/Icons";
import { findOrder, type LocalOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { site } from "@/content/site";

type Result = { kind: "found"; order: LocalOrder } | { kind: "missing"; number: string; email: string } | null;

/**
 * Order lookup. Orders placed through this site's built-in checkout are found
 * locally; everything else gets clear next steps (tracking arrives by e-mail
 * and SMS once shipped) and a one-click, pre-filled e-mail to support.
 * To connect a courier/Shopify tracking API, replace `lookup` below.
 */
export function TrackOrder() {
  const params = useSearchParams();
  const [order, setOrder] = useState(params.get("order") ?? "");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [result, setResult] = useState<Result>(null);

  const lookup = (number: string, mail: string) => {
    const found = findOrder(number, mail);
    setResult(found ? { kind: "found", order: found } : { kind: "missing", number, email: mail });
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
            placeholder="e.g. #PE123456"
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

          {result?.kind === "found" && (
            <m.div
              key="found"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-[2rem] border border-forest-700/10 bg-cream-50 p-7 md:p-10"
            >
              <p className="eyebrow">Order #{result.order.number}</p>
              <h2 className="text-h3 mt-2 text-forest-900">Thank you, {result.order.name.split(" ")[0]}.</h2>
              <p className="mt-1 text-sm text-ink-500">
                Placed {new Date(result.order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })} ·{" "}
                {formatPrice(result.order.total)}
              </p>
              <ol className="mt-8 space-y-6">
                {[
                  { t: "Order placed", d: "We’ve received your order.", done: true },
                  { t: "Processing", d: "Packed and dispatched within 1–3 business days.", done: false },
                  { t: "Shipped", d: "Tracking number sent by email & SMS.", done: false },
                  { t: "Delivered", d: `Usually 3–7 business days to ${result.order.city}.`, done: false },
                ].map((s, i) => (
                  <li key={s.t} className="flex gap-4">
                    <span
                      className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border text-xs font-bold ${
                        s.done ? "border-forest-700 bg-forest-700 text-cream-50" : "border-forest-700/25 text-ink-400"
                      }`}
                    >
                      {s.done ? <Icon name="check" className="size-3.5" strokeWidth={2.5} /> : i + 1}
                    </span>
                    <div>
                      <p className={s.done ? "font-semibold text-forest-900" : "font-semibold text-ink-600"}>{s.t}</p>
                      <p className="text-sm text-ink-500">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
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
              <p className="eyebrow">Let us check for you</p>
              <h2 className="text-h3 mt-2 text-forest-900">We couldn’t find live tracking here yet</h2>
              <p className="mt-3 leading-relaxed text-ink-500">
                Your tracking link is sent by email and SMS as soon as your parcel ships. If you can’t find it, send us
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
