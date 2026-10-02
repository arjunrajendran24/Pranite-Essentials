"use client";

import { useEffect, useRef, useState } from "react";
import { LeafMark } from "@/components/decor/LeafMark";
import { site } from "@/content/site";
import { SPLASH_DONE, isSplashActive } from "@/lib/splash";

/**
 * Intro splash — a sprout grows, the wordmark rises, the tagline settles, then
 * the cream curtain lifts on a soft curve to reveal the hero underneath.
 *
 * The markup is server-rendered but hidden (display:none) unless the head
 * script set html[data-splash]. GSAP core (~25 kB gz) is imported *only* when
 * the splash is really going to play; everyone else never downloads it here.
 */
export function SplashScreen() {
  const root = useRef<HTMLDivElement>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!isSplashActive()) {
      setFinished(true);
      return;
    }
    let cancelled = false;
    let cleanup = () => {};

    import("gsap").then(({ gsap }) => {
      const el = root.current;
      if (cancelled || !el) return;

      const q = gsap.utils.selector(el);
      const html = document.documentElement;
      let handedOff = false;

      const handOff = () => {
        if (handedOff) return;
        handedOff = true;
        window.dispatchEvent(new Event(SPLASH_DONE));
      };
      const finish = () => {
        handOff();
        html.removeAttribute("data-splash");
        setFinished(true);
      };

      // Take over from the CSS fail-safe timer.
      gsap.set(el, { animation: "none" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
      tl.to(q('[data-part="halo"]'), { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0)
        .to(q('[data-part="ground"]'), { strokeDashoffset: 0, duration: 0.6 }, 0.1)
        .to(q('[data-part="trunk"]'), { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 0.15)
        .to(q('[data-part="branch"]'), { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0.45)
        .fromTo(
          q('[data-part^="leaf"]'),
          {
            scale: 0,
            opacity: 0,
            rotate: -18,
            // Grow each leaf from where it meets its branch.
            transformOrigin: (_: number, t: Element) =>
              t.getAttribute("data-part") === "leaf-r" ? "0% 100%" : "100% 100%",
          },
          { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: "back.out(1.4)", stagger: 0.14 },
          0.7,
        )
        .fromTo(q('[data-part="drop"]'), { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "bounce.out" }, 1.15)
        .fromTo(q('[data-splash="logo"]'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 1.05)
        .fromTo(
          q('[data-splash="tagline"]'),
          { opacity: 0, letterSpacing: "0.5em" },
          { opacity: 1, letterSpacing: "0.3em", duration: 1.1, ease: "power2.out" },
          1.35,
        )
        .addLabel("exit", "+=0.45")
        .to(q("[data-splash='content']"), { y: -28, opacity: 0, duration: 0.6, ease: "power2.in" }, "exit")
        .to(q("[data-splash='panel']"), { yPercent: -100, duration: 1.15, ease: "expo.inOut" }, "exit+=0.2")
        .add(handOff, "exit+=0.55");

      // Any click / key skips straight to the exit.
      const skip = () => {
        if (tl.time() < tl.labels.exit) tl.seek("exit");
      };
      window.addEventListener("pointerdown", skip, { once: true });
      window.addEventListener("keydown", skip, { once: true });

      cleanup = () => {
        window.removeEventListener("pointerdown", skip);
        window.removeEventListener("keydown", skip);
        tl.kill();
        html.removeAttribute("data-splash");
        handOff();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  if (finished) return null;

  return (
    <div ref={root} className="splash pointer-events-auto fixed inset-0 z-[100] place-items-center" aria-hidden="true">
      {/* Curtain: taller than the viewport so its curved lower edge sweeps up past the hero. */}
      <div
        data-splash="panel"
        className="absolute inset-x-0 top-0 h-[calc(100%+16vh)] rounded-b-[50%_16vh] bg-cream-100 will-change-transform"
      >
        <div className="wash-botanical absolute inset-0 rounded-b-[50%_16vh] opacity-80" />
      </div>
      <div data-splash="content" className="relative flex flex-col items-center px-6 text-center">
        <LeafMark className="h-32 w-auto md:h-40" />
        <div data-splash="logo" className="mt-8">
          <p className="font-serif text-[clamp(2.4rem,9vw,3.75rem)] font-medium leading-none tracking-tight text-ink-900">
            <span className="text-forest-600">Green</span> Pranite
          </p>
          <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-ink-500">
            by {site.name}
          </p>
        </div>
        <p data-splash="tagline" className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-forest-600">
          {site.tagline}
        </p>
      </div>
    </div>
  );
}
