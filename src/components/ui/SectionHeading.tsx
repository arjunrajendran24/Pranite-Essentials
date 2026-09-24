import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

/** Eyebrow + serif heading + optional lead, with a soft staggered reveal. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "dark",
  as: H = "h2",
  className,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  className?: string;
  id?: string;
}) {
  const center = align === "center";
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal y={12}>
          <p className={cn("eyebrow mb-5 flex items-center gap-3", center && "justify-center", tone === "light" && "text-leaf-300")}>
            <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-60" />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <H id={id} className={cn(H === "h1" ? "text-display" : "text-h2", tone === "light" ? "text-cream-50" : "text-forest-900")}>
          {title}
        </H>
      </Reveal>
      {lead && (
        <Reveal delay={0.16}>
          <div className={cn("text-lead mt-6", tone === "light" ? "text-sage-200" : "text-ink-500", center && "mx-auto")}>
            {lead}
          </div>
        </Reveal>
      )}
    </div>
  );
}
