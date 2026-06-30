'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import StarBackground from '@/components/StarBackground'

const WHATSAPP_URL = 'https://wa.me/919480362861'

export default function AstrologerThankYouPage() {
  return (
    <main className="relative min-h-screen" style={{ zIndex: 0 }}>
      <StarBackground />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="glass-card w-full max-w-md"
          style={{ border: '1px solid rgba(201,168,76,0.35)', padding: '32px 24px' }}
        >
          {/* Success check */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L19 7" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '26px', color: '#E2C07A', fontWeight: 700, marginBottom: '10px' }}>
            Payment Confirmed
          </h1>
          <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '16px', color: '#D4C9A8', lineHeight: 1.6, marginBottom: '24px' }}>
            Thank you for booking a consultation. Tap below to start your chat with our Vedic
            astrologer on WhatsApp — share your name and birth details and they&apos;ll guide you personally.
          </p>

          {/* WhatsApp CTA — opens in a new tab */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-btn w-full rounded-xl"
            style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', padding: '15px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A0A0F">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.52 0-3.01-.41-4.3-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.35c0-4.54 3.7-8.23 8.24-8.23 4.54 0 8.23 3.69 8.23 8.23 0 4.54-3.69 8.24-8.23 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
            </svg>
            Chat on WhatsApp
          </a>

          <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '13px', color: 'rgba(245,239,214,0.4)', marginTop: '16px' }}>
            Didn&apos;t open? Message us at <span style={{ color: '#C9A84C' }}>+91 94803 62861</span>.
          </p>

          <div style={{ marginTop: '24px' }}>
            <Link href="/" style={{ fontFamily: 'Cinzel, serif', fontSize: '14px', color: 'rgba(201,168,76,0.7)' }}>
              ← Back to JyotishAI
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
