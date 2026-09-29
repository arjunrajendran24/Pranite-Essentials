import { LeafSprig, SingleLeaf } from "@/components/decor/Botanicals";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

/** Calm, airy header used by every inner page. */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  className,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  crumbs?: { href?: string; label: string }[];
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("sprig-host wash-botanical relative overflow-hidden", className)}>
      <LeafSprig className="pointer-events-none absolute -right-6 top-6 hidden h-72 w-auto rotate-[18deg] opacity-70 md:block" />
      <SingleLeaf className="pointer-events-none absolute bottom-10 right-[22%] hidden w-10 rotate-[40deg] opacity-80 lg:block" />
      <div className="container-page relative pb-16 pt-8 md:pb-24 md:pt-12">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className="mt-10 max-w-3xl md:mt-14">
          {eyebrow && (
            <Reveal y={12}>
              <p className="eyebrow flex items-center gap-3">
                <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-60" />
                {eyebrow}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.06}>
            <h1 className="text-display mt-5 text-forest-900">{title}</h1>
          </Reveal>
          {lead && (
            <Reveal delay={0.12}>
              <p className="text-lead mt-6 max-w-2xl text-ink-500">{lead}</p>
            </Reveal>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
