import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/pranite-logo.png";
import logoLight from "@/assets/images/pranite-logo-light.png";
import { cn } from "@/lib/utils";

/**
 * The PRANITE ESSENTIALS wordmark (tree-in-a-P + test-tube I), taken from the
 * live site and cut out onto a transparent background. `tone="light"` swaps to
 * the cream-ink version for dark sections.
 */
export function Logo({
  className,
  tone = "dark",
  priority = false,
  asLink = true,
}: {
  className?: string;
  tone?: "dark" | "light";
  priority?: boolean;
  asLink?: boolean;
}) {
  const img = (
    <Image
      src={tone === "light" ? logoLight : logo}
      alt="Pranite Essentials"
      priority={priority}
      sizes="(min-width: 768px) 180px, 140px"
      className="h-full w-auto"
    />
  );
  if (!asLink) return <span className={cn("block h-9", className)}>{img}</span>;
  return (
    <Link href="/" aria-label="Pranite Essentials — home" className={cn("block h-9 shrink-0", className)}>
      {img}
    </Link>
  );
}
