// app/readings/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { SEO_TOPICS } from "@/lib/seoTopics";

export const metadata: Metadata = {
  title: "Free Kundali Readings & Vedic Astrology Guides | JyotishAI",
  description:
    "Free guides on Manglik dosha, Sade Sati, kundali matching, marriage timing, and rashi predictions. Get your personalised reading.",
  alternates: { canonical: "https://jyotishai.xyz/readings" },
};

export default function ReadingsHub() {
  const groups = {
    high: SEO_TOPICS.filter((t) => t.intent === "high"),
    medium: SEO_TOPICS.filter((t) => t.intent === "medium"),
    low: SEO_TOPICS.filter((t) => t.intent === "low"),
  };
  const labels = { high: "Doshas & Marriage", medium: "Yearly Predictions", low: "Daily Horoscopes" };

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.25rem 4rem", color: "#EDE6D3" }}>
      <h1 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", fontSize: "2rem", marginBottom: "1.5rem" }}>
        Free Kundali Readings & Guides
      </h1>
      {(["high", "medium", "low"] as const).map((g) => (
        <section key={g} style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "Cinzel, serif", color: "#C9A84C", fontSize: "1.3rem", marginBottom: "1rem" }}>
            {labels[g]}
          </h2>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.6rem" }}>
            {groups[g].map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/reading/${t.slug}`}
                  style={{ color: "#EDE6D3", textDecoration: "none", fontFamily: "EB Garamond, serif", fontSize: "1.1rem" }}
                >
                  → {t.en.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
