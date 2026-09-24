import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-page pb-8 pt-8 md:pt-12">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/cart", label: "Cart" }, { label: "Checkout" }]} />
      <h1 className="text-display mb-10 mt-8 text-forest-900 md:mb-14">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
