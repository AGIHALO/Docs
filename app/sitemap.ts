import type { MetadataRoute } from "next";
import { DOC_ENTRIES } from "@/lib/navigation";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-07-27T00:00:00.000Z");
  return DOC_ENTRIES.map((entry) => ({
    url: `https://docs.agihalo.com/${entry.slug}`,
    lastModified: updated,
    changeFrequency: "weekly",
    priority: entry.slug === "quickstart" ? 1 : 0.7,
  }));
}
