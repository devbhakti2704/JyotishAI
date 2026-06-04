// components/SeoPageClient.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { SeoTopic } from "@/lib/seoTopics";

type Lang = "en" | "hi";

// Fire a GA event so you can SEE which page category drives form-fills.
// This is how you learn "what converts" instead of guessing.
function track(event: string, params: Record<string, string>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, params);
  }
}

export default function SeoPageClient({ topic }: { topic: SeoTopic }) {
  const [lang, setLang] = useState<Lang>("en");
  const loc = topic[lang];

  // Default to Hindi if the visitor's browser is Hindi — meets your audience where they are
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.language?.startsWith("hi")) {
      setLang("hi");
    }
    track("seo_page_view", { category: topic.category, intent: topic.intent, slug: topic.slug });
  }, [topic]);

  // The CTA links into your EXISTING free-reading form, carrying the source
  // so you can attribute payments back to the keyword theme.
  const ctaHref = `/?src=${topic.category}&intent=${topic.intent}&slug=${topic.slug}`;

  const onCta = () =>
    track("seo_cta_click", { category: topic.category, intent: topic.intent, slug: topic.slug });

  return (
    <main className="seo-page">
      {/* language toggle */}
      <div className="lang-toggle">
        <button
          className={lang === "en" ? "active" : ""}
          onClick={() => { setLang("en"); track("lang_toggle", { lang: "en" }); }}
        >
          English
        </button>
        <button
          className={lang === "hi" ? "active" : ""}
          onClick={() => { setLang("hi"); track("lang_toggle", { lang: "hi" }); }}
        >
          हिंदी
        </button>
      </div>

      <h1 className="seo-h1">{loc.title}</h1>

      {/* genuine free value — satisfies Google + builds trust before the ask */}
      <article className="seo-body">
        {loc.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      <div className="mandala-divider" aria-hidden="true">✦</div>

      {/* the personalization trigger — the real job of this page */}
      <section className="seo-cta">
        <h2>{loc.ctaHeadline}</h2>
        <p>{loc.ctaSub}</p>
        <Link href={ctaHref} onClick={onCta} className="seo-cta-btn">
          {lang === "en" ? "Get My Free Reading →" : "मेरा मुफ्त विश्लेषण पाएं →"}
        </Link>
      </section>

      {/* FAQ — visible to users, matches the JSON-LD for rich snippets */}
      <section className="seo-faq">
        <h2>{lang === "en" ? "Frequently Asked Questions" : "अक्सर पूछे जाने वाले प्रश्न"}</h2>
        {loc.faqs.map((f, i) => (
          <details key={i}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      {/* internal links — spread link equity, keep users on-site */}
      <nav className="seo-related">
        <Link href="/reading/manglik-dosha-remedies">Manglik Dosha</Link>
        <Link href="/reading/kundali-matching-for-marriage">Kundali Matching</Link>
        <Link href="/reading/shani-sade-sati-remedies">Sade Sati</Link>
        <Link href="/reading/marriage-delay-astrology">Marriage Timing</Link>
      </nav>

      <style jsx>{`
        .seo-page { max-width: 720px; margin: 0 auto; padding: 2rem 1.25rem 4rem; color: #EDE6D3; }
        .lang-toggle { display: flex; gap: 0.5rem; justify-content: flex-end; margin-bottom: 1.5rem; }
        .lang-toggle button {
          background: transparent; border: 1px solid #C9A84C; color: #C9A84C;
          padding: 0.35rem 0.9rem; border-radius: 999px; cursor: pointer; font-family: inherit;
        }
        .lang-toggle button.active { background: #C9A84C; color: #0B0E1A; }
        .seo-h1 { font-family: 'Cinzel', serif; color: #C9A84C; font-size: 1.9rem; line-height: 1.25; margin-bottom: 1.25rem; }
        .seo-body p { font-family: 'EB Garamond', serif; font-size: 1.12rem; line-height: 1.75; margin-bottom: 1rem; color: #EDE6D3; }
        .mandala-divider { text-align: center; color: #C9A84C; font-size: 1.5rem; margin: 2rem 0; opacity: 0.7; }
        .seo-cta { text-align: center; background: rgba(201,168,76,0.07); border: 1px solid rgba(201,168,76,0.35); border-radius: 16px; padding: 2rem 1.5rem; margin: 1rem 0 2.5rem; }
        .seo-cta h2 { font-family: 'Cinzel', serif; color: #C9A84C; font-size: 1.35rem; margin-bottom: 0.6rem; }
        .seo-cta p { font-family: 'EB Garamond', serif; color: #EDE6D3; margin-bottom: 1.25rem; }
        .seo-cta-btn { display: inline-block; background: #C9A84C; color: #0B0E1A; font-family: 'Cinzel', serif; font-weight: 600; padding: 0.85rem 1.75rem; border-radius: 999px; text-decoration: none; }
        .seo-faq { margin-bottom: 2.5rem; }
        .seo-faq h2 { font-family: 'Cinzel', serif; color: #C9A84C; font-size: 1.3rem; margin-bottom: 1rem; }
        .seo-faq details { border-bottom: 1px solid rgba(201,168,76,0.2); padding: 0.85rem 0; }
        .seo-faq summary { font-family: 'EB Garamond', serif; font-size: 1.1rem; color: #EDE6D3; cursor: pointer; }
        .seo-faq p { font-family: 'EB Garamond', serif; color: #C9C3B0; margin-top: 0.6rem; line-height: 1.65; }
        .seo-related { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
        .seo-related :global(a) { color: #C9A84C; text-decoration: none; border: 1px solid rgba(201,168,76,0.4); padding: 0.4rem 0.9rem; border-radius: 999px; font-family: 'EB Garamond', serif; }
      `}</style>
    </main>
  );
}
