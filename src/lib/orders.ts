import { readStorage, writeStorage } from "@/lib/utils";
import type { CartItem } from "@/components/cart/CartProvider";

/**
 * Orders placed through the built-in (demo) checkout are kept in this
 * browser so the confirmation and "Track your order" pages can show them.
 * With Shopify checkout enabled, real orders live in Shopify instead and
 * tracking arrives by e-mail/SMS as described in the shipping policy.
 */
export interface LocalOrder {
  number: string;
  email: string;
  name: string;
  city: string;
  items: CartItem[];
  total: number;
  createdAt: string;
}

const KEY = "pranite:orders:v1";

export function saveOrder(order: LocalOrder) {
  const orders = readStorage<LocalOrder[]>(KEY, []);
  writeStorage(KEY, [order, ...orders].slice(0, 20));
}

export function findOrder(number: string, email: string): LocalOrder | undefined {
  const n = number.trim().replace(/^#/, "").toUpperCase();
  const e = email.trim().toLowerCase();
  return readStorage<LocalOrder[]>(KEY, []).find(
    (o) => o.number.toUpperCase() === n && o.email.toLowerCase() === e,
  );
}

export function newOrderNumber() {
  return `PE${Math.floor(100000 + Math.random() * 900000)}`;
}
