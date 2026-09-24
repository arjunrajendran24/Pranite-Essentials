import { BotanicalIcon } from "@/components/icons/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { InViewClass } from "@/components/motion/InViewClass";
import { praniteStandard } from "@/content/site";
import { cn } from "@/lib/utils";

/** "The Pranite standard — Beauty, grounded in belief": four values, staggered in. */
export function PraniteStandard({ className }: { className?: string }) {
  return (
    <section aria-labelledby="standard-title" className={cn("py-24 md:py-32", className)}>
      <div className="container-page">
        <SectionHeading
          id="standard-title"
          align="center"
          eyebrow="The Pranite standard"
          title={
            <>
              Beauty, grounded in <span className="italic-accent text-forest-600">belief</span>
            </>
          }
          lead="Thoughtful skincare shaped by nature, guided by science, and made for real rituals."
        />
        <InViewClass amount={0.25}>
          <RevealGroup as="ul" className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5" stagger={0.1}>
            {praniteStandard.map((v, i) => (
              <RevealItem
                as="li"
                key={v.title}
                className={cn(
                  "group relative overflow-hidden rounded-[2rem] border border-forest-700/10 bg-cream-50 p-8 transition-[translate,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-forest-700/20 hover:shadow-card",
                  i % 2 === 1 && "lg:mt-10",
                )}
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-10 -top-10 size-32 rounded-full bg-sage-100 transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-125"
                />
                <BotanicalIcon
                  name={v.icon}
                  draw
                  className="relative size-12 text-forest-700 transition-transform duration-700 ease-[var(--ease-organic)] group-hover:-rotate-6"
                />
                <h3 className="text-h3 relative mt-8 text-forest-900">{v.title}</h3>
                <p className="relative mt-2 leading-relaxed text-ink-500">{v.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </InViewClass>
      </div>
    </section>
  );
}
