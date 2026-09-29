import Image from "next/image";
import { BotanicalIcon } from "@/components/icons/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { InViewClass } from "@/components/motion/InViewClass";
import { LeafSprig, OrangeSlice } from "@/components/decor/Botanicals";
import type { ProductContent } from "@/content/products";

/** Key benefits — six line icons that draw themselves in as the grid appears. */
export function BenefitsSection({ content }: { content: ProductContent }) {
  return (
    <section aria-labelledby="benefits-title" className="py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="benefits-title"
          align="center"
          eyebrow="Key benefits"
          title={
            <>
              Real care, <span className="italic-accent text-citrus-600">real glow.</span>
            </>
          }
        />
        <InViewClass amount={0.2}>
          <RevealGroup as="ul" className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5" stagger={0.08}>
            {content.benefits.map((b) => (
              <RevealItem
                as="li"
                key={b.title}
                className="group rounded-[1.75rem] border border-forest-700/10 bg-cream-50 p-6 text-center transition-[translate,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-card md:p-9"
              >
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-citrus-100 text-citrus-700 transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-110 md:size-20">
                  <BotanicalIcon name={b.icon} draw className="size-9 md:size-11" />
                </span>
                <h3 className="mt-5 font-sans text-sm font-bold uppercase tracking-[0.08em] text-forest-900 md:text-base">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500 md:text-[0.95rem]">{b.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </InViewClass>
      </div>
    </section>
  );
}

/** "Where Nature Meets Science: The Master Blend" — every key ingredient, explained. */
export function MasterBlend({ content }: { content: ProductContent }) {
  const [title, sub] = content.story.blendTitle.split(":");
  return (
    <section aria-labelledby="blend-title" className="relative mx-2 overflow-hidden rounded-[2.5rem] bg-sage-100 py-24 md:mx-5 md:rounded-[4rem] md:py-32">
      <LeafSprig className="pointer-events-none absolute -left-10 bottom-0 h-96 w-auto opacity-50" />
      <div className="container-page relative grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            id="blend-title"
            eyebrow={title.trim()}
            title={<span className="italic-accent">{sub?.trim() ?? "The Master Blend"}</span>}
            lead={content.story.blendIntro}
          />
        </div>
        <InViewClass amount={0.1}>
          <RevealGroup as="ol" className="grid gap-4 sm:grid-cols-2" stagger={0.09}>
            {content.ingredients.map((ing, i) => (
              <RevealItem
                as="li"
                key={ing.name}
                className={`rounded-[1.75rem] bg-cream-50 p-7 shadow-card ${i === 0 ? "sm:col-span-2" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <BotanicalIcon name={ing.icon} draw className="size-12 text-forest-700" />
                  <span className="font-serif text-sm text-ink-400">0{i + 1}</span>
                </div>
                <p className="eyebrow mt-6 text-citrus-700">{ing.role}</p>
                <h3 className="text-h3 mt-2 text-forest-900">{ing.name}</h3>
                <p className="mt-3 leading-relaxed text-ink-500">{ing.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </InViewClass>
      </div>
    </section>
  );
}

/** Before & after + "Why Tanora?" list. */
export function ResultsSection({ content }: { content: ProductContent }) {
  const ba = content.resultsImage;
  return (
    <section aria-labelledby="results-title" className="py-24 md:py-32">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal y={40} className="relative">
          <figure className="overflow-hidden rounded-[2rem] bg-cream-50 shadow-soft md:rounded-[2.5rem]">
            <Image
              src={ba.src}
              alt={ba.alt}
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, 92vw"
              className="h-auto w-full"
            />
          </figure>
          <OrangeSlice className="absolute -bottom-7 -left-5 w-20 md:-left-8 md:w-24" />
        </Reveal>
        <div>
          <SectionHeading
            id="results-title"
            eyebrow="Real results"
            title={
              <>
                Why <span className="italic-accent text-forest-600">Tanora?</span>
              </>
            }
            lead={content.story.intro.split(". ").slice(0, 2).join(". ") + "."}
          />
          <RevealGroup as="ul" className="mt-10 space-y-3" stagger={0.08}>
            {content.whyItWorks.map((line) => (
              <RevealItem as="li" key={line} className="flex items-center gap-4 rounded-2xl border border-forest-700/10 bg-cream-50 px-5 py-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-leaf-300/60 text-forest-800">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-ink-700">{line}</span>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.2}>
            <p className="mt-8 font-serif text-xl italic text-forest-700">Real Care. Real Glow.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** "Pure. Honest. Uncompromising." closing statement with the product claims. */
export function ClosingBand({ content }: { content: ProductContent }) {
  return (
    <section aria-labelledby="closing-title" className="relative mx-2 overflow-hidden rounded-[2.5rem] bg-forest-800 py-24 text-center text-cream-50 md:mx-5 md:rounded-[4rem] md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(149_196_88/0.16),transparent_65%)]"
      />
      <div className="container-page relative max-w-3xl">
        <SectionHeading
          id="closing-title"
          align="center"
          tone="light"
          eyebrow="Our promise"
          title={content.story.closingTitle}
          lead={content.story.closing}
        />
        <RevealGroup as="ul" className="mt-10 flex flex-wrap justify-center gap-3" stagger={0.08}>
          {content.story.claims.map((c) => (
            <RevealItem as="li" key={c} className="rounded-full border border-cream-50/20 px-5 py-2.5 text-sm font-semibold tracking-wide text-leaf-300">
              {c}
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal delay={0.2}>
          <p className="mt-10 font-serif text-lg italic text-sage-200">{content.story.signoff}</p>
        </Reveal>
      </div>
    </section>
  );
}
