import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SingleLeaf } from "@/components/decor/Botanicals";
import { CART_COOKIE } from "@/lib/cart-cookie";
import { getCart } from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

/**
 * Checkout happens on Shopify's hosted, secure checkout. This route stays for
 * old links and bookmarks: it forwards a non-empty cart straight there.
 */
export default async function CheckoutPage() {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  let cart: Cart | null = null;
  if (cartId) {
    try {
      cart = await getCart(cartId);
    } catch (err) {
      console.error("[checkout]", err);
    }
  }
  // redirect() throws, so it must sit outside the try/catch above.
  if (cart?.lines.length) redirect(cart.checkoutUrl);

  return (
    <div className="container-page pb-8 pt-8 md:pt-12">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/cart", label: "Cart" }, { label: "Checkout" }]} />
      <h1 className="text-display mb-10 mt-8 text-forest-900 md:mb-14">Checkout</h1>
      <div className="flex flex-col items-center rounded-[2.5rem] bg-sage-50 px-6 py-20 text-center">
        <SingleLeaf className="w-16" />
        <h2 className="text-h2 mt-6 text-forest-900">Nothing to check out yet</h2>
        <p className="mt-3 text-ink-500">Add something lovely to your cart first.</p>
        <ButtonLink href="/catalog" icon="arrow-right" className="mt-8">
          Browse the catalog
        </ButtonLink>
      </div>
    </div>
  );
}
