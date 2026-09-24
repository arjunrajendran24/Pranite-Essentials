import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Icon, type IconName } from "@/components/icons/Icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with Pranite Essentials — ${site.email} · ${site.phone} · ${site.location}.`,
  alternates: { canonical: "/contact" },
};

const channels: { icon: IconName; label: string; value: string; href?: string; note?: string }[] = [
  { icon: "mail", label: "Email", value: site.email, href: `mailto:${site.email}`, note: "Orders, products & partnerships" },
  { icon: "phone", label: "Customer care", value: site.phone, href: site.phoneHref },
  { icon: "map-pin", label: "Location", value: site.location },
  {
    icon: "instagram",
    label: "Instagram",
    value: site.instagramHandle,
    href: site.instagram,
    note: "Launches & offers first",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            We’d love to <span className="italic-accent text-forest-600">hear from you</span>
          </>
        }
        lead="Questions about your order, our formulations, or a retail or creator partnership? Reach out — our team is here to help."
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact Us" }]}
      />

      <section className="container-page grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <RevealGroup as="ul" className="grid content-start gap-4" stagger={0.08}>
          {channels.map((c) => {
            const inner = (
              <>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sage-100 text-forest-700 transition-transform duration-500 group-hover:scale-110">
                  <Icon name={c.icon} />
                </span>
                <span className="min-w-0">
                  <span className="eyebrow block text-[0.65rem] text-ink-500">{c.label}</span>
                  <span className="mt-1 block font-serif text-xl text-forest-900 [overflow-wrap:anywhere]">{c.value}</span>
                  {c.note && <span className="mt-0.5 block text-sm text-ink-500">{c.note}</span>}
                </span>
              </>
            );
            const cls =
              "group flex items-center gap-5 rounded-[1.75rem] border border-forest-700/10 bg-cream-50 p-5 transition-[translate,box-shadow] duration-500 md:p-6";
            return (
              <RevealItem as="li" key={c.label}>
                {c.href ? (
                  <a
                    href={c.href}
                    className={`${cls} hover:-translate-y-0.5 hover:shadow-card`}
                    {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal y={40}>
          <div className="rounded-[2rem] bg-cream-50 p-7 shadow-card md:rounded-[2.5rem] md:p-12">
            <h2 className="text-h3 text-forest-900">Send us a message</h2>
            <p className="mb-8 mt-2 text-ink-500">We usually reply within one business day.</p>
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
