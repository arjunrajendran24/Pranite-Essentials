/**
 * Storefront API response shapes (only the fields this site queries) and the
 * app-level cart type the UI consumes.
 */

export type Connection<T> = { nodes: T[] };

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  tags: string[];
  availableForSale: boolean;
  description: string;
  descriptionHtml: string;
  seo: { title: string | null; description: string | null };
  featuredImage: ShopifyImage | null;
  images: Connection<ShopifyImage>;
  variants: Connection<ShopifyVariant>;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: { amountPerQuantity: ShopifyMoney; totalAmount: ShopifyMoney };
  merchandise: {
    id: string;
    title: string;
    image: ShopifyImage | null;
    product: { handle: string; title: string; featuredImage: ShopifyImage | null };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: ShopifyMoney; totalAmount: ShopifyMoney };
  lines: Connection<ShopifyCartLine>;
}

export interface ShopifyUserError {
  field?: string[] | null;
  message: string;
}

export interface ShopifyCartWarning {
  code: string;
  message: string;
}

/** A cart mutation payload: `cartCreate`, `cartLinesAdd`, … */
export interface CartMutationPayload {
  cart: ShopifyCart | null;
  userErrors: ShopifyUserError[];
  warnings?: ShopifyCartWarning[];
}

/* ---------------------------------------------------------------------------
   App-level cart (what the client components render)
   --------------------------------------------------------------------------- */

export interface CartLine {
  /** Shopify cart line id. */
  id: string;
  /** Shopify variant gid — one line per variant, so this doubles as the UI key. */
  variantId: string;
  handle: string;
  name: string;
  subtitle: string;
  /** Unit price in INR. */
  price: number;
  image: string;
  imageAlt: string;
  quantity: number;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: number;
  lines: CartLine[];
}
