import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ProductCard } from "@/components/product/ProductCard";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { LeafMark } from "@/components/decor/LeafMark";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Shop Green Pranite skincare — formulations where pure botanicals meet advanced skincare science.",
  alternates: { canonical: "/catalog" },
};

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title={
          <>
            The <span className="italic-accent text-forest-600">catalog</span>
          </>
        }
        lead="Formulations where nature meets science — pure, homegrown ingredients paired with advanced actives."
        crumbs={[{ href: "/", label: "Home" }, { label: "Catalog" }]}
      />

      <section aria-label="Products" className="container-page pt-4">
        <p className="mb-8 text-sm text-ink-500" aria-live="polite">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
        <RevealGroup as="ul" className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" stagger={0.12}>
          {products.map((p, i) => (
            <RevealItem as="li" key={p.handle}>
              <ProductCard product={p} priority={i === 0} />
            </RevealItem>
          ))}

          {/* Placeholder that keeps a one-product grid feeling intentional; remove once the range grows. */}
          {products.length < 3 && (
            <RevealItem as="li" className="sm:col-span-1 lg:col-span-2">
              <div className="bg-leaf-pattern flex h-full min-h-[22rem] flex-col items-center justify-center rounded-[2rem] border border-dashed border-forest-700/20 bg-sage-50 p-10 text-center">
                <LeafMark className="h-24 w-auto" />
                <p className="eyebrow mt-8">Growing slowly, like everything good</p>
                <p className="mt-3 max-w-md font-serif text-3xl leading-snug text-forest-900">
                  More formulations are <span className="italic-accent text-forest-600">on the way.</span>
                </p>
                <p className="mt-4 max-w-sm text-ink-500">
                  Follow{" "}
                  <a
                    href="https://www.instagram.com/green_pranite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline font-semibold text-forest-700"
                  >
                    @green_pranite
                  </a>{" "}
                  to hear about launches and early-batch offers first.
                </p>
              </div>
            </RevealItem>
          )}
        </RevealGroup>
      </section>
    </>
  );
}
