import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { faqGroups } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about Pranite Essentials and Green Pranite — ingredients, safety, cruelty-free testing, shipping, order tracking, pricing and partnerships.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    ),
  };

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Frequently asked <span className="italic-accent text-forest-600">questions</span>
          </>
        }
        lead="Everything you might wonder about our brands, ingredients, orders and more."
        crumbs={[{ href: "/", label: "Home" }, { label: "FAQ" }]}
      />

      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-20">
        <nav aria-label="FAQ topics" className="hidden lg:block">
          <ul className="sticky top-28 space-y-1 border-l border-forest-700/10">
            {faqGroups.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="-ml-px block border-l-2 border-transparent py-2 pl-5 text-sm text-ink-500 transition-colors hover:border-forest-600 hover:text-forest-800"
                >
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-16">
          {faqGroups.map((g, gi) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-28">
              <Reveal>
                <p className="font-serif text-sm text-ink-400">0{gi + 1}</p>
                <h2 id={`${g.id}-title`} className="text-h3 mt-1 text-forest-900">
                  {g.title}
                </h2>
              </Reveal>
              <Reveal delay={0.06}>
                <Accordion className="mt-4" items={g.items.map((i) => ({ title: i.q, content: <p>{i.a}</p> }))} />
              </Reveal>
            </section>
          ))}

          <Reveal>
            <div className="flex flex-col items-start gap-6 rounded-[2rem] bg-sage-100 p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div>
                <h2 className="text-h3 text-forest-900">Still have a question?</h2>
                <p className="mt-2 text-ink-500">Our team is happy to help with orders, products or partnerships.</p>
              </div>
              <ButtonLink href="/contact" icon="arrow-right">
                Contact us
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
