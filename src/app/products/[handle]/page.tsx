import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/motion/Reveal";
import { InViewClass } from "@/components/motion/InViewClass";
import { BotanicalIcon, Icon } from "@/components/icons/Icons";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { BenefitsSection, ClosingBand, MasterBlend, ResultsSection } from "@/components/product/ProductSections";
import { getProduct, getProducts, imageUrl, toCartItem } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import { faqGroups } from "@/content/faq";
import { shippingFacts, site } from "@/content/site";

type Params = { params: Promise<{ handle: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};
  const img = product.images[0];
  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      type: "website",
      title: `${product.brand} ${product.name} — ${product.subtitle}`,
      description: product.seo.description,
      url: `/products/${product.handle}`,
      images: [{ url: imageUrl(img.src), alt: img.alt }],
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const cartItem = toCartItem(product);
  const faqs = faqGroups.filter((g) => g.id === "pricing" || g.id === "why-our-soaps").flatMap((g) => g.items);
  const productUrl = `${site.url}/products/${product.handle}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${product.brand} ${product.name}`,
      description: product.story.intro,
      sku: product.sku,
      brand: { "@type": "Brand", name: product.brand },
      image: product.images.map((i) => `${site.url}${imageUrl(i.src)}`),
      url: productUrl,
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: product.price.currencyCode,
        price: product.price.amount.toFixed(2),
        availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: site.name },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Catalog", item: `${site.url}/catalog` },
        { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
      ],
    },
  ];

  return (
    <>
      <section className="container-page pt-6 md:pt-10" aria-labelledby="product-title">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/catalog", label: "Catalog" }, { label: product.name }]} />

        {/* minmax(0,…) + min-w-0: never let intrinsic widths (e.g. the thumbnail strip) stretch the columns past the viewport */}
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-10 md:mt-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />

          <div className="min-w-0">
            <Reveal y={16}>
              <div className="flex items-center gap-3">
                <p className="eyebrow">{product.brand}</p>
                {product.isNew && (
                  <span className="rounded-full bg-leaf-300/50 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-forest-800">
                    New
                  </span>
                )}
              </div>
              <h1 id="product-title" className="mt-4 text-[clamp(2.4rem,1.8rem+2.6vw,3.8rem)] leading-[1.02] text-forest-900">
                TANORA <span className="italic-accent text-forest-600">Bathing Bar</span>
              </h1>
              <p className="mt-3 text-lg text-ink-500">{product.subtitle}</p>
            </Reveal>

            <Reveal delay={0.06} y={16}>
              <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-serif text-3xl tabular-nums text-forest-900">
                  <span className="sr-only">Price: </span>
                  {formatPrice(product.price.amount)}
                </p>
                <p className="text-sm text-ink-500">MRP, inclusive of all taxes</p>
              </div>
              <p className="mt-6 font-serif text-xl italic text-forest-700">{product.story.headline}</p>
              <p className="mt-3 leading-relaxed text-ink-600">{product.summary}</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Key ingredients">
                {product.heroIngredients.map((i) => (
                  <li key={i} className="rounded-full border border-forest-700/15 bg-cream-50 px-3.5 py-1.5 text-sm text-ink-700">
                    {i}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12} y={16} className="mt-8">
              <ProductPurchase item={cartItem} available={product.available} />
            </Reveal>

            <Reveal delay={0.16} y={16}>
              <ul className="mt-8 grid gap-3 rounded-[1.5rem] border border-forest-700/10 bg-cream-50 p-5 text-sm text-ink-600">
                <li className="flex items-center gap-3">
                  <Icon name="truck" className="size-5 text-forest-600" /> {shippingFacts.freeShipping}
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="clock" className="size-5 text-forest-600" /> {shippingFacts.dispatch} · {shippingFacts.delivery.toLowerCase()}
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="lock" className="size-5 text-forest-600" /> Secure, prepaid checkout (UPI, cards, net banking)
                </li>
              </ul>
            </Reveal>

            <InViewClass className="mt-8" amount={0.5}>
              <ul className="flex flex-wrap justify-between gap-y-4 border-y border-forest-700/10 py-6" aria-label="Product credentials">
                {product.badges.map((b) => (
                  <li key={b.label} className="flex w-1/5 min-w-[4.5rem] flex-col items-center gap-2 text-center">
                    <span className="grid size-14 place-items-center rounded-full border border-gold-400/60 text-gold-600">
                      <BotanicalIcon name={b.icon} draw className="size-8" strokeWidth={1.6} />
                    </span>
                    <span className="text-[0.68rem] font-semibold uppercase leading-tight tracking-[0.1em] text-ink-600">{b.label}</span>
                  </li>
                ))}
              </ul>
            </InViewClass>

            <Accordion
              className="mt-4"
              defaultOpen={[0]}
              items={[
                {
                  title: "Description",
                  content: (
                    <div className="space-y-4">
                      <p className="font-semibold text-ink-700">Green Pranite TANORA Bathing Bar | Advanced Brightening &amp; Hydrating Soap</p>
                      <p>{product.story.intro}</p>
                      <p>{product.story.closing}</p>
                      <p className="font-semibold text-forest-700">{product.story.claims.join(" • ")}</p>
                    </div>
                  ),
                },
                {
                  title: "Key ingredients",
                  content: (
                    <ul className="space-y-3">
                      {product.ingredients.map((i) => (
                        <li key={i.name}>
                          <strong className="text-ink-900">{i.name}:</strong> {i.text}
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  title: "How to use",
                  content: (
                    <ol className="list-inside list-decimal space-y-2">
                      {product.howToUse.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  ),
                },
                {
                  title: "Shipping & returns",
                  content: (
                    <div className="space-y-3">
                      <p>
                        {shippingFacts.dispatch}; standard delivery takes 3–7 business days. {shippingFacts.freeShipping}.
                      </p>
                      <p>
                        All sales are final. If your order arrives damaged, defective or incorrect, contact us within 7 days
                        and we’ll send a replacement.{" "}
                        <Link href="/policies/refund-policy" className="link-underline font-semibold text-forest-700">
                          Refund policy
                        </Link>
                      </p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>

      <BenefitsSection product={product} />
      <MasterBlend product={product} />
      <ResultsSection product={product} />
      <ClosingBand product={product} />

      <section aria-labelledby="product-faq-title" className="container-page max-w-4xl py-24 md:py-32">
        <Reveal>
          <p className="eyebrow">Good to know</p>
          <h2 id="product-faq-title" className="text-h2 mt-4 text-forest-900">
            Questions, <span className="italic-accent text-forest-600">answered</span>
          </h2>
        </Reveal>
        <Accordion className="mt-10" items={faqs.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} />
        <p className="mt-8 text-ink-500">
          More questions?{" "}
          <Link href="/faq" className="link-underline font-semibold text-forest-700">
            Read the full FAQ
          </Link>
        </p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
