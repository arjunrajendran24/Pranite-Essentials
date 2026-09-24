/**
 * Catalog data layer.
 *
 * Every page reads products through the async functions at the bottom of this
 * file, never from the array directly. To go headless later, re-implement
 * `getProducts` / `getProduct` against the Shopify Storefront API and map the
 * response onto the `Product` type — no page or component needs to change.
 */
import type { StaticImageData } from "next/image";

import lifestyle from "@/assets/images/tanora-lifestyle.jpg";
import keyBenefits from "@/assets/images/tanora-key-benefits.jpg";
import keyIngredients from "@/assets/images/tanora-key-ingredients.jpg";
import beforeAfter from "@/assets/images/tanora-before-after.jpg";
import bathingBar from "@/assets/images/tanora-bathing-bar.jpg";

export type BenefitIcon = "sun" | "spots" | "pores" | "tone" | "drop" | "feather";
export type IngredientIcon = "orange" | "molecule" | "flask" | "milk" | "dropper";
export type BadgeIcon = "sls" | "paraben" | "rabbit" | "shield" | "flask" | "hand";

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
  currencyCode: "INR";
}

export interface Product {
  id: string;
  handle: string;
  /** Full title as listed on Shopify. */
  title: string;
  /** Short display name used in headings and cart. */
  name: string;
  subtitle: string;
  brand: string;
  sku: string;
  /** Shopify variant id — used for cart permalinks to hosted checkout. */
  shopifyVariantId: string;
  price: Money;
  compareAtPrice?: Money;
  available: boolean;
  isNew?: boolean;
  tags: string[];
  images: ProductImage[];
  /** One-liner used on cards and the homepage highlight. */
  summary: string;
  /** Hero ingredients shown as chips. */
  heroIngredients: string[];
  story: {
    headline: string;
    intro: string;
    blendTitle: string;
    blendIntro: string;
    closingTitle: string;
    closing: string;
    claims: string[];
    signoff: string;
  };
  benefits: { icon: BenefitIcon; title: string; text: string }[];
  ingredients: { icon: IngredientIcon; name: string; role: string; text: string }[];
  whyItWorks: string[];
  howToUse: string[];
  badges: { icon: BadgeIcon; label: string }[];
  seo: { title: string; description: string };
}

const products: Product[] = [
  {
    id: "gid://shopify/Product/9448296120534",
    handle: "tanora-bathing-bar-bright-hydrating-skin",
    title: "TANORA - BATHING BAR | BRIGHT & HYDRATING SKIN",
    name: "Tanora Bathing Bar",
    subtitle: "Bright & Hydrating Skin",
    brand: "Green Pranite",
    sku: "950",
    shopifyVariantId: "50403590144214",
    price: { amount: 299, currencyCode: "INR" },
    available: true,
    isNew: true,
    tags: ["DETAN", "GLOW", "GLOWING SKIN", "HYDRATING", "PIGMENTATION", "TANORA", "TANOUT"],
    images: [
      {
        src: lifestyle,
        fit: "cover",
        alt: "Green Pranite TANORA Bathing Bar box on a wooden bathroom counter beside fresh oranges, curled orange peel and a dish of goat milk.",
      },
      {
        src: keyBenefits,
        alt: "TANORA key benefits: brightens complexion, fades tan and dark spots, minimizes pores, evens skin tone, deep moisturization, gentle and free-from.",
      },
      {
        src: keyIngredients,
        alt: "TANORA key ingredients — orange peel, niacinamide, kojic acid dipalmitate, goat milk and orange essential oil — with the reasons to choose Tanora.",
      },
      {
        src: beforeAfter,
        alt: "Before and after comparison of a forearm: dull, tanned skin before and a more even, glowing tone after using TANORA.",
      },
      {
        src: bathingBar,
        alt: "TANORA Bathing Bar packaging with SLS-free, paraben-free, for external use and FDA approved marks.",
      },
    ],
    summary:
      "Experience the ultimate glow. Infused with Niacinamide, Kojic Acid, and natural botanicals for skin that feels as good as it looks.",
    heroIngredients: ["Orange Peel", "Niacinamide", "Kojic Acid", "Goat Milk"],
    story: {
      headline: "Reveal the Glow You Were Born With.",
      intro:
        "Your skin works hard every day, battling sun, stress, and environmental impurities that leave it looking tired and dull. It’s time to give back. The Green Pranite TANORA Bathing Bar is a luxurious, restorative daily ritual designed to effortlessly wash away the day's fatigue and stubborn tan. Step out of every shower feeling deeply refreshed, intensely confident, and undeniably radiant.",
      blendTitle: "Where Nature Meets Science: The Master Blend",
      blendIntro:
        "We stripped away the confusion to bring you a transparent, expertly crafted formula. By combining clinical efficacy with pure, natural nourishment, every wash actively transforms your skin.",
      closingTitle: "Pure. Honest. Uncompromising.",
      closing:
        "You deserve premium skincare you can trust implicitly. Designed for daily use on both the face and body, TANORA delivers a dense, spa-like lather that respects your skin's delicate balance.",
      claims: ["FDA-Approved", "100% Cruelty-Free", "Zero Sulfates & Parabens"],
      signoff: "Experience the profound confidence of truly healthy, harmonious skin. Real care. Real results.",
    },
    benefits: [
      { icon: "sun", title: "Brightens complexion", text: "Kojic Acid & Niacinamide blend to reduce dullness." },
      { icon: "spots", title: "Fades tan & dark spots", text: "Kojic Acid targets uneven pigmentation." },
      { icon: "pores", title: "Minimizes pores", text: "Niacinamide helps refine skin surface." },
      { icon: "tone", title: "Evens skin tone", text: "Creates a uniform, radiant finish." },
      { icon: "drop", title: "Deep moisturization", text: "Goat Milk provides lasting hydration." },
      { icon: "feather", title: "Gentle & free-from", text: "Suitable for all skin, without harsh chemicals." },
    ],
    ingredients: [
      {
        icon: "orange",
        name: "Orange Peel Powder",
        role: "Botanical exfoliant · Vitamin C",
        text: "A natural botanical exfoliant packed with Vitamin C. It gently buffs away dull, dead skin cells without micro-tears, instantly refining your skin's texture.",
      },
      {
        icon: "molecule",
        name: "Niacinamide",
        role: "Refines & evens",
        text: "Half of a clinically proven powerhouse duo. Niacinamide helps refine the skin surface and works with Kojic Acid to target uneven skin tone.",
      },
      {
        icon: "flask",
        name: "Kojic Acid Dipalmitate",
        role: "Targets pigmentation",
        text: "Together with Niacinamide, it actively targets uneven skin tone, gently fading stubborn pigmentation, dark spots, and daily sun damage to reveal a flawless, luminous canvas.",
      },
      {
        icon: "milk",
        name: "Pure Goat Milk",
        role: "Deep moisture",
        text: "A rich, soothing moisture surge. It deeply hydrates and replenishes your skin's natural barrier, ensuring your face and body feel incredibly soft and supple—never tight or dry.",
      },
      {
        icon: "dropper",
        name: "Orange Essential Oil",
        role: "Uplifting botanical",
        text: "Awaken your senses. This uplifting, zesty botanical infusion energizes your mind and leaves your skin feeling exceptionally fresh and balanced.",
      },
    ],
    whyItWorks: [
      "Helps cleanse the skin",
      "Helps reduce the appearance of tan & dullness",
      "Leaves skin feeling soft & refreshed",
      "Moisturising care with goat milk",
      "Gentle for daily use",
    ],
    howToUse: [
      "Wet your face or body with water.",
      "Work the bar into a dense, spa-like lather between your palms.",
      "Massage gently over skin, then rinse thoroughly.",
      "Use daily. For external use only.",
    ],
    badges: [
      { icon: "sls", label: "SLS free" },
      { icon: "paraben", label: "Paraben free" },
      { icon: "rabbit", label: "Cruelty free" },
      { icon: "shield", label: "FDA approved" },
      { icon: "flask", label: "Lab tested" },
    ],
    seo: {
      title: "TANORA Bathing Bar — Bright & Hydrating Skin",
      description:
        "Green Pranite TANORA Bathing Bar with Orange Peel, Niacinamide, Kojic Acid and Goat Milk. Brightens, fades tan & dark spots, deeply moisturizes. SLS & paraben free. ₹299.",
    },
  },
];

/* ---------------------------------------------------------------------------
   Data access — async on purpose so a remote source can slot in later.
   --------------------------------------------------------------------------- */

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  return products.find((p) => p.handle === handle);
}

/** The product featured across the homepage. */
export async function getFeaturedProduct(): Promise<Product> {
  return products[0];
}

/** Resolve an image source to a plain URL (for JSON-LD, cart snapshots, OG tags). */
export function imageUrl(src: ProductImage["src"]): string {
  return typeof src === "string" ? src : src.src;
}

/**
 * Build the lightweight snapshot the cart stores. Call this in server
 * components and pass the result to client buttons, so client bundles never
 * need to import the catalog itself.
 */
export function toCartItem(product: Product, imageIndex = 0) {
  const img = product.images[imageIndex] ?? product.images[0];
  return {
    handle: product.handle,
    variantId: product.shopifyVariantId,
    name: product.name,
    subtitle: product.subtitle,
    price: product.price.amount,
    image: imageUrl(img.src),
    imageAlt: img.alt,
  };
}
