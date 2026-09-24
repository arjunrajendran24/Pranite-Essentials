"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/icons/Icons";
import { SingleLeaf } from "@/components/decor/Botanicals";
import { checkoutMode, INDIAN_STATES, shopifyCheckoutUrl, type CheckoutDetails } from "@/lib/checkout";
import { newOrderNumber, saveOrder } from "@/lib/orders";
import { cn, formatPrice } from "@/lib/utils";
import { shippingFacts } from "@/content/site";
import { useCart } from "./CartProvider";

type Errors = Partial<Record<keyof CheckoutDetails, string>>;

function validate(d: CheckoutDetails): Errors {
  const e: Errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Enter a valid email address.";
  if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(d.phone.replace(/\s/g, ""))) e.phone = "Enter a 10-digit Indian mobile number.";
  if (!d.firstName) e.firstName = "Enter your first name.";
  if (!d.lastName) e.lastName = "Enter your last name.";
  if (!d.address1) e.address1 = "Enter your street address.";
  if (!d.city) e.city = "Enter your city.";
  if (!d.state) e.state = "Choose your state.";
  if (!/^[1-9]\d{5}$/.test(d.zip)) e.zip = "Enter a valid 6-digit PIN code.";
  return e;
}

export function CheckoutForm() {
  const { items, subtotal, count, clear, hydrated } = useCart();
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-[2rem] bg-sand-200/40" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[2.5rem] bg-sage-50 px-6 py-20 text-center">
        <SingleLeaf className="w-16" />
        <h2 className="text-h2 mt-6 text-forest-900">Nothing to check out yet</h2>
        <p className="mt-3 text-ink-500">Add something lovely to your cart first.</p>
        <ButtonLink href="/catalog" icon="arrow-right" className="mt-8">
          Browse the catalog
        </ButtonLink>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const details: CheckoutDetails = {
      email: get("email"),
      phone: get("phone"),
      firstName: get("firstName"),
      lastName: get("lastName"),
      address1: get("address1"),
      address2: get("address2"),
      city: get("city"),
      state: get("state"),
      zip: get("zip"),
    };
    const errs = validate(details);
    setErrors(errs);
    const firstInvalid = Object.keys(errs)[0];
    if (firstInvalid) {
      document.getElementById(`co-${firstInvalid}`)?.focus();
      return;
    }

    setSubmitting(true);
    if (checkoutMode === "shopify") {
      window.location.href = shopifyCheckoutUrl(items, details);
      return;
    }
    // Demo mode: keep the order in this browser and show the confirmation.
    const number = newOrderNumber();
    saveOrder({
      number,
      email: details.email,
      name: `${details.firstName} ${details.lastName}`,
      city: details.city,
      items,
      total: subtotal,
      createdAt: new Date().toISOString(),
    });
    clear();
    router.push(`/checkout/success?order=${number}`);
  };

  const field = (name: keyof CheckoutDetails, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, span = false) => (
    <div className={cn(span && "sm:col-span-2")}>
      <label htmlFor={`co-${name}`} className="field-label">
        {label}
      </label>
      <input
        id={`co-${name}`}
        name={name}
        className="field"
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `co-${name}-err` : undefined}
        {...props}
      />
      {errors[name] && (
        <p id={`co-${name}-err`} className="mt-1.5 text-sm text-[#b4452c]">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] lg:gap-14">
      <div className="space-y-10">
        <fieldset className="rounded-[2rem] bg-cream-50 p-7 shadow-card md:p-9">
          <legend className="float-left mb-6 w-full font-serif text-2xl text-forest-900">Contact</legend>
          <div className="clear-both grid gap-5 sm:grid-cols-2">
            {field("email", "Email", { type: "email", autoComplete: "email", required: true })}
            {field("phone", "Mobile number", { type: "tel", autoComplete: "tel", inputMode: "tel", required: true, placeholder: "10-digit mobile" })}
          </div>
        </fieldset>

        <fieldset className="rounded-[2rem] bg-cream-50 p-7 shadow-card md:p-9">
          <legend className="float-left mb-6 w-full font-serif text-2xl text-forest-900">Shipping address</legend>
          <div className="clear-both grid gap-5 sm:grid-cols-2">
            {field("firstName", "First name", { autoComplete: "given-name", required: true })}
            {field("lastName", "Last name", { autoComplete: "family-name", required: true })}
            {field("address1", "Address", { autoComplete: "address-line1", required: true, placeholder: "House / flat no., building, street" }, true)}
            {field("address2", "Apartment, landmark (optional)", { autoComplete: "address-line2" }, true)}
            {field("city", "City", { autoComplete: "address-level2", required: true })}
            <div>
              <label htmlFor="co-state" className="field-label">
                State
              </label>
              <select
                id="co-state"
                name="state"
                className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%231f4a2c%22 stroke-width=%221.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10"
                defaultValue="Maharashtra"
                autoComplete="address-level1"
                aria-invalid={errors.state ? true : undefined}
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            {field("zip", "PIN code", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 6, required: true })}
            <div className="flex items-end">
              <p className="rounded-2xl bg-sage-100 px-4 py-3 text-sm text-forest-800">Country: India</p>
            </div>
          </div>
        </fieldset>

        <div className="rounded-[2rem] border border-forest-700/10 p-7 md:p-9">
          <h2 className="font-serif text-2xl text-forest-900">Payment</h2>
          <p className="mt-3 flex items-start gap-3 text-ink-600">
            <Icon name="lock" className="mt-0.5 size-5 text-forest-600" />
            {shippingFacts.prepaid}
          </p>
          {checkoutMode === "shopify" ? (
            <p className="mt-2 text-sm text-ink-500">You’ll complete payment on our secure Shopify checkout.</p>
          ) : (
            <p className="mt-3 rounded-xl bg-citrus-100 px-4 py-3 text-sm text-citrus-700">
              Demo checkout — no payment is taken. Set <code>NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN</code> to accept real
              payments.
            </p>
          )}
        </div>
      </div>

      <aside aria-labelledby="co-summary" className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[2rem] bg-cream-50 p-7 shadow-card md:p-9">
          <h2 id="co-summary" className="text-h3 text-forest-900">
            Order summary
          </h2>
          <ul className="mt-6 space-y-4">
            {items.map((i) => (
              <li key={i.handle} className="flex items-center gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-sand-200">
                  <Image src={i.image} alt="" fill sizes="64px" className="object-cover" />
                  <span className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-forest-800 px-1 text-[0.65rem] font-bold leading-5 text-cream-50">
                    {i.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-lg text-forest-900">{i.name}</p>
                  <p className="text-sm text-ink-500">{i.subtitle}</p>
                </div>
                <p className="tabular-nums text-ink-700">{formatPrice(i.price * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 border-t border-forest-700/10 pt-5 text-ink-600">
            <div className="flex justify-between">
              <dt>
                Subtotal · {count} item{count === 1 ? "" : "s"}
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
          <Button type="submit" size="lg" icon="arrow-right" className="mt-7 w-full" disabled={submitting}>
            {checkoutMode === "shopify" ? "Continue to secure payment" : "Place order"}
          </Button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-500">
            <Icon name="truck" className="size-4" /> {shippingFacts.dispatch}
          </p>
        </div>
      </aside>
    </form>
  );
}
