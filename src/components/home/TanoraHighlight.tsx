"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import bathingBar from "@/assets/images/tanora-bathing-bar.jpg";
import { ButtonLink } from "@/components/ui/Button";
import { BotanicalIcon, Icon, type BotanicalName } from "@/components/icons/Icons";
import { OrangeSlice } from "@/components/decor/Botanicals";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { CartProductSnapshot } from "@/components/cart/CartProvider";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { gsap, isLiteDevice, MQ, useGSAP } from "@/lib/gsap";
import { formatPrice } from "@/lib/utils";

const ingredientIcon: Record<string, BotanicalName> = {
  "Orange Peel": "orange",
  Niacinamide: "molecule",
  "Kojic Acid": "flask",
  "Goat Milk": "milk",
};

/**
 * "Discover Tanora" — the product highlight, set in the packaging's forest
 * green. GSAP scrubs a giant outline wordmark sideways and gives the product
 * card a slow parallax; Motion staggers the ingredient chips.
 */
export function TanoraHighlight({
  href,
  price,
  summary,
  ingredients,
  cartItem,
  available = true,
}: {
  href: string;
  price: number;
  summary: string;
  ingredients: string[];
  cartItem: CartProductSnapshot;
  available?: boolean;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (isLiteDevice()) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.7 };
        gsap.fromTo(q("[data-word]"), { xPercent: 4 }, { xPercent: -28, ease: "none", scrollTrigger: st });
        gsap.fromTo(q("[data-card]"), { y: 50 }, { y: -50, ease: "none", scrollTrigger: st });
        gsap.fromTo(q("[data-slice]"), { rotate: -30, y: 40 }, { rotate: 40, y: -60, ease: "none", scrollTrigger: st });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="tanora-title"
      className="relative mx-2 overflow-hidden rounded-[2.5rem] bg-forest-800 py-24 text-cream-50 md:mx-5 md:rounded-[4rem] md:py-32"
    >
      <div
        data-word
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-8 select-none whitespace-nowrap font-serif text-[26vw] leading-none text-transparent [-webkit-text-stroke:1px_rgb(250_246_238/0.1)] md:top-4"
      >
        TANORA · TANORA
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/3 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(242_166_80/0.22),transparent_65%)]"
      />

      <div className="container-page relative grid items-center gap-14 md:grid-cols-2 lg:gap-24">
        <Reveal className="relative order-2 md:order-1" y={50}>
          {/* The whole card drifts on scroll (never the image inside it), so the artwork is never cropped. */}
          <div data-card className="relative aspect-square overflow-hidden rounded-[2rem] bg-cream-100 will-change-transform md:rounded-[2.5rem]">
            <Image
              src={bathingBar}
              alt="TANORA Bathing Bar packaging surrounded by botanical line art, with SLS-free and paraben-free marks."
              fill
              placeholder="blur"
              sizes="(min-width: 768px) 46vw, 92vw"
              className="object-contain"
            />
          </div>
          <div data-slice aria-hidden="true" className="absolute -left-6 -top-8 w-24 md:-left-10 md:w-32">
            <OrangeSlice className="w-full" />
          </div>
          <div className="absolute -right-3 -top-7 grid size-24 place-items-center rounded-full bg-citrus-400 text-center text-forest-900 shadow-glow md:size-28">
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">Only</span>
            <span className="-mt-3 font-serif text-2xl leading-none">₹{price}</span>
          </div>
        </Reveal>

        <div className="order-1 md:order-2">
          <Reveal y={12}>
            <p className="eyebrow flex items-center gap-3 text-leaf-300">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-60" />
              Discover Tanora
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="tanora-title" className="text-h2 mt-5 text-cream-50">
              Experience the <span className="italic-accent text-citrus-400">ultimate glow.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-lead mt-6 max-w-lg text-sage-200">{summary.replace(/^Experience the ultimate glow\.\s*/, "")}</p>
          </Reveal>

          <RevealGroup as="ul" className="mt-9 flex flex-wrap gap-2.5" stagger={0.07} delay={0.1}>
            {ingredients.map((name) => (
              <RevealItem
                as="li"
                key={name}
                className="flex items-center gap-2 rounded-full border border-cream-50/15 bg-cream-50/5 py-2 pl-2.5 pr-4 text-sm text-cream-50"
              >
                <BotanicalIcon name={ingredientIcon[name] ?? "leaf"} className="size-6 text-citrus-400" strokeWidth={2} />
                {name}
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.2} className="mt-11 flex flex-wrap items-center gap-4">
            <AddToCartButton
              item={cartItem}
              variant="citrus"
              label={available ? `Add to cart · ${formatPrice(price)}` : "Sold out"}
              disabled={!available}
            />
            <ButtonLink href={href} variant="ghost" className="text-cream-50! hover:text-leaf-300!" icon="arrow-right">
              Discover Tanora
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.26}>
            <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-sage-300">
              <span className="inline-flex items-center gap-2">
                <Icon name="truck" className="size-4" /> Free standard shipping · Zero sulfates &amp; parabens
              </span>
              <span aria-hidden="true" className="text-sage-300/50">
                ·
              </span>
              <Link href="/contact?topic=bulk-order" className="link-underline font-semibold text-leaf-300">
                Bulk order
              </Link>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
