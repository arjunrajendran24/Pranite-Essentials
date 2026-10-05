import Link from "next/link";
import { BotanicalIcon, Icon, type BotanicalName, type IconName } from "@/components/icons/Icons";
import type { ProductPromise } from "@/content/products";
import { formatPrice } from "@/lib/utils";

export interface BundleDeal {
  handle: string;
  title: string;
  saveLabel: string;
  price: number;
  href: string;
}

/** "Buy more, save more" — links to multi-pack products with live Shopify prices. */
export function ProductBundles({ deals }: { deals: BundleDeal[] }) {
  if (!deals.length) return null;

  return (
    <div className="rounded-[1.25rem] border border-forest-700/15 bg-cream-50 p-4">
      <p className="text-sm font-bold text-forest-800">Buy more, save more</p>
      <ul className="mt-3 space-y-2">
        {deals.map((deal) => (
          <li key={deal.handle}>
            <Link
              href={deal.href}
              className="flex items-center justify-between gap-3 rounded-xl border border-forest-700/15 bg-cream-100 px-3.5 py-3 text-sm font-semibold text-forest-800 transition-colors hover:border-forest-700/40 hover:bg-cream-50"
            >
              <span>
                {deal.title}: {formatPrice(deal.price)}{" "}
                <span className="font-medium text-citrus-700">({deal.saveLabel})</span>
              </span>
              <span className="shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-forest-600">
                View →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Compact 2×2 trust grid from the old Shopify description chrome. */
export function ProductPromises({ items }: { items: ProductPromise[] }) {
  if (!items.length) return null;

  return (
    <ul className="grid grid-cols-2 gap-2.5" aria-label="Our promises">
      {items.map((item) => (
        <li
          key={item.title}
          className="flex items-start gap-3 rounded-2xl border border-forest-700/10 bg-cream-50 px-3.5 py-3.5"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-700/8 text-forest-700">
            {item.iconKind === "ui" ? (
              <Icon name={item.icon as IconName} className="size-5" />
            ) : (
              <BotanicalIcon name={item.icon as BotanicalName} className="size-6" strokeWidth={1.7} />
            )}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold leading-snug text-forest-900">{item.title}</span>
            <span className="mt-0.5 block text-xs leading-snug text-ink-500">{item.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
