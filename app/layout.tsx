import type { Metadata } from 'next'
import { Cinzel, EB_Garamond } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cinzel',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'JyotishAI — Vedic Astrology & Kundali Reading',
  description:
    'Discover your cosmic destiny with JyotishAI — AI-powered Vedic astrology readings, Kundali charts, daily Rashifal, and personalized gemstone recommendations rooted in ancient Jyotish wisdom.',
  keywords:
    'Vedic astrology, Kundali reading, Rashifal, Jyotish, birth chart, horoscope, gemstone, AI astrology',
  openGraph: {
    title: 'JyotishAI — Vedic Astrology & Kundali Reading',
    description:
      'Ancient wisdom meets modern intelligence. Get your free Kundali reading powered by AI.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${ebGaramond.variable}`}>
      {GA_ID && (
        <head>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </head>
      )}
      <body
        className="font-garamond bg-navy-dark text-cream min-h-screen antialiased"
        style={{ backgroundColor: '#0A0A0F', color: '#F5EFD6' }}
      >
        {children}
      </body>
    </html>
  )
}
