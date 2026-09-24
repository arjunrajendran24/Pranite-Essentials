"use client";

import { useRef } from "react";
import Image from "next/image";
import lifestyle from "@/assets/images/tanora-lifestyle.jpg";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/icons/Icons";
import { CircleText, LeafSprig, OrangeSlice, SingleLeaf } from "@/components/decor/Botanicals";
import { gsap, isLiteDevice, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { whenSplashDone } from "@/lib/splash";

/**
 * Homepage hero.
 * GSAP timeline: eyebrow → headline lines rise out of masks → copy & CTAs →
 * the arch image settles from a gentle zoom while botanicals drift in.
 * Desktop adds a light scroll parallax (transform-only, scrubbed).
 * The product image is never hidden, so it paints immediately (fast LCP).
 */
export function Hero({ productHref }: { productHref: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ motion: MQ.motion, reduce: MQ.reduce, desktop: MQ.desktop }, (ctx) => {
        const { reduce, desktop } = ctx.conditions as Record<string, boolean>;

        if (reduce) {
          gsap.set(q('[data-gsap="hide"]'), { autoAlpha: 1 });
          return;
        }

        let split: SplitText | undefined;
        const stop = whenSplashDone(() => {
          split = SplitText.create(q('[data-hero="title"]')[0], { type: "lines", mask: "lines" });
          gsap
            .timeline({ onComplete: () => split?.revert() })
            .set(q('[data-gsap="hide"]'), { autoAlpha: 1 })
            .from(q('[data-hero="eyebrow"]'), { y: 16, autoAlpha: 0, duration: 0.8 })
            .from(split.lines, { yPercent: 115, duration: 1.25, stagger: 0.1, ease: "expo.out" }, "<0.05")
            .from(q('[data-hero="fade"]'), { y: 22, autoAlpha: 0, duration: 0.95, stagger: 0.1 }, "-=0.95")
            .from(q('[data-hero="img"]'), { scale: 1.14, duration: 2, ease: "expo.out" }, 0)
            .from(
              q("[data-float]"),
              { autoAlpha: 0, scale: 0.6, rotate: -16, duration: 1.3, stagger: 0.12, ease: "back.out(1.5)" },
              0.35,
            );
        });

        // Scroll parallax — desktop only, skipped on low-power devices.
        if (desktop && !isLiteDevice()) {
          const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 };
          q("[data-depth]").forEach((el) => {
            const depth = parseFloat((el as HTMLElement).dataset.depth ?? "0.4");
            gsap.to(el, { yPercent: -depth * 70, ease: "none", scrollTrigger: st });
          });
          gsap.to(q('[data-hero="img"]'), { yPercent: 7, ease: "none", scrollTrigger: st });
          gsap.to(q('[data-hero="copy"]'), { yPercent: -10, autoAlpha: 0.2, ease: "none", scrollTrigger: st });
        }

        return () => {
          stop();
          split?.revert();
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="hero-title" className="wash-botanical relative overflow-hidden">
      <div className="container-page grid items-center gap-14 pb-20 pt-10 md:min-h-[calc(100svh-7.5rem)] md:grid-cols-[1.05fr_0.95fr] md:py-16 lg:gap-20">
        <div data-hero="copy" className="relative z-10">
          <p data-gsap="hide" data-hero="eyebrow" className="eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-60" />
            Green Pranite · by Pranite Essentials
          </p>
          <h1 id="hero-title" data-gsap="hide" data-hero="title" className="text-display mt-6 text-forest-900">
            Why discover <span className="italic-accent text-forest-600">Green Pranite?</span>
          </h1>
          <p data-gsap="hide" data-hero="fade" className="text-lead mt-7 max-w-xl text-ink-500">
            Where nature meets science. Experience our advanced formulations and organic essentials.
          </p>
          <div data-gsap="hide" data-hero="fade" className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={productHref} size="lg" icon="arrow-right">
              Shop Tanora
            </ButtonLink>
            <ButtonLink href="#philosophy" variant="secondary" size="lg">
              Our philosophy
            </ButtonLink>
          </div>
          <ul data-gsap="hide" data-hero="fade" className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-ink-600">
            {["100% Natural", "Science-Backed", "Cruelty-Free"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Icon name="leaf" className="size-4 text-leaf-500" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[32rem] md:max-w-none">
          {/* Arch-framed product photograph */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-sand-200 shadow-soft">
            <div data-hero="img" className="absolute inset-0 will-change-transform">
              <Image
                src={lifestyle}
                alt="Green Pranite TANORA Bathing Bar on a wooden counter with fresh oranges, orange peel and goat milk."
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1280px) 560px, (min-width: 768px) 45vw, 92vw"
                className="object-cover object-[52%_60%]"
              />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-950/25 via-transparent to-transparent" />
          </div>

          {/* Floating botanicals: outer node = GSAP parallax, inner node = CSS idle float */}
          <div data-float data-depth="0.9" className="absolute -left-6 top-[14%] w-20 md:-left-12 md:w-28" aria-hidden="true">
            <div className="animate-float lite-no-anim">
              <OrangeSlice className="w-full drop-shadow-[0_12px_18px_rgb(192_98_26/0.25)]" />
            </div>
          </div>
          <div data-float data-depth="0.5" className="absolute -right-4 bottom-[22%] w-16 md:-right-10 md:w-20" aria-hidden="true">
            <div className="animate-float-slow lite-no-anim">
              <SingleLeaf className="w-full rotate-[20deg]" />
            </div>
          </div>
          <div data-float data-depth="1.2" className="absolute -bottom-12 -left-8 h-48 md:-left-16 md:h-64" aria-hidden="true">
            <LeafSprig className="h-full w-auto" />
          </div>
          <div
            data-float
            data-depth="0.3"
            aria-hidden="true"
            className="absolute -right-3 -top-3 grid size-28 place-items-center rounded-full bg-cream-50/95 text-forest-700 shadow-card md:-right-8 md:-top-6 md:size-36"
          >
            <CircleText
              text="Where nature meets science ✦ Real care ✦ "
              className="animate-spin-slow lite-no-anim absolute inset-1.5 size-[calc(100%-0.75rem)]"
            />
            <Icon name="leaf" className="size-8 text-leaf-500 md:size-10" />
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="container-page absolute inset-x-0 bottom-7 hidden items-center gap-4 md:flex">
        <span className="relative h-10 w-px overflow-hidden bg-forest-700/15">
          <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-forest-600" />
        </span>
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-ink-400">Scroll to explore</span>
      </div>
    </section>
  );
}
