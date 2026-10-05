/**
 * Catalog data layer.
 *
 * Every page reads products through the async functions below, never from
 * Shopify directly. Commerce data (title, price, stock, variants, images,
 * description, SEO) comes from the Shopify Storefront API and is cached for
 * `PRODUCTS_REVALIDATE_SECONDS`. Editorial sections (benefits, master blend, …)
 * are merged in from `src/content/products.ts`, matched by Shopify tag.
 */
import type { StaticImageData } from "next/image";
import logo from "@/assets/images/pranite-logo.png";
import { FEATURED_PRODUCT_HANDLE, getProductContent, type ProductContent } from "@/content/products";
import { getShopifyProduct, getShopifyProducts, lineSubtitle, splitProductTitle } from "@/lib/shopify";
import type { ShopifyImage, ShopifyProduct } from "@/lib/shopify/types";
import type { CartProductSnapshot } from "@/components/cart/CartProvider";

export interface ProductImage {
  /** Static import (local, gets width/height + blur for free) or a remote URL. */
  src: StaticImageData | string;
  alt: string;
  width?: number;
  height?: number;
  /** "cover" for photographs, "contain" (default) for text-bearing graphics. */
  fit?: "cover" | "contain";
}

export interface Money {
  amount: number;
  currencyCode: string;
}

export interface ProductVariant {
  /** Shopify variant gid — what the cart API adds. */
  id: string;
  title: string;
  sku: string;
  available: boolean;
  price: Money;
  compareAtPrice?: Money;
}

export interface Product {
  id: string;
  handle: string;
  /** Full title as listed on Shopify. */
  title: string;
  /** Short display name used in headings and cart ("TANORA Bathing Bar"). */
  name: string;
  subtitle: string;
  brand: string;
  tags: string[];
  /** Small label from Shopify tags ("New", "Best value"), if any. */
  badge?: string;
  /** Price of the default variant. */
  price: Money;
  /** Original price, only when higher than `price` (shown struck through). */
  compareAtPrice?: Money;
  /** True when variants have different prices ("From ₹…"). */
  priceVaries: boolean;
  available: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  /** The variant preselected on product cards and pages: first in stock, else first. */
  defaultVariant: ProductVariant;
  /** Plain-text description and its first sentence or two (cards, homepage). */
  description: string;
  descriptionHtml: string;
  summary: string;
  seo: { title: string; description: string };
  /** Editorial page sections, when this product's line has them. */
  content?: ProductContent;
}

/* ---------------------------------------------------------------------------
   Shopify → Product
   --------------------------------------------------------------------------- */

const BADGE_TAGS: [RegExp, string][] = [
  [/^new$/i, "New"],
  [/^best ?value$/i, "Best value"],
  [/^best ?seller$/i, "Bestseller"],
];

const money = (m: { amount: string; currencyCode: string }): Money => ({
  amount: Number(m.amount),
  currencyCode: m.currencyCode,
});

function titleCase(s: string) {
  return s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

function summarize(text: string, min = 120) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  let out = "";
  for (const s of sentences) {
    out = out ? `${out} ${s}` : s;
    if (out.length >= min) break;
  }
  return out;
}

function truncate(text: string, max = 160) {
  return text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/**
 * Shopify descriptions sometimes start with theme-era HTML chrome (pack
 * upsells, trust-badge grids) pasted above the real copy. Drop that prefix so
 * summaries and the description accordion only show body text.
 */
function cleanDescriptionHtml(html: string): string {
  const trimmed = html.trim();
  const p = trimmed.search(/<p\b/i);
  if (p <= 0) return trimmed;
  const prefix = trimmed.slice(0, p);
  if (
    /Buy more,\s*save more/i.test(prefix) ||
    (/Never tested on animals/i.test(prefix) && /Quick delivery/i.test(prefix))
  ) {
    return trimmed.slice(p).trim();
  }
  return trimmed;
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|h[1-6]|tr|details|summary)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function toImage(img: ShopifyImage, alt: string, index: number): ProductImage {
  return {
    src: img.url,
    alt: img.altText?.trim() || alt,
    width: img.width ?? undefined,
    height: img.height ?? undefined,
    // Convention: the featured image is a photograph (fills the frame); the rest
    // are often text-bearing graphics, shown whole.
    fit: index === 0 ? "cover" : "contain",
  };
}

function reshapeProduct(p: ShopifyProduct): Product {
  const { name, subtitle } = splitProductTitle(p.title);
  const brand = p.vendor ? titleCase(p.vendor) : "Green Pranite";

  const variants: ProductVariant[] = p.variants.nodes.map((v) => {
    const price = money(v.price);
    const compare = v.compareAtPrice ? money(v.compareAtPrice) : undefined;
    return {
      id: v.id,
      title: v.title,
      sku: v.sku ?? "",
      available: v.availableForSale,
      price,
      compareAtPrice: compare && compare.amount > price.amount ? compare : undefined,
    };
  });
  const defaultVariant = variants.find((v) => v.available) ?? variants[0];

  const label = [name, subtitle].filter(Boolean).join(" — ");
  const images = p.images.nodes.map((img, i) => toImage(img, i === 0 ? label : `${label}, image ${i + 1}`, i));
  if (!images.length) images.push({ src: logo, alt: label, fit: "contain" });

  const descriptionHtml = cleanDescriptionHtml(p.descriptionHtml);
  const description = htmlToPlainText(descriptionHtml) || p.description.trim();
  const summary = summarize(description);

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    name,
    subtitle,
    brand,
    tags: p.tags,
    badge: BADGE_TAGS.find(([re]) => p.tags.some((t) => re.test(t)))?.[1],
    price: defaultVariant.price,
    compareAtPrice: defaultVariant.compareAtPrice,
    priceVaries: new Set(variants.map((v) => v.price.amount)).size > 1,
    available: p.availableForSale,
    images,
    variants,
    defaultVariant,
    description,
    descriptionHtml,
    summary,
    seo: {
      title: p.seo.title?.trim() || [name, subtitle].filter(Boolean).join(" — "),
      description: p.seo.description?.trim() || truncate(description),
    },
    content: getProductContent(p.tags),
  };
}

/** Shopify products always have at least one variant; skip any that somehow don't. */
const hasVariants = (p: ShopifyProduct) => p.variants.nodes.length > 0;

/* ---------------------------------------------------------------------------
   Data access
   --------------------------------------------------------------------------- */

export async function getProducts(): Promise<Product[]> {
  return (await getShopifyProducts()).filter(hasVariants).map(reshapeProduct);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const p = await getShopifyProduct(handle);
  return p && hasVariants(p) ? reshapeProduct(p) : undefined;
}

/** The product featured across the homepage, or undefined if the store has none. */
export async function getFeaturedProduct(): Promise<Product | undefined> {
  return (await getProduct(FEATURED_PRODUCT_HANDLE)) ?? (await getProducts())[0];
}

/** Resolve an image source to a plain URL (for JSON-LD, cart snapshots, OG tags). */
export function imageUrl(src: ProductImage["src"]): string {
  return typeof src === "string" ? src : src.src;
}

/**
 * Build the lightweight snapshot the cart shows instantly (before Shopify
 * confirms). Call this in server components and pass the result to client
 * buttons, so client bundles never need to import the catalog itself.
 */
export function toCartItem(product: Product, variant: ProductVariant = product.defaultVariant): CartProductSnapshot {
  const img = product.images[0];
  return {
    variantId: variant.id,
    handle: product.handle,
    name: product.name,
    subtitle: lineSubtitle(product.subtitle, variant.title),
    price: variant.price.amount,
    image: imageUrl(img.src),
    imageAlt: img.alt,
  };
}
