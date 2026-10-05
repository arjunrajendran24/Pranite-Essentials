/**
 * Editorial product content: the storytelling sections of a product page
 * (benefits, master blend, results, promise) that Shopify has no fields for.
 *
 * Commerce data (title, price, stock, variants, images, description) always
 * comes from Shopify. This content is matched by **Shopify product tag**, so
 * every product tagged `TANORA` (the single bar and the value packs) gets the
 * full Tanora page. Products without a matching tag get a clean, simpler page
 * built from their Shopify description alone.
 */
import type { StaticImageData } from "next/image";
import beforeAfter from "@/assets/images/tanora-before-after.jpg";
import type { BotanicalName, IconName } from "@/components/icons/Icons";

export type BenefitIcon = "sun" | "spots" | "pores" | "tone" | "drop" | "feather";
export type IngredientIcon = "orange" | "molecule" | "flask" | "milk" | "dropper";
export type BadgeIcon = "sls" | "paraben" | "rabbit" | "shield" | "flask" | "hand";

export interface ProductBundle {
  /** Shopify product handle for the pack. */
  handle: string;
  /** Short label, e.g. "Pack of 2". */
  title: string;
  /** Save callout, e.g. "save 20%". */
  saveLabel: string;
}

export interface ProductPromise {
  title: string;
  text: string;
  /** Prefer botanical marks; fall back to a UI icon when needed. */
  icon: BotanicalName | IconName;
  iconKind?: "botanical" | "ui";
}

export interface ProductContent {
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
  /** Multi-pack value deals ("Buy more, save more"). */
  bundles?: ProductBundle[];
  /** Short trust points shown beside the buy box. */
  promises?: ProductPromise[];
  /** Image for the "Real results" section. */
  resultsImage: { src: StaticImageData; alt: string };
}

/** The product featured on the homepage (falls back to the first product if it's ever removed). */
export const FEATURED_PRODUCT_HANDLE = "tanora-bathing-bar-bright-hydrating-skin";

const tanora: ProductContent = {
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
    claims: ["100% Cruelty-Free", "Zero Sulfates & Parabens"],
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
    { icon: "flask", label: "Lab tested" },
  ],
  bundles: [
    { handle: "tanora-bathing-bar-pack-of-2-save-20", title: "Pack of 2", saveLabel: "save 20%" },
    { handle: "tanora-bathing-bar-pack-of-3-save-25", title: "Pack of 3", saveLabel: "save 25%" },
  ],
  promises: [
    { icon: "rabbit", title: "Cruelty-free", text: "Never tested on animals" },
    { icon: "leaf", title: "Sulfate & paraben free", text: "Gentle formula" },
    { icon: "truck", iconKind: "ui", title: "Quick delivery", text: "2–3 days after dispatch" },
    { icon: "mail", iconKind: "ui", title: "Easy support", text: "We are here to help" },
  ],
  resultsImage: {
    src: beforeAfter,
    alt: "Before and after comparison of a forearm: dull, tanned skin before and a more even, glowing tone after using TANORA.",
  },
};

/** Shopify tag (case-insensitive) → content. */
const byTag: Record<string, ProductContent> = {
  tanora: tanora,
};

export function getProductContent(tags: string[]): ProductContent | undefined {
  for (const tag of tags) {
    const content = byTag[tag.toLowerCase()];
    if (content) return content;
  }
  return undefined;
}
