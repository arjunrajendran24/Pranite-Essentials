"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Icon } from "@/components/icons/Icons";
import type { ProductImage } from "@/lib/catalog";
import { cn, EASE_ORGANIC } from "@/lib/utils";

/**
 * Product gallery: directional cross-fade between images (Motion), thumbnail
 * strip, arrow buttons, ←/→ keys when focused and swipe on touch screens.
 * Only the visible image is mounted, so just one full-size image loads at a time.
 */
export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const count = images.length;

  const go = (next: number) => {
    const wrapped = (next + count) % count;
    setState([wrapped, next > index ? 1 : -1]);
  };

  const current = images[index];

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name} images`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        onPointerDown={(e) => (pointer.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          const start = pointer.current;
          pointer.current = null;
          if (!start) return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
        }}
        className="group relative aspect-[5/4] touch-pan-y overflow-hidden rounded-[2rem] bg-cream-50 shadow-card md:rounded-[2.5rem]"
      >
        <AnimatePresence initial={false} custom={dir}>
          <m.div
            key={index}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 36, scale: 1.02 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d: number) => ({ opacity: 0, x: d * -36 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: EASE_ORGANIC }}
            className="absolute inset-0"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              priority={index === 0}
              placeholder={typeof current.src === "string" ? "empty" : "blur"}
              sizes="(min-width: 1024px) 55vw, 100vw"
              draggable={false}
              className={cn("select-none", current.fit === "cover" ? "object-cover" : "object-contain")}
            />
          </m.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
              <button
                type="button"
                onClick={() => go(index - 1)}
                className="pointer-events-auto grid size-11 place-items-center rounded-full bg-cream-50/90 text-forest-800 shadow-card transition-transform hover:scale-105"
                aria-label="Previous image"
              >
                <Icon name="chevron-left" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                className="pointer-events-auto grid size-11 place-items-center rounded-full bg-cream-50/90 text-forest-800 shadow-card transition-transform hover:scale-105"
                aria-label="Next image"
              >
                <Icon name="chevron-right" />
              </button>
            </div>
            <p className="absolute bottom-4 right-4 rounded-full bg-cream-50/90 px-3 py-1 text-xs font-semibold tabular-nums text-ink-700" aria-live="polite">
              {index + 1} / {count}
            </p>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="mt-4 flex gap-3 overflow-x-auto pb-1" aria-label="Choose image">
          {images.map((img, i) => (
            <li key={i} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`View image ${i + 1} of ${count}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative block size-[4.5rem] overflow-hidden rounded-2xl bg-cream-50 ring-offset-2 ring-offset-cream-100 transition-[box-shadow,opacity,transform] duration-300 md:size-20",
                  i === index ? "ring-2 ring-forest-600" : "opacity-70 hover:scale-[1.03] hover:opacity-100",
                )}
              >
                <Image src={img.src} alt="" fill sizes="80px" className={img.fit === "cover" ? "object-cover" : "object-contain"} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
