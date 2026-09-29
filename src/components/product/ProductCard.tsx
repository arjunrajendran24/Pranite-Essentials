import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ButtonLink } from "@/components/ui/Button";
import { toCartItem, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

/**
 * Catalog card. On hover (pointer devices) the photo gently zooms and
 * cross-fades to a second image; quick-add is always visible on touch.
 * Pure CSS transitions — no JS per card.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [primary, secondary] = [product.images[0], product.images[product.images.length - 1]];
  const href = `/products/${product.handle}`;

  return (
    <article className="group relative">
      <Link href={href} className="block overflow-hidden rounded-[2rem] bg-cream-50 shadow-card" aria-label={`${product.name} — ${product.subtitle}`}>
        <div className="relative aspect-[4/5]">
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            priority={priority}
            placeholder={typeof primary.src === "string" ? "empty" : "blur"}
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 92vw"
            className="object-cover transition-[transform,opacity] duration-[1.2s] ease-[var(--ease-organic)] group-hover:scale-[1.04] [@media(hover:hover)]:group-hover:opacity-0"
          />
          {secondary && secondary !== primary && (
            <Image
              src={secondary.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 92vw"
              className="hidden scale-[1.04] object-cover opacity-0 transition-[transform,opacity] duration-[1.2s] ease-[var(--ease-organic)] group-hover:scale-100 group-hover:opacity-100 [@media(hover:hover)]:block"
            />
          )}
          {(!product.available || product.badge) && (
            <span className="absolute left-4 top-4 rounded-full bg-cream-50/95 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-forest-700">
              {product.available ? product.badge : "Sold out"}
            </span>
          )}
        </div>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div>
          <p className="eyebrow text-[0.65rem] text-ink-500">{product.brand}</p>
          <h3 className="mt-1.5 text-2xl leading-tight text-forest-900">
            <Link href={href} className="link-underline">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-ink-500">{product.subtitle}</p>
        </div>
        <p className="shrink-0 text-right font-serif text-xl tabular-nums text-forest-900">
          <span className="sr-only">{product.compareAtPrice ? "Sale price: " : "Price: "}</span>
          {product.priceVaries && <span className="text-sm">From </span>}
          {formatPrice(product.price.amount)}
          {product.compareAtPrice && (
            <s className="block text-sm font-sans tabular-nums text-ink-400">
              <span className="sr-only">Regular price: </span>
              {formatPrice(product.compareAtPrice.amount)}
            </s>
          )}
        </p>
      </div>
      {product.variants.length > 1 && product.available ? (
        <ButtonLink href={href} size="md" variant="secondary" className="mt-5 w-full">
          Choose options
        </ButtonLink>
      ) : (
        <AddToCartButton
          item={toCartItem(product)}
          size="md"
          variant="primary"
          label={product.available ? "Quick add" : "Sold out"}
          disabled={!product.available}
          className="mt-5 w-full"
        />
      )}
    </article>
  );
}
