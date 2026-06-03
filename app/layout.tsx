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
  title: 'JyotishAI — Free Vedic Kundali Reading',
  description:
    'Get your free AI-powered Vedic Kundali reading instantly. Discover your Rashi, Lagna, career predictions, love life and more.',
  keywords:
    'Vedic astrology, Kundali reading, Rashifal, Jyotish, birth chart, horoscope, gemstone, AI astrology',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'JyotishAI — Free Vedic Kundali Reading',
    description:
      'Get your free AI-powered Vedic Kundali reading instantly. Discover your Rashi, Lagna, career predictions, love life and more.',
    type: 'website',
    images: ['/favicon.png'],
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
