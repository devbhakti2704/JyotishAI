// app/reading/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTopic, getAllSlugs, type SeoTopic, type TopicLocale } from "@/lib/seoTopics";
import SeoPageClient from "@/components/SeoPageClient";

const SITE = "https://jyotishai.xyz";

// Pre-render every page at build time (true static SEO, fast + indexable)
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// Per-page <title>, description, canonical, hreflang, OG tags
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const topic = getTopic(params.slug);
  if (!topic) return {};
  const url = `${SITE}/reading/${topic.slug}`;
  return {
    title: topic.en.title,
    description: topic.en.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        // same URL serves both languages via client toggle; hreflang signals intent
        "en-IN": url,
        "hi-IN": url,
        "x-default": url,
      },
    },
    openGraph: {
      title: topic.en.title,
      description: topic.en.metaDescription,
      url,
      siteName: "JyotishAI",
      locale: "en_IN",
      type: "article",
    },
    twitter: { card: "summary_large_image", title: topic.en.title, description: topic.en.metaDescription },
  };
}

// FAQ + Article JSON-LD => rich snippets in Google
function jsonLd(topic: SeoTopic, loc: TopicLocale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: loc.title,
        description: loc.metaDescription,
        inLanguage: "en-IN",
        publisher: { "@type": "Organization", name: "JyotishAI", url: SITE },
        mainEntityOfPage: `${SITE}/reading/${topic.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: loc.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(topic, topic.en)) }}
      />
      <SeoPageClient topic={topic} />
    </>
  );
}
