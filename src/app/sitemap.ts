import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { policies } from "@/content/policies";
import { site } from "@/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = ["", "/catalog", "/about", "/faq", "/contact", "/track-order"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
  const products = (await getProducts()).map((p) => ({
    url: `${site.url}/products/${p.handle}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
  const legal = policies.map((p) => ({
    url: `${site.url}/policies/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));
  return [...pages, ...products, ...legal];
}
