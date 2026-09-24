/**
 * Coordination between the splash screen and the hero.
 *
 * The head script sets `html[data-splash]` when the splash will play. When the
 * splash begins to lift it dispatches SPLASH_DONE, so the hero starts its
 * entrance *underneath* the rising curtain — one continuous motion.
 */
export const SPLASH_DONE = "pranite:splash-done";
export const SPLASH_KEY = "pranite:splash-seen";

export function isSplashActive() {
  return typeof document !== "undefined" && document.documentElement.dataset.splash === "1";
}

/** Run `cb` once the splash has handed off (immediately if there is no splash). */
export function whenSplashDone(cb: () => void): () => void {
  if (!isSplashActive()) {
    cb();
    return () => {};
  }
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    cb();
  };
  window.addEventListener(SPLASH_DONE, run, { once: true });
  // Safety net matching the CSS fail-safe in globals.css.
  const t = window.setTimeout(run, 5200);
  return () => {
    window.removeEventListener(SPLASH_DONE, run);
    window.clearTimeout(t);
  };
}
