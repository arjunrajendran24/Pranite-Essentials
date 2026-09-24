"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { BotanicalIcon, type BotanicalName } from "@/components/icons/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { gsap, isLiteDevice, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const steps: { icon: BotanicalName; phase: string; ingredient: string; text: string }[] = [
  {
    icon: "orange",
    phase: "Exfoliate",
    ingredient: "Orange Peel Powder",
    text: "A natural botanical exfoliant packed with Vitamin C gently buffs away dull, dead skin cells — refining texture without micro-tears.",
  },
  {
    icon: "flask",
    phase: "Brighten",
    ingredient: "Kojic Acid & Niacinamide",
    text: "A clinically proven powerhouse duo that targets uneven skin tone, gently fading stubborn pigmentation, dark spots and daily sun damage.",
  },
  {
    icon: "milk",
    phase: "Nourish",
    ingredient: "Pure Goat Milk",
    text: "A rich, soothing moisture surge that replenishes your skin's natural barrier — soft and supple, never tight or dry.",
  },
  {
    icon: "sparkle",
    phase: "Glow",
    ingredient: "Orange Essential Oil",
    text: "An uplifting botanical infusion that leaves skin exceptionally fresh and balanced. Real care. Real glow.",
  },
];

/**
 * "How does the science of true glow work?" — scroll storytelling.
 *
 * Desktop: the glow orb stays put with native `position: sticky` (cheaper and
 * smoother than JS pinning) while ScrollTrigger (a) marks the step crossing
 * the viewport centre as active and (b) scrubs the orb's progress ring and
 * warm citrus light. Mobile / low-power / reduced motion: a simple list of
 * cards with soft reveals and no scroll-linked work at all.
 */
export function ScienceOfGlow() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [story, setStory] = useState(false);

  useGSAP(
    () => {
      if (isLiteDevice()) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        setStory(true);
        const list = q("[data-steps]")[0];
        q("[data-step]").forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
        const st = { trigger: list, start: "top 55%", end: "bottom 55%", scrub: 0.6 };
        gsap.fromTo(q("[data-ring]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: st });
        gsap.fromTo(q("[data-warm]"), { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: st });
        gsap.fromTo(q("[data-orb]"), { scale: 0.92 }, { scale: 1.04, ease: "none", scrollTrigger: st });
        return () => {
          setStory(false);
          setActive(0);
        };
      });
    },
    { scope: root },
  );

  const current = steps[active];

  return (
    <section ref={root} aria-labelledby="science-title" className="relative py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          id="science-title"
          eyebrow="The science of true glow"
          title={
            <>
              How does the science of <span className="italic-accent text-forest-600">true glow</span> work?
            </>
          }
          lead="We believe radiance starts with uncompromising quality. By combining pure, organic botanicals with advanced active formulas, we create skincare that respects your natural balance while delivering visible, transformative results."
        />

        <div className="mt-16 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Sticky glow orb (desktop) */}
          <div className="hidden md:block">
            <div className="sticky top-[calc(50vh-15rem)]">
              <div data-orb className="relative mx-auto aspect-square w-full max-w-[30rem] will-change-transform">
                <svg viewBox="0 0 400 400" className="absolute inset-0 size-full" aria-hidden="true">
                  <defs>
                    <radialGradient id="orb-cool" cx="50%" cy="45%" r="55%">
                      <stop offset="0%" stopColor="#f3f5ee" />
                      <stop offset="70%" stopColor="#d6dfc9" />
                      <stop offset="100%" stopColor="#bccaab" />
                    </radialGradient>
                    <radialGradient id="orb-warm" cx="50%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="#fdfbf7" />
                      <stop offset="45%" stopColor="#fcebd6" />
                      <stop offset="100%" stopColor="#f2a650" />
                    </radialGradient>
                  </defs>
                  <circle cx="200" cy="200" r="150" fill="url(#orb-cool)" />
                  <circle data-warm cx="200" cy="200" r="150" fill="url(#orb-warm)" opacity="0" />
                  <circle cx="200" cy="200" r="186" fill="none" stroke="var(--color-forest-700)" strokeOpacity=".12" />
                  <circle
                    data-ring
                    cx="200"
                    cy="200"
                    r="186"
                    fill="none"
                    stroke="var(--color-forest-600)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1"
                    strokeDashoffset={story ? 1 : 0}
                    transform="rotate(-90 200 200)"
                  />
                  {steps.map((_, i) => {
                    const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
                    return (
                      <circle
                        key={i}
                        cx={200 + 186 * Math.cos(a)}
                        cy={200 + 186 * Math.sin(a)}
                        r={i <= active ? 7 : 5}
                        fill={i <= active ? "var(--color-citrus-500)" : "var(--color-cream-100)"}
                        stroke="var(--color-forest-600)"
                        strokeWidth="1.5"
                        style={{ transition: "r .5s, fill .5s" }}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    <m.div
                      key={active}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.45 }}
                      className="flex flex-col items-center"
                    >
                      <BotanicalIcon name={current.icon} className="size-14 text-forest-700" strokeWidth={1.3} />
                      <p className="eyebrow mt-4 text-citrus-700">Step 0{active + 1}</p>
                      <p className="mt-1 font-serif text-3xl text-forest-900">{current.phase}</p>
                      <p className="mt-1 text-sm text-ink-500">{current.ingredient}</p>
                    </m.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <ol data-steps className="space-y-5 md:space-y-[22vh] md:py-[18vh]">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.phase} y={30}>
                <div
                  data-step
                  className={cn(
                    "rounded-[2rem] border bg-cream-50 p-7 transition-[opacity,border-color,box-shadow,transform] duration-700 md:p-9",
                    story
                      ? i === active
                        ? "border-forest-700/15 opacity-100 shadow-card"
                        : "border-transparent opacity-40"
                      : "border-forest-700/10",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="grid size-14 place-items-center rounded-full bg-sage-100 text-forest-700 md:hidden">
                      <BotanicalIcon name={s.icon} className="size-8" />
                    </span>
                    <div>
                      <p className="eyebrow text-citrus-700">
                        0{i + 1} · {s.phase}
                      </p>
                      <h3 className="text-h3 mt-1 text-forest-900">{s.ingredient}</h3>
                    </div>
                  </div>
                  <p className="mt-4 leading-relaxed text-ink-500">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
