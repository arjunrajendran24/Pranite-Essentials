"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { readStorage, writeStorage } from "@/lib/utils";

/**
 * Client-side cart.
 *
 * Lines store a small snapshot of the product (title, price, image URL) so the
 * cart renders without refetching. When moving to Shopify's Cart API, keep
 * this context's public shape (`items`, `add`, `setQuantity`, …) and swap the
 * reducer for API calls — the UI components won't need to change.
 */

export const MAX_QTY = 10;
const STORAGE_KEY = "pranite:cart:v1";

export interface CartItem {
  handle: string;
  variantId: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  imageAlt: string;
  quantity: number;
}

type State = { items: CartItem[]; isOpen: boolean; hydrated: boolean };
type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; item: Omit<CartItem, "quantity">; quantity: number }
  | { type: "set"; handle: string; quantity: number }
  | { type: "remove"; handle: string }
  | { type: "clear" }
  | { type: "open" }
  | { type: "close" };

const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.round(n)));

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...state, items: action.items, hydrated: true };
    case "add": {
      const existing = state.items.find((i) => i.handle === action.item.handle);
      const items = existing
        ? state.items.map((i) =>
            i.handle === action.item.handle ? { ...i, ...action.item, quantity: clamp(i.quantity + action.quantity) } : i,
          )
        : [...state.items, { ...action.item, quantity: clamp(action.quantity) }];
      return { ...state, items };
    }
    case "set":
      return {
        ...state,
        items: state.items.map((i) => (i.handle === action.handle ? { ...i, quantity: clamp(action.quantity) } : i)),
      };
    case "remove":
      return { ...state, items: state.items.filter((i) => i.handle !== action.handle) };
    case "clear":
      return { ...state, items: [] };
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
  hydrated: boolean;
  add: (item: Omit<CartItem, "quantity">, quantity?: number, options?: { open?: boolean }) => void;
  setQuantity: (handle: string, quantity: number) => void;
  remove: (handle: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false, hydrated: false });

  // Load after mount so server and client render the same (empty) cart first.
  useEffect(() => {
    const saved = readStorage<CartItem[]>(STORAGE_KEY, []);
    dispatch({ type: "hydrate", items: Array.isArray(saved) ? saved : [] });
  }, []);

  useEffect(() => {
    if (state.hydrated) writeStorage(STORAGE_KEY, state.items);
  }, [state.items, state.hydrated]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) dispatch({ type: "hydrate", items: readStorage<CartItem[]>(STORAGE_KEY, []) });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback<CartContextValue["add"]>((item, quantity = 1, options) => {
    dispatch({ type: "add", item, quantity });
    if (options?.open !== false) dispatch({ type: "open" });
  }, []);
  const setQuantity = useCallback((handle: string, quantity: number) => dispatch({ type: "set", handle, quantity }), []);
  const remove = useCallback((handle: string) => dispatch({ type: "remove", handle }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const open = useCallback(() => dispatch({ type: "open" }), []);
  const close = useCallback(() => dispatch({ type: "close" }), []);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = state.items.reduce((n, i) => n + i.quantity * i.price, 0);
    return { ...state, count, subtotal, add, setQuantity, remove, clear, open, close };
  }, [state, add, setQuantity, remove, clear, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
