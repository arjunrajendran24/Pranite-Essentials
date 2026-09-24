"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/icons/Icons";
import { site } from "@/content/site";

/**
 * Contact form (Name, Email*, Phone, Comment — same fields as the original).
 *
 * With no backend attached, submitting opens the visitor's e-mail app with a
 * pre-filled message to connect@praniteessentials.com, so nothing is ever
 * silently lost. To collect messages server-side instead, post the same
 * fields to a Route Handler / form service in `onSubmit` (see README).
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; comment?: string }>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const comment = String(data.get("comment") ?? "").trim();

    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address.";
    if (!comment) next.comment = "Please tell us how we can help.";
    setErrors(next);
    if (Object.keys(next).length) {
      (e.currentTarget.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus();
      return;
    }

    const subject = `Website enquiry${name ? ` from ${name}` : ""}`;
    const body = [comment, "", "—", name && `Name: ${name}`, `Email: ${email}`, phone && `Phone: ${phone}`]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" aria-describedby="contact-note">
      <div>
        <label htmlFor="c-name" className="field-label">
          Name
        </label>
        <input id="c-name" name="name" className="field" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="c-email" className="field-label">
          Email <span aria-hidden="true" className="text-citrus-700">*</span>
        </label>
        <input
          id="c-email"
          name="email"
          type="email"
          required
          className="field"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "c-email-err" : undefined}
        />
        {errors.email && (
          <p id="c-email-err" className="mt-1.5 text-sm text-[#b4452c]">
            {errors.email}
          </p>
        )}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-phone" className="field-label">
          Phone
        </label>
        <input id="c-phone" name="phone" type="tel" className="field" autoComplete="tel" inputMode="tel" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-comment" className="field-label">
          Comment <span aria-hidden="true" className="text-citrus-700">*</span>
        </label>
        <textarea
          id="c-comment"
          name="comment"
          rows={5}
          required
          className="field resize-y"
          aria-invalid={errors.comment ? true : undefined}
          aria-describedby={errors.comment ? "c-comment-err" : undefined}
        />
        {errors.comment && (
          <p id="c-comment-err" className="mt-1.5 text-sm text-[#b4452c]">
            {errors.comment}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p id="contact-note" className="text-sm text-ink-500">
          Opens your email app with your message ready to send.
        </p>
        <Button type="submit" size="lg" icon="arrow-right">
          Submit
        </Button>
      </div>
      <AnimatePresence>
        {sent && (
          <m.p
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-2xl bg-sage-100 p-4 text-sm text-forest-800 sm:col-span-2"
          >
            <Icon name="check" className="mt-0.5 size-4" />
            <span>
              Your email app should now be open with your message. If nothing happened, write to us directly at{" "}
              <a className="font-semibold underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </span>
          </m.p>
        )}
      </AnimatePresence>
    </form>
  );
}
