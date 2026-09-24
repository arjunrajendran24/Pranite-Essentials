/**
 * "Rethink Your Skincare ✦ 100% Transparent Ingredients ✦ Discover the Difference ✦"
 * Pure-CSS marquee: one composited translate animation, pauses on hover,
 * stops entirely for reduced motion. The duplicate track is hidden from
 * assistive tech so the phrases are read once.
 */
const phrases = ["Rethink Your Skincare", "100% Transparent Ingredients", "Discover the Difference"];

export function Marquee() {
  const track = [...phrases, ...phrases];
  return (
    <section aria-label="Our promise" className="overflow-hidden border-y border-forest-700/10 bg-sage-100 py-6 md:py-8">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <p
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center gap-8 pr-8 font-serif text-3xl text-forest-800 md:gap-12 md:pr-12 md:text-5xl"
          >
            {track.map((t, i) => (
              <span key={i} className="flex items-center gap-8 md:gap-12">
                <span className={i % 2 ? "italic-accent text-forest-600" : undefined}>{t}</span>
                <span aria-hidden="true" className="text-2xl text-citrus-500 md:text-3xl">
                  ✦
                </span>
              </span>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
}
