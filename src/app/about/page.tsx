import type { Metadata } from "next";
import Image from "next/image";
import ingredients from "@/assets/images/tanora-key-ingredients.jpg";
import { PageHero } from "@/components/layout/PageHero";
import { BrandFilm } from "@/components/home/BrandFilm";
import { PraniteStandard } from "@/components/home/PraniteStandard";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { OrangeSlice } from "@/components/decor/Botanicals";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Pranite Essentials is an Indian personal care brand bridging traditional botanical wisdom and modern skin science. Our brand Green Pranite stands for purity, efficacy and trust.",
  alternates: { canonical: "/about" },
};

const chapters = [
  {
    title: "Who We Are",
    text: "Pranite Essentials is an Indian personal care brand on a mission to bridge the gap between traditional botanical wisdom and modern skin science. Our brand Green Pranite stands for purity, efficacy, and trust.",
  },
  {
    title: "Our Roots",
    text: "We started with a simple observation: people deserve products that are both safe and effective. Our R&D Team always create formulations that deliver real, visible results.",
  },
  {
    title: "Our Approach",
    text: "Every Green Pranite product combines carefully selected natural actives with science-backed ingredients. We believe transparency builds trust — that's why we clearly list every key ingredient and its proven benefit.",
  },
  {
    title: "Our Commitment to Quality",
    text: "At Green Pranite, we don't just make promises—we prove them. Every formulation undergoes rigorous quality-control testing for safety, stability, and clinical efficacy before it ever reaches your skin. We maintain strict oversight of our ingredients. All our products are 100% cruelty-free, transparently labeled, and manufactured to the highest industry standards.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            About Pranite <span className="italic-accent text-forest-600">Essentials</span>
          </>
        }
        lead="Where traditional botanical wisdom meets modern skin science — and where every ingredient earns its place."
        crumbs={[{ href: "/", label: "Home" }, { label: "About Us" }]}
      />

      {/* Brand film + parent/flagship relationship */}
      <section aria-labelledby="house-title" className="container-page grid items-center gap-14 py-10 md:grid-cols-2 md:gap-20 md:py-16">
        <Reveal y={40}>
          <BrandFilm className="aspect-video rounded-[2rem] shadow-soft md:aspect-[4/3] md:rounded-[2.5rem]" />
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow">One trusted roof</p>
            <h2 id="house-title" className="text-h2 mt-4 text-forest-900">
              A house of brands, <span className="italic-accent text-forest-600">led by Green Pranite</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-lead mt-6 text-ink-500">
              Pranite Essentials is the parent company and corporate home for a growing portfolio of modern wellness and
              lifestyle brands — built to unify all dimensions of human living under one trusted roof, delivering
              uncompromising, premium quality without exception.
            </p>
            <p className="mt-5 leading-relaxed text-ink-500">
              Green Pranite is our flagship pioneer brand, specializing in premium, earth-grown superfoods and
              science-backed personal care. While Green Pranite leads the way today, Pranite Essentials is dedicated to
              incubating and launching multiple specialized brands in the future.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story chapters */}
      <section aria-label="Our story" className="container-page py-20 md:py-28">
        <RevealGroup as="ol" className="grid gap-5 md:grid-cols-3" stagger={0.1}>
          {chapters.map((c, i) => (
            <RevealItem
              as="li"
              key={c.title}
              className={`relative overflow-hidden rounded-[2rem] p-8 md:p-12 ${
                i === 3 ? "bg-forest-800 text-cream-50 md:col-span-3" : "border border-forest-700/10 bg-cream-50"
              }`}
            >
              <span
                aria-hidden="true"
                className={`font-serif text-7xl leading-none md:text-8xl ${i === 3 ? "text-cream-50/15" : "text-sage-200"}`}
              >
                0{i + 1}
              </span>
              <h2 className={`text-h3 mt-6 ${i === 3 ? "text-cream-50" : "text-forest-900"}`}>{c.title}</h2>
              <p className={`mt-4 max-w-2xl leading-relaxed ${i === 3 ? "text-sage-200" : "text-ink-500"}`}>{c.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Transparency */}
      <section aria-labelledby="transparency-title" className="container-page grid items-center gap-14 py-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="lg:order-2">
          <Reveal>
            <p className="eyebrow">100% transparent ingredients</p>
            <h2 id="transparency-title" className="text-h2 mt-4 text-forest-900">
              Nothing hidden. <span className="italic-accent text-forest-600">Everything explained.</span>
            </h2>
            <p className="text-lead mt-6 text-ink-500">
              We harvest the purest, sustainably-sourced natural ingredients and enhance them with rigorous, modern
              formulation science — for maximum safety, skin compatibility, and real-world efficacy. No harsh synthetic
              fillers, no parabens, no unnecessary additives.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-9">
            <ButtonLink href="/products/tanora-bathing-bar-bright-hydrating-skin" icon="arrow-right">
              See what’s inside Tanora
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal y={40} className="relative lg:order-1">
          <div className="overflow-hidden rounded-[2rem] shadow-soft md:rounded-[2.5rem]">
            <Image
              src={ingredients}
              alt="TANORA key ingredients: orange peel, niacinamide, kojic acid dipalmitate, goat milk and orange essential oil."
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, 92vw"
              className="h-auto w-full"
            />
          </div>
          <OrangeSlice className="absolute -bottom-6 -right-4 w-20 md:w-24" />
        </Reveal>
      </section>

      <PraniteStandard className="mt-10" />
    </>
  );
}
