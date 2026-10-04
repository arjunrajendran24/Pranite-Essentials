"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Icon } from "@/components/icons/Icons";
import { Logo } from "@/components/ui/Logo";
import { LeafSprig } from "@/components/decor/Botanicals";
import { buttonClasses } from "@/components/ui/Button";
import { isNavActive, mainNav, site } from "@/content/site";
import { EASE_ORGANIC } from "@/lib/utils";

/** Full-height sheet with staggered links. Esc / backdrop / link click close it. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const topic = useSearchParams().get("topic");
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const els = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [open, onClose]);

  const links = [...mainNav, { href: "/track-order", label: "Track Your Order" }];

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="sprig-host fixed inset-0 z-[90] flex flex-col overflow-hidden bg-cream-100 lg:hidden"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5, ease: EASE_ORGANIC }}
        >
          {/* Decoration sits behind everything (the content below is positioned, so it paints on top). */}
          <LeafSprig className="pointer-events-none absolute -bottom-12 -right-10 h-64 w-auto opacity-60 sm:-bottom-10 sm:-right-8 sm:h-80" />
          <div className="container-page relative flex h-[4.5rem] shrink-0 items-center justify-between">
            <Logo className="h-8" />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="grid size-11 place-items-center rounded-full text-forest-800 hover:bg-forest-700/8"
              aria-label="Close menu"
            >
              <Icon name="close" className="size-6" />
            </button>
          </div>

          {/* Scrolls on short screens (small phones, landscape, browser toolbar showing) so the
              account and contact links are always reachable; on tall screens they sit at the bottom. */}
          <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="flex min-h-full flex-col">
              <nav aria-label="Mobile" className="container-page flex-1 pt-8 [@media(max-height:700px)]:pt-3">
                <m.ul
                  className="space-y-1"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
                >
                  {links.map((item) => (
                    <m.li
                      key={item.href}
                      variants={{
                        hidden: { opacity: 0, y: 18 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_ORGANIC } },
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={isNavActive(pathname, item.href, topic) ? "page" : undefined}
                        className="group flex items-center justify-between gap-4 border-b border-forest-700/10 py-4 font-serif text-[clamp(1.75rem,8.4vw,2rem)] leading-tight text-forest-900 aria-[current=page]:text-forest-600 [@media(max-height:700px)]:py-2.5"
                      >
                        {item.label}
                        <Icon
                          name="arrow-right"
                          className="size-5 shrink-0 text-forest-600 opacity-50 transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </m.li>
                  ))}
                </m.ul>
              </nav>

              <div className="container-page flex flex-col items-stretch gap-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 text-sm text-ink-600 [@media(max-height:700px)]:pt-5">
                <Link
                  href="/contact?topic=bulk-order"
                  onClick={onClose}
                  className={buttonClasses({ size: "lg", className: "w-full" })}
                >
                  <span>Bulk Order</span>
                  <Icon
                    name="arrow-right"
                    className="size-[1.1em] transition-transform duration-500 ease-[var(--ease-organic)] group-hover/btn:translate-x-1"
                  />
                </Link>
                <a
                  href={site.accountUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-forest-700/20 bg-cream-100 px-5 py-2.5 font-semibold text-forest-800"
                >
                  <Icon name="user" className="size-4" /> Log in / My account
                </a>
                <a href={`mailto:${site.email}`} className="flex max-w-full items-center gap-2 py-1.5">
                  <Icon name="mail" className="size-4 shrink-0 text-forest-600" /> <span className="truncate">{site.email}</span>
                </a>
                <a href={site.phoneHref} className="flex items-center gap-2 py-1.5">
                  <Icon name="phone" className="size-4 shrink-0 text-forest-600" /> {site.phone}
                </a>
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
