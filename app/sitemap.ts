// app/sitemap.ts
import type { MetadataRoute } from "next";
import { SEO_TOPICS } from "@/lib/seoTopics";

const SITE = "https://jyotishai.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: SITE, priority: 1 },
    { url: `${SITE}/readings`, priority: 0.8 },
  ];

  const seoPages = SEO_TOPICS.map((t) => ({
    url: `${SITE}/reading/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: (t.intent === "low" ? "daily" : "weekly") as "daily" | "weekly",
    priority: t.intent === "high" ? 0.9 : t.intent === "medium" ? 0.7 : 0.5,
  }));

  return [...staticPages.map((p) => ({ ...p, lastModified: new Date() })), ...seoPages];
}
