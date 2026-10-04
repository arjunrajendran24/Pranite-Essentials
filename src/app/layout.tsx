import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SplashScript } from "@/components/splash/SplashScript";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { site } from "@/content/site";

/* Fraunces — a soft, organic serif for headlines (variable: weight, optical
   size, softness). Manrope — a calm, open sans for everything else. Both are
   self-hosted by next/font: no layout shift, no third-party request. */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Green Pranite",
    "Pranite Essentials",
    "Tanora bathing bar",
    "de-tan soap",
    "kojic acid soap",
    "niacinamide soap",
    "goat milk soap",
    "natural skincare India",
    "cruelty-free skincare",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    url: "/",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#faf6ee",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}/icon.png`,
  email: site.email,
  telephone: site.phoneHref.replace("tel:", ""),
  sameAs: [site.instagram],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the head script adds classes/data-attributes to
    // <html> before React hydrates (js flag, splash, low-power mode).
    <html lang="en-IN" className={`${fraunces.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <SplashScript />
        <noscript>
          {/* Without JS, reveal-on-scroll content must simply be visible. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[200] rounded-full bg-forest-800 px-5 py-3 text-cream-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <MotionProvider>
          <CartProvider>
            <SplashScreen />
            <Suspense fallback={<div className="h-[calc(2.25rem+4.5rem)] md:h-[calc(2.25rem+5rem)]" aria-hidden="true" />}>
              <Header />
            </Suspense>
            <main id="main" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
