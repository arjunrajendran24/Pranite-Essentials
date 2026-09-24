import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/motion/Reveal";
import { getPolicy, policies } from "@/content/policies";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return {};
  return {
    title: policy.title,
    description: `${policy.title} for Pranite Essentials.`,
    alternates: { canonical: `/policies/${policy.slug}` },
  };
}

export default async function PolicyPage({ params }: Params) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <>
      <PageHero
        eyebrow="Terms & policies"
        title={policy.title}
        lead={policy.updated ? `Last updated: ${policy.updated}` : undefined}
        crumbs={[{ href: "/", label: "Home" }, { label: policy.title }]}
      />
      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
        <nav aria-label="Policies" className="order-2 lg:order-1">
          <ul className="space-y-1 border-l border-forest-700/10 lg:sticky lg:top-28">
            {policies.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/policies/${p.slug}`}
                  aria-current={p.slug === policy.slug ? "page" : undefined}
                  className="-ml-px block border-l-2 border-transparent py-2 pl-5 text-sm text-ink-500 transition-colors hover:text-forest-800 aria-[current=page]:border-forest-600 aria-[current=page]:font-semibold aria-[current=page]:text-forest-800"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Reveal y={20} className="order-1 max-w-3xl lg:order-2">
          <article className="rounded-[2rem] bg-cream-50 p-7 md:p-12 [&_.prose-pranite>:first-child]:mt-0">
            <RichText blocks={policy.blocks} />
          </article>
        </Reveal>
      </div>
    </>
  );
}
