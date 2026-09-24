import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { TrackOrder } from "@/components/forms/TrackOrder";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Enter your order number and email to track your Pranite Essentials shipment.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return (
    <>
      <PageHero
        eyebrow="Orders"
        title={
          <>
            Track your <span className="italic-accent text-forest-600">order</span>
          </>
        }
        lead="Enter your order number and email to track your shipment."
        crumbs={[{ href: "/", label: "Home" }, { label: "Track Your Order" }]}
      />
      <section className="container-page">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[2rem] bg-sand-200/40" />}>
          <TrackOrder />
        </Suspense>
      </section>
    </>
  );
}
