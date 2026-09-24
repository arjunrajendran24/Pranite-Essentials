"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SingleLeaf } from "@/components/decor/Botanicals";
import { gsap, isLiteDevice, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { BrandFilm } from "./BrandFilm";

const QUOTE =
  "Introducing Green Pranite by Pranite Essentials. We have combined our dedication to pure, homegrown ingredients with advanced skincare science to create a targeted, highly effective collection.";

/**
 * "What are our exclusives?" — the brand philosophy.
 * The quote "reads itself" as you scroll: words brighten from a soft sage to
 * full ink, scrubbed by GSAP ScrollTrigger. Motion handles the film reveal.
 */
export function Philosophy() {
  const root = useRef<HTMLElement>(null);
  const quote = useRef<HTMLQuoteElement>(null);

  useGSAP(
    () => {
      if (isLiteDevice()) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const split = SplitText.create(quote.current, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: quote.current, start: "top 82%", end: "bottom 52%", scrub: 0.5 },
          },
        );
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="philosophy" aria-labelledby="philosophy-title" className="relative scroll-mt-24 overflow-x-clip py-24 md:py-36">
      <div className="container-page grid gap-14 md:grid-cols-12 md:items-center md:gap-10">
        <Reveal className="relative md:col-span-5" y={40}>
          <BrandFilm className="aspect-[4/5] rounded-[2.5rem] shadow-soft md:rounded-[3rem]" />
          <SingleLeaf className="absolute -right-5 -top-6 w-16 rotate-[35deg] md:-right-8 md:w-20" />
        </Reveal>

        <div className="md:col-span-7 md:pl-10 lg:pl-16">
          <Reveal y={12}>
            <p className="eyebrow flex items-center gap-3">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-60" />
              What are our exclusives?
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="philosophy-title" className="italic-accent mt-5 font-serif text-2xl text-forest-600 md:text-3xl">
              “Our Philosophy”
            </h2>
          </Reveal>
          <blockquote
            ref={quote}
            className="mt-6 font-serif text-[clamp(1.6rem,1.05rem+2.1vw,2.75rem)] leading-[1.28] text-forest-900"
          >
            “{QUOTE}”
          </blockquote>
          <Reveal delay={0.1} className="mt-10">
            <ButtonLink href="/catalog" variant="secondary" icon="arrow-right">
              Shop now
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
