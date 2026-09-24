/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

/** ₹299.00 — Indian grouping and rupee symbol. */
export function formatPrice(amount: number) {
  return inr.format(amount);
}

/** Shared easing so Motion and CSS feel like one system. */
export const EASE_ORGANIC = [0.22, 1, 0.36, 1] as const;

export const isBrowser = typeof window !== "undefined";

/** Safe localStorage helpers — storage can be missing or throw (private mode). */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the app still works, it just won't persist */
  }
}
