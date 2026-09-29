"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "./CartProvider";

/**
 * Sends the shopper to Shopify's hosted, secure checkout (`cart.checkoutUrl`),
 * after any cart changes still in flight have been saved.
 */
export function CheckoutButton({
  className,
  children = "Checkout",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { checkout } = useCart();
  const [redirecting, setRedirecting] = useState(false);

  // Coming back with the browser's Back button restores this page as it was; re-enable the button.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => e.persisted && setRedirecting(false);
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return (
    <Button
      size="lg"
      icon={redirecting ? undefined : "arrow-right"}
      className={className}
      disabled={redirecting}
      aria-busy={redirecting || undefined}
      onClick={async () => {
        setRedirecting(true);
        if (!(await checkout())) setRedirecting(false);
      }}
    >
      {redirecting ? "Opening secure checkout…" : children}
    </Button>
  );
}
