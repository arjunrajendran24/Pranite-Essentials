/**
 * Brand-wide settings: contact details, navigation and shared copy.
 * Everything here was migrated from praniteessentials.com.
 */
export const site = {
  name: "Pranite Essentials",
  brand: "Green Pranite",
  legalName: "Pranite Essentials LLP",
  tagline: "Where nature meets science",
  description:
    "Green Pranite by Pranite Essentials — premium skincare that combines pure, homegrown botanicals with advanced skincare science. 100% natural, science-backed, cruelty-free.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.praniteessentials.com").replace(/\/$/, ""),
  announcement: "Luxury Skincare. Real Results. Experience the Pranite Difference",

  email: "connect@praniteessentials.com",
  phone: "+91 9867 441254",
  phoneHref: "tel:+919867441254",
  location: "Mumbai, Maharashtra, India",
  address: {
    street: "C-1/302, 3rd floor, Ganesh Silver Sarita CHS, Mira Road East",
    locality: "Thane",
    region: "Maharashtra",
    postalCode: "401107",
    country: "IN",
  },
  instagram: "https://www.instagram.com/green_pranite",
  instagramHandle: "@green_pranite",
} as const;

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const footerNav = {
  shop: [
    { href: "/catalog", label: "All products" },
    { href: "/products/tanora-bathing-bar-bright-hydrating-skin", label: "Tanora Bathing Bar" },
    { href: "/track-order", label: "Track your order" },
    { href: "/cart", label: "Your cart" },
  ],
  company: [
    { href: "/about", label: "About us" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact us" },
  ],
  policies: [
    { href: "/policies/privacy-policy", label: "Privacy policy" },
    { href: "/policies/terms-of-service", label: "Terms of service" },
    { href: "/policies/shipping-policy", label: "Shipping policy" },
    { href: "/policies/refund-policy", label: "Refund policy" },
    { href: "/policies/contact-information", label: "Contact information" },
    { href: "/policies/legal-notice", label: "Legal notice" },
  ],
} as const;

/** "The Pranite standard" — the four brand values used on Home and About. */
export const praniteStandard = [
  { icon: "leaf", title: "100% Natural", text: "Pure ingredients chosen with intention." },
  { icon: "flask", title: "Science-Backed", text: "Formulations guided by thoughtful research." },
  { icon: "rabbit", title: "Cruelty-Free", text: "Kind to animals, always." },
  { icon: "sparkle", title: "Real Results", text: "Visible care for skin that feels as good as it looks." },
] as const;

/** Shipping facts from the shipping policy, reused on product, cart and checkout. */
export const shippingFacts = {
  dispatch: "Dispatched within 1–3 business days",
  delivery: "Delivered in 3–7 business days",
  freeShipping: "Free standard shipping on all orders",
  prepaid: "100% prepaid — UPI, cards & net banking. No cash on delivery.",
} as const;
