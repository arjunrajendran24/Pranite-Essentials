"use server";

/**
 * Cart Server Actions. The Shopify cart id lives in an httpOnly cookie, so the
 * cart survives reloads and new tabs, and the Storefront API is only ever
 * called from the server.
 *
 * Actions return `{ cart, error?, notice? }` instead of throwing: thrown errors
 * are masked in production, and the UI needs the latest cart either way.
 */
import { cookies } from "next/headers";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  ShopifyError,
  updateCartLines,
  type CartMutationResult,
} from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";
import { CART_COOKIE, CART_COOKIE_MAX_AGE } from "@/lib/cart-cookie";

export type CartActionResult = { cart: Cart | null; error?: string; notice?: string };

async function readCartId() {
  return (await cookies()).get(CART_COOKIE)?.value;
}

async function writeCartId(id: string) {
  (await cookies()).set(CART_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

async function clearCartId() {
  (await cookies()).delete(CART_COOKIE);
}

/** Current cart, or null. Forgets the cookie once the cart is gone (expired or checked out). */
async function loadCart(): Promise<Cart | null> {
  const id = await readCartId();
  if (!id) return null;
  const cart = await getCart(id);
  if (!cart) await clearCartId();
  return cart;
}

async function run(mutate: (cartId: string | undefined) => Promise<CartMutationResult>): Promise<CartActionResult> {
  try {
    const { cart, notice } = await mutate(await readCartId());
    return { cart, notice };
  } catch (err) {
    console.error("[cart]", err);
    const message =
      err instanceof ShopifyError && err.userFacing
        ? err.message // Shopify's own message, e.g. "The product is sold out"
        : "We couldn’t update your cart. Please try again.";
    let cart: Cart | null = null;
    try {
      cart = await loadCart();
    } catch {
      /* keep the error above */
    }
    return { cart, error: message };
  }
}

export async function getCartAction(): Promise<CartActionResult> {
  try {
    return { cart: await loadCart() };
  } catch (err) {
    console.error("[cart]", err);
    return { cart: null, error: "We couldn’t load your cart. Please refresh the page." };
  }
}

export async function addToCartAction(variantId: string, quantity: number): Promise<CartActionResult> {
  return run(async (cartId) => {
    const lines = [{ merchandiseId: variantId, quantity }];
    if (cartId) {
      const result = await addCartLines(cartId, lines);
      if (result.cart) return result;
    }
    // No cart yet, or the old one expired / was checked out: start a fresh one.
    const result = await createCart(lines);
    await writeCartId(result.cart!.id);
    return result;
  });
}

export async function updateCartLineAction(lineId: string, quantity: number): Promise<CartActionResult> {
  return run(async (cartId) => {
    if (!cartId) return { cart: null };
    return quantity > 0 ? updateCartLines(cartId, [{ id: lineId, quantity }]) : removeCartLines(cartId, [lineId]);
  });
}

export async function removeCartLineAction(lineId: string): Promise<CartActionResult> {
  return run(async (cartId) => (cartId ? removeCartLines(cartId, [lineId]) : { cart: null }));
}
