"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

/**
 * The 3D logo film from the original site.
 * - preload="none": zero bytes until it's actually needed.
 * - Autoplays (muted) only while on screen, and never for reduced-motion,
 *   Save-Data or low-power devices — those get the poster + a play button.
 * - Always has a visible play/pause control (WCAG 2.2.2).
 */
export function BrandFilm({ className }: { className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lite = document.documentElement.dataset.lite === "1";
    setAutoplay(!reduce && !lite);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v || !autoplay) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) v.play().catch(() => {});
        else if (!entry.isIntersecting) v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [autoplay]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <div className={cn("relative overflow-hidden bg-sand-200", className)}>
      <video
        ref={video}
        className="absolute inset-0 size-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        poster="/media/brand-film-poster.webp"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label="Brand film: the Pranite tree-and-leaf mark rendered in 3D on stone."
      >
        <source src="/media/brand-film.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-cream-50/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-forest-800 shadow-card transition-colors hover:bg-cream-50"
        aria-label={playing ? "Pause brand film" : "Play brand film"}
      >
        <Icon name={playing ? "pause" : "play"} className="size-3.5" />
        {playing ? "Pause" : "Play film"}
      </button>
    </div>
  );
}
