/** Name of the httpOnly cookie that holds the Shopify cart id. */
export const CART_COOKIE = "pranite_cart";

/** Shopify keeps an inactive cart for ~10 days; the cookie matches that. */
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 10;
