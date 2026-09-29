import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/icons/Icons";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Homepage "Track your order" block. A plain GET form to /track-order — works
 * before hydration and without JavaScript; the tracking page does the lookup.
 */
export function TrackOrderBand() {
  return (
    <section aria-labelledby="track-title" className="container-page">
      <Reveal className="bg-leaf-pattern grid items-center gap-10 overflow-hidden rounded-[2.5rem] bg-sage-100 p-8 md:grid-cols-2 md:p-14 lg:p-16">
        <div>
          <p className="eyebrow flex items-center gap-3">
            <Icon name="package" className="size-4" /> Orders
          </p>
          <h2 id="track-title" className="text-h2 mt-4 text-forest-900">
            Track your <span className="italic-accent text-forest-600">order</span>
          </h2>
          <p className="mt-4 max-w-md text-ink-500">Enter your order number and email to track your shipment.</p>
          <p className="mt-6 text-sm text-ink-600">
            Need help?{" "}
            <Link href="/contact" className="link-underline font-semibold text-forest-700">
              Contact us
            </Link>
          </p>
        </div>
        <form action="/track-order" method="get" className="grid gap-4 rounded-[2rem] bg-cream-50 p-6 shadow-card md:p-8">
          <div>
            <label htmlFor="band-order" className="field-label">
              Order number
            </label>
            <input id="band-order" name="order" required className="field" placeholder="e.g. #1001" autoComplete="off" />
          </div>
          <div>
            <label htmlFor="band-email" className="field-label">
              Email address
            </label>
            <input id="band-email" name="email" type="email" required className="field" placeholder="you@example.com" autoComplete="email" />
          </div>
          <button type="submit" className={buttonClasses({ size: "lg", className: "mt-2 w-full" })}>
            Track order
            <Icon name="arrow-right" className="size-[1.1em] transition-transform duration-500 group-hover/btn:translate-x-1" />
          </button>
        </form>
      </Reveal>
    </section>
  );
}
