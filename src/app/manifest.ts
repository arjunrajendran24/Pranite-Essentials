import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Pranite",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#faf6ee",
    theme_color: "#1f4a2c",
    icons: [{ src: "/icon.png", sizes: "192x192", type: "image/png" }],
  };
}
