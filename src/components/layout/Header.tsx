"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import * as m from "motion/react-m";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/icons/Icons";
import { useCart } from "@/components/cart/CartProvider";
import { mainNav, site } from "@/content/site";
import { cn, EASE_ORGANIC } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

/**
 * Sticky header that tucks away while scrolling down and glides back on the
 * way up. Scroll position is read through Motion's shared scroll listener
 * (passive, rAF-batched) — React only re-renders when the *state* flips.
 */
export function Header() {
  const pathname = usePathname();
  const { count, open, hydrated } = useCart();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const nextHidden = y > 240 && y > prev + 4;
    const nextShown = y < prev - 4 || y < 240;
    if (nextHidden && !hidden) setHidden(true);
    else if (nextShown && hidden) setHidden(false);
    const nextScrolled = y > 12;
    if (nextScrolled !== scrolled) setScrolled(nextScrolled);
  });

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <div className="relative z-[61] bg-forest-800 text-cream-100">
        <p className="container-page flex h-9 items-center justify-center gap-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.2em]">
          <span aria-hidden="true" className="text-citrus-400">✦</span>
          <span className="truncate">{site.announcement}</span>
          <span aria-hidden="true" className="text-citrus-400">✦</span>
        </p>
      </div>

      <m.header
        className="sticky top-0 z-[60]"
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE_ORGANIC }}
      >
        <div
          className={cn(
            "lite-no-blur border-b transition-[background-color,border-color,box-shadow] duration-500",
            scrolled
              ? "border-forest-700/10 bg-cream-100/85 shadow-[0_10px_30px_-24px_rgb(31_74_44/0.5)] backdrop-blur-md"
              : "border-transparent bg-cream-100",
          )}
        >
          <div className="container-page flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
            <Logo priority className="h-8 md:h-10" />

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-9">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="link-underline py-1 text-[0.93rem] font-medium text-ink-700 transition-colors hover:text-forest-700 aria-[current=page]:text-forest-800"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-1.5">
              <Link
                href="/track-order"
                className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-forest-700/6 hover:text-forest-700 md:inline-flex"
              >
                <Icon name="package" className="size-[1.1rem]" />
                Track order
              </Link>
              {/* Shopify-hosted customer accounts — same as the live store's account icon */}
              <a
                href={site.accountUrl}
                className="grid size-11 place-items-center rounded-full text-forest-800 transition-colors hover:bg-forest-700/8"
                aria-label="Account — log in or view your orders"
                title="Account"
              >
                <Icon name="user" className="size-[1.35rem]" />
              </a>
              <button
                type="button"
                onClick={open}
                className="relative grid size-11 place-items-center rounded-full text-forest-800 transition-colors hover:bg-forest-700/8"
                aria-label={`Open cart${hydrated && count ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}
              >
                <Icon name="bag" className="size-[1.4rem]" />
                <AnimatePresence>
                  {hydrated && count > 0 && (
                    <m.span
                      key={count}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-citrus-500 px-1 text-[0.68rem] font-bold leading-5 text-forest-950"
                      aria-hidden="true"
                    >
                      {count}
                    </m.span>
                  )}
                </AnimatePresence>
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="grid size-11 place-items-center rounded-full text-forest-800 transition-colors hover:bg-forest-700/8 lg:hidden"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <Icon name="menu" className="size-6" />
              </button>
            </div>
          </div>
        </div>
      </m.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
