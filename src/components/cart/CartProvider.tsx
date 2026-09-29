"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import {
  addToCartAction,
  getCartAction,
  removeCartLineAction,
  updateCartLineAction,
  type CartActionResult,
} from "@/lib/cart-actions";
import type { Cart, CartLine } from "@/lib/shopify/types";

/**
 * Cart backed by the Shopify Cart API (via Server Actions; the cart id lives
 * in an httpOnly cookie).
 *
 * Changes apply optimistically, so the drawer and "Added" feedback respond
 * instantly, and are sent to Shopify one at a time, in order. Once the queue
 * drains, the UI settles on the cart Shopify returned (real prices, stock
 * limits, line ids). Lines are keyed by variant id, which never changes.
 */

export const MAX_QTY = 10;

export type CartItem = CartLine;
/** What a product page hands the cart before Shopify has assigned a line. */
export type CartProductSnapshot = Omit<CartLine, "id" | "quantity">;

type State = {
  items: CartItem[];
  serverSubtotal: number;
  checkoutUrl: string | null;
  isOpen: boolean;
  hydrated: boolean;
  pending: boolean;
  notice: string | null;
};
type Action =
  | { type: "sync"; cart: Cart | null }
  | { type: "add"; item: CartProductSnapshot; quantity: number }
  | { type: "set"; variantId: string; quantity: number }
  | { type: "remove"; variantId: string }
  | { type: "pending" }
  | { type: "notice"; notice: string | null }
  | { type: "open" }
  | { type: "close" };

const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.round(n)));

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "sync":
      return {
        ...state,
        items: action.cart?.lines ?? [],
        serverSubtotal: action.cart?.subtotal ?? 0,
        checkoutUrl: action.cart?.checkoutUrl ?? null,
        hydrated: true,
        pending: false,
      };
    case "add": {
      const existing = state.items.find((i) => i.variantId === action.item.variantId);
      const items = existing
        ? state.items.map((i) =>
            i.variantId === action.item.variantId ? { ...i, quantity: clamp(i.quantity + action.quantity) } : i,
          )
        : // Shopify lists the newest line first; match it so nothing jumps when the cart syncs.
          [{ ...action.item, id: `pending:${action.item.variantId}`, quantity: clamp(action.quantity) }, ...state.items];
      return { ...state, items };
    }
    case "set":
      return {
        ...state,
        items: state.items.map((i) => (i.variantId === action.variantId ? { ...i, quantity: clamp(action.quantity) } : i)),
      };
    case "remove":
      return { ...state, items: state.items.filter((i) => i.variantId !== action.variantId) };
    case "pending":
      return { ...state, pending: true, notice: null };
    case "notice":
      return { ...state, notice: action.notice };
    case "open":
      return { ...state, isOpen: true };
    case "close":
      return { ...state, isOpen: false };
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  /** False until the cart has been loaded from Shopify once. */
  hydrated: boolean;
  /** True while changes are still being saved to Shopify. */
  pending: boolean;
  /** Message from Shopify (e.g. only 3 left in stock) or a failed update. */
  notice: string | null;
  dismissNotice: () => void;
  add: (item: CartProductSnapshot, quantity?: number, options?: { open?: boolean }) => Promise<void>;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  /** Waits for pending changes, then sends the shopper to Shopify's hosted checkout. False if there's nothing to buy. */
  checkout: () => Promise<boolean>;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** A variant's line in a confirmed cart. Resolved when a queued op runs, so a line added moments earlier is found. */
const lineFor = (cart: Cart | null, variantId: string) => cart?.lines.find((l) => l.variantId === variantId);

const OFFLINE: CartActionResult = {
  cart: null,
  error: "We couldn’t reach the store. Please check your connection and try again.",
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    serverSubtotal: 0,
    checkoutUrl: null,
    isOpen: false,
    hydrated: false,
    pending: false,
    notice: null,
  });

  /** Last cart Shopify confirmed. */
  const latest = useRef<Cart | null>(null);
  /** Tail of the mutation queue. */
  const queue = useRef<Promise<void>>(Promise.resolve());
  const inFlight = useRef(0);
  /** Bumped by every mutation, so a slower background refresh can't overwrite newer data. */
  const version = useRef(0);

  const run = useCallback((op: () => Promise<CartActionResult>) => {
    inFlight.current += 1;
    version.current += 1;
    dispatch({ type: "pending" });
    const task = queue.current.then(async () => {
      const result = await op().catch(() => ({ ...OFFLINE, cart: latest.current }));
      latest.current = result.cart;
      if (result.error || result.notice) dispatch({ type: "notice", notice: result.error ?? result.notice ?? null });
      inFlight.current -= 1;
      if (inFlight.current === 0) dispatch({ type: "sync", cart: latest.current });
    });
    queue.current = task;
    return task;
  }, []);

  const refresh = useCallback(async () => {
    if (inFlight.current > 0) return;
    const started = version.current;
    const result = await getCartAction().catch(() => OFFLINE);
    if (version.current !== started || inFlight.current > 0) return;
    if (result.error && !latest.current) {
      dispatch({ type: "notice", notice: result.error });
      dispatch({ type: "sync", cart: null });
      return;
    }
    if (result.error) return; // keep showing the cart we have
    latest.current = result.cart;
    dispatch({ type: "sync", cart: result.cart });
  }, []);

  // Load after mount so server and client render the same (empty) cart first.
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Pick up changes from other tabs, and from Shopify checkout: once an order
  // is placed the cart is gone and comes back empty.
  useEffect(() => {
    const onVisible = () => document.visibilityState === "visible" && refresh();
    const onPageShow = (e: PageTransitionEvent) => e.persisted && refresh();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [refresh]);

  const add = useCallback<CartContextValue["add"]>(
    (item, quantity = 1, options) => {
      dispatch({ type: "add", item, quantity });
      if (options?.open !== false) dispatch({ type: "open" });
      return run(() => {
        const room = MAX_QTY - (lineFor(latest.current, item.variantId)?.quantity ?? 0);
        const qty = Math.min(clamp(quantity), room);
        return qty > 0 ? addToCartAction(item.variantId, qty) : Promise.resolve({ cart: latest.current });
      });
    },
    [run],
  );

  const setQuantity = useCallback(
    (variantId: string, quantity: number) => {
      dispatch({ type: "set", variantId, quantity });
      run(() => {
        const line = lineFor(latest.current, variantId);
        return line ? updateCartLineAction(line.id, clamp(quantity)) : Promise.resolve({ cart: latest.current });
      });
    },
    [run],
  );

  const remove = useCallback(
    (variantId: string) => {
      dispatch({ type: "remove", variantId });
      run(() => {
        const line = lineFor(latest.current, variantId);
        return line ? removeCartLineAction(line.id) : Promise.resolve({ cart: latest.current });
      });
    },
    [run],
  );

  const checkout = useCallback(async (): Promise<boolean> => {
    // Let every queued change reach Shopify first, so checkout shows the same cart.
    let tail: Promise<void>;
    do {
      tail = queue.current;
      await tail;
    } while (tail !== queue.current);

    const cart = latest.current;
    if (cart?.checkoutUrl && cart.lines.length) {
      window.location.assign(cart.checkoutUrl);
      return true;
    }
    dispatch({ type: "notice", notice: "Your cart is empty — add something before checking out." });
    return false;
  }, []);

  const dismissNotice = useCallback(() => dispatch({ type: "notice", notice: null }), []);
  const open = useCallback(() => dispatch({ type: "open" }), []);
  const close = useCallback(() => dispatch({ type: "close" }), []);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((n, i) => n + i.quantity, 0);
    // While changes are in flight, estimate from unit prices; then show Shopify's own subtotal.
    const subtotal = state.pending
      ? state.items.reduce((n, i) => n + i.quantity * i.price, 0)
      : state.serverSubtotal;
    return {
      items: state.items,
      count,
      subtotal,
      isOpen: state.isOpen,
      hydrated: state.hydrated,
      pending: state.pending,
      notice: state.notice,
      dismissNotice,
      add,
      setQuantity,
      remove,
      checkout,
      open,
      close,
    };
  }, [state, dismissNotice, add, setQuantity, remove, checkout, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
