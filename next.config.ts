import type { NextConfig } from "next";

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
