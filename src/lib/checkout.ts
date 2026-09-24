import type { CartItem } from "@/components/cart/CartProvider";

/**
 * Checkout hand-off.
 *
 * When NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN is set, the cart is sent to
 * Shopify's hosted, PCI-compliant checkout using a *cart permalink*
 * (https://shop/cart/<variantId>:<qty>,…) with the customer's details
 * pre-filled. No API keys are needed. Otherwise checkout runs in demo mode.
 */
export const SHOPIFY_CHECKOUT_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN?.trim() || "";

export const checkoutMode: "shopify" | "demo" = SHOPIFY_CHECKOUT_DOMAIN ? "shopify" : "demo";

export interface CheckoutDetails {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
}

export function shopifyCheckoutUrl(items: CartItem[], d: CheckoutDetails) {
  const lines = items.map((i) => `${i.variantId}:${i.quantity}`).join(",");
  const params = new URLSearchParams({
    "checkout[email]": d.email,
    "checkout[shipping_address][first_name]": d.firstName,
    "checkout[shipping_address][last_name]": d.lastName,
    "checkout[shipping_address][address1]": d.address1,
    "checkout[shipping_address][address2]": d.address2 ?? "",
    "checkout[shipping_address][city]": d.city,
    "checkout[shipping_address][province]": d.state,
    "checkout[shipping_address][zip]": d.zip,
    "checkout[shipping_address][country]": "India",
    "checkout[shipping_address][phone]": d.phone,
  });
  return `https://${SHOPIFY_CHECKOUT_DOMAIN}/cart/${lines}?${params.toString()}`;
}

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];
