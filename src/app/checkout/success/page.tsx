import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmation } from "@/components/cart/OrderConfirmation";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="container-page max-w-3xl pb-8 pt-16 md:pt-24">
      <Suspense fallback={<div className="h-80 animate-pulse rounded-[2rem] bg-sand-200/40" />}>
        <OrderConfirmation />
      </Suspense>
    </div>
  );
}
