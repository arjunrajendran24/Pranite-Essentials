import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/icons/Icons";

type Variant = "primary" | "secondary" | "light" | "citrus" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-[0.01em] " +
  "transition-[transform,background-color,color,box-shadow,border-color] duration-300 ease-[var(--ease-organic)] " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-forest-700 text-cream-50 hover:bg-forest-800 hover:shadow-glow hover:-translate-y-0.5",
  secondary:
    "border border-forest-700/25 text-forest-800 bg-transparent hover:border-forest-700 hover:bg-forest-700/5 hover:-translate-y-0.5",
  light: "bg-cream-50 text-forest-800 hover:bg-white hover:-translate-y-0.5 hover:shadow-soft",
  citrus: "bg-citrus-400 text-forest-900 hover:bg-citrus-500 hover:-translate-y-0.5 hover:shadow-glow",
  ghost: "px-0! text-forest-800 hover:text-forest-600",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-7 text-[0.95rem]",
  lg: "h-14 px-9 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

/** Trailing icon that nudges forward on hover — the shared micro-interaction. */
function Trailing({ icon }: { icon?: IconName }) {
  if (!icon) return null;
  return (
    <Icon
      name={icon}
      className="size-[1.1em] transition-transform duration-500 ease-[var(--ease-organic)] group-hover/btn:translate-x-1"
    />
  );
}

type Common = { variant?: Variant; size?: Size; icon?: IconName; className?: string; children: React.ReactNode };

export function ButtonLink({
  href,
  variant,
  size,
  icon,
  className,
  children,
  ...rest
}: Common & Omit<React.ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, className })} {...rest}>
      <span>{children}</span>
      <Trailing icon={icon} />
    </Link>
  );
}

export function Button({
  variant,
  size,
  icon,
  className,
  children,
  type = "button",
  ...rest
}: Common & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      <span className="inline-flex items-center gap-2">{children}</span>
      <Trailing icon={icon} />
    </button>
  );
}
