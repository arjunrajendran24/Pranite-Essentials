import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/icons/Icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { LeafSprig } from "@/components/decor/Botanicals";
import { footerNav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden rounded-t-[2.5rem] bg-forest-900 text-sage-200 md:mt-32 md:rounded-t-[4rem]">
      <LeafSprig className="pointer-events-none absolute -right-10 -top-6 h-[26rem] w-auto rotate-12 opacity-[0.07] [&_path]:stroke-cream-50" />

      <div className="container-page relative pb-10 pt-16 md:pt-24">
        <Reveal className="flex flex-col gap-10 border-b border-cream-50/10 pb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <Logo tone="light" className="h-10 md:h-12" />
            <p className="mt-6 font-serif text-2xl leading-snug text-cream-50 md:text-3xl">
              Where nature meets <span className="italic-accent text-leaf-300">science.</span>
            </p>
          </div>
          <div className="space-y-2 text-sm md:text-right">
            <p className="eyebrow text-leaf-300">Customer care</p>
            <a href={`mailto:${site.email}`} className="link-underline block text-lg text-cream-50">
              {site.email}
            </a>
            <a href={site.phoneHref} className="link-underline block text-lg text-cream-50">
              {site.phone}
            </a>
          </div>
        </Reveal>

        <RevealGroup className="grid grid-cols-2 gap-x-6 gap-y-12 py-14 md:grid-cols-4" stagger={0.08}>
          <RevealItem>
            <h2 className="eyebrow mb-5 text-leaf-300">Shop</h2>
            <FooterLinks links={footerNav.shop} />
          </RevealItem>
          <RevealItem>
            <h2 className="eyebrow mb-5 text-leaf-300">Company</h2>
            <FooterLinks links={footerNav.company} />
          </RevealItem>
          <RevealItem>
            <h2 className="eyebrow mb-5 text-leaf-300">Terms &amp; policies</h2>
            <FooterLinks links={footerNav.policies} />
          </RevealItem>
          <RevealItem>
            <h2 className="eyebrow mb-5 text-leaf-300">Visit</h2>
            <address className="space-y-3 text-sm not-italic leading-relaxed">
              <p className="flex gap-2">
                <Icon name="map-pin" className="mt-0.5 size-4 text-leaf-300" />
                <span>
                  {site.name}
                  <br />
                  {site.location}
                </span>
              </p>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cream-50/15 px-4 py-2 text-cream-50 transition-colors hover:border-leaf-300 hover:text-leaf-300"
              >
                <Icon name="instagram" className="size-4" />
                {site.instagramHandle}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </address>
          </RevealItem>
        </RevealGroup>

        <div className="flex flex-col gap-3 border-t border-cream-50/10 pt-8 text-xs text-sage-300 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name.toUpperCase()}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <Icon name="leaf" className="size-3.5 text-leaf-400" /> 100% Natural · Science-Backed · Cruelty-Free
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ links }: { links: readonly { href: string; label: string }[] }) {
  return (
    <ul className="space-y-3 text-sm">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="link-underline text-sage-200 transition-colors hover:text-cream-50">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
