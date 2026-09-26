import type { NextConfig } from "next";

// Shopify-hosted customer accounts (keep in sync with `accountUrl` in src/content/site.ts).
const ACCOUNT_URL = (process.env.NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL || "https://shopify.com/76863570134/account").replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // next/image serves AVIF first, then WebP, at the exact size each layout needs.
    formats: ["image/avif", "image/webp"],
    // Ready for product images served straight from Shopify's CDN later on.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
  // Keep old Shopify URLs working (and their search ranking) after the move.
  async redirects() {
    return [
      { source: "/collections/:path*", destination: "/catalog", permanent: true },
      { source: "/products", destination: "/catalog", permanent: true },
      { source: "/pages/about-us", destination: "/about", permanent: true },
      { source: "/pages/contact", destination: "/contact", permanent: true },
      { source: "/pages/faq", destination: "/faq", permanent: true },
      { source: "/pages/track-order", destination: "/track-order", permanent: true },
      // Login / account live on Shopify. These keep old store links and the
      // "View your order" links in Shopify notification emails working.
      { source: "/account", destination: ACCOUNT_URL, permanent: false },
      { source: "/account/login", destination: ACCOUNT_URL, permanent: false },
      { source: "/account/register", destination: ACCOUNT_URL, permanent: false },
      { source: "/customer_authentication/:path*", destination: ACCOUNT_URL, permanent: false },
      { source: "/account/:path+", destination: `${ACCOUNT_URL}/:path+`, permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
