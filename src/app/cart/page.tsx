import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="container-page pb-8 pt-8 md:pt-12">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Cart" }]} />
      <h1 className="text-display mb-10 mt-8 text-forest-900 md:mb-14">
        Your <span className="italic-accent text-forest-600">cart</span>
      </h1>
      <CartView />
    </div>
  );
}
