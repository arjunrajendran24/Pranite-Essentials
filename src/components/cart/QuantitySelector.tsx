"use client";

import { Icon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";
import { MAX_QTY } from "./CartProvider";

export function QuantitySelector({
  value,
  onChange,
  label = "Quantity",
  size = "md",
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const btn = cn(
    "grid place-items-center rounded-full text-forest-800 transition-colors hover:bg-forest-700/8 disabled:opacity-35",
    size === "sm" ? "size-8" : "size-11",
  );
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-full border border-forest-700/20 bg-cream-50",
        size === "sm" ? "h-9 px-0.5" : "h-12 px-0.5",
        className,
      )}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Icon name="minus" className="size-4" />
      </button>
      <output aria-live="polite" className={cn("text-center font-semibold tabular-nums", size === "sm" ? "w-6 text-sm" : "w-8")}>
        {value}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QTY}
        aria-label="Increase quantity"
      >
        <Icon name="plus" className="size-4" />
      </button>
    </div>
  );
}
