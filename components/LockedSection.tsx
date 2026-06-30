'use client'

import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'
import { startRazorpayCheckout, type CheckoutStage } from '@/lib/razorpay'

interface LockedSectionProps {
  isUnlocked: boolean
  onUnlock: () => void
  preview?: ReactNode   // real content shown (with a fade cutoff) above the paywall when locked
  children: ReactNode   // full content, shown only once unlocked
}

type PaymentState = 'idle' | CheckoutStage | 'success' | 'error'

const WHATS_INCLUDED = [
  { icon: '💼', text: 'Detailed career path & timing for the next 12 months' },
  { icon: '💕', text: 'Love & marriage predictions' },
  { icon: '🌿', text: 'Health outlook & wellness guidance' },
  { icon: '💰', text: 'Financial forecast & wealth timing' },
  { icon: '⏳', text: 'Your Dasha periods for the next 5 years' },
  { icon: '💎', text: 'Personalised remedies: gemstone, mantra & fasting day' },
  { icon: '🔴', text: 'Mangal Dosha analysis' },
]

export default function LockedSection({ isUnlocked, onUnlock, preview, children }: LockedSectionProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const isProcessing =
    paymentState === 'creating-order' ||
    paymentState === 'awaiting-payment' ||
    paymentState === 'verifying'

  const handleUnlockClick = () => {
    // SEO attribution captured on the landing page (defaults to 'direct').
    const attribution = {
      src: sessionStorage.getItem('jyotish_src') || 'direct',
      intent: sessionStorage.getItem('jyotish_intent') || 'direct',
      slug: sessionStorage.getItem('jyotish_slug') || 'direct',
    }
    trackEvent('unlock_clicked', attribution)
    setErrorMsg('')
    startRazorpayCheckout({
      product: 'reading',
      description: 'Full Vedic Kundali Reading',
      onStage: (stage) => setPaymentState(stage),
      onSuccess: () => {
        trackEvent('purchase', { value: 49, currency: 'INR', ...attribution })
        setPaymentState('success')
        setTimeout(() => onUnlock(), 1800)
      },
      onError: (msg) => { setPaymentState('error'); setErrorMsg(msg) },
      onDismiss: () => setPaymentState('idle'),
    })
  }

  if (isUnlocked) return <>{children}</>

  return (
    <div>
      {/* Real content preview that fades out into the paywall (no blur — actual reading). */}
      {preview && (
        <div style={{ position: 'relative', maxHeight: 280, overflow: 'hidden', marginBottom: 4 }}>
          {preview}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 160,
              background: 'linear-gradient(to bottom, rgba(10,10,15,0) 0%, rgba(10,10,15,0.85) 55%, #0A0A0F 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {/* Payment box — sits directly under the preview, so it's reached with minimal scroll. */}
      <div
        className="mx-auto max-w-lg w-full"
        style={{
          background: 'rgba(15, 15, 26, 0.97)',
          border: '1px solid rgba(201, 168, 76, 0.35)',
          borderRadius: '14px',
          padding: '28px 24px',
          boxShadow: '0 0 60px rgba(201,168,76,0.1), 0 24px 64px rgba(0,0,0,0.7)',
        }}
      >
        <AnimatePresence mode="wait">
          {/* ── Success state ── */}
          {paymentState === 'success' ? (
            <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L19 7" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '22px', color: '#E2C07A', marginBottom: '8px', fontWeight: 700 }}>
                ✨ Reading Unlocked!
              </h3>
              <p style={{ fontFamily: 'EB Garamond, serif', color: 'rgba(245,239,214,0.7)', fontSize: '16px' }}>
                Revealing your complete cosmic blueprint…
              </p>
            </motion.div>

          ) : (
            /* ── Locked / paywall state ── */
            <motion.div key="locked" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '20px', color: '#C9A84C', textAlign: 'center', marginBottom: '6px', fontWeight: 700 }}>
                🔮 Continue Reading — Unlock the Full Chart
              </h3>
              <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '15px', color: 'rgba(245,239,214,0.55)', textAlign: 'center', marginBottom: '20px' }}>
                You&apos;ve seen the opening. Unlock every section below.
              </p>

              {/* Value anchor */}
              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '15px', color: '#D4C9A8', lineHeight: 1.5 }}>
                  A human astrologer charges{' '}
                  <span style={{ color: '#E2C07A', fontWeight: 600 }}>₹500–₹2,000</span>{' '}for a detailed reading.
                  <br />Your complete AI reading:{' '}
                  <span style={{ color: '#C9A84C', fontWeight: 700, fontFamily: 'Cinzel, serif' }}>just ₹49.</span>
                </p>
              </div>

              {/* What's included */}
              <p style={{ fontFamily: 'Cinzel, serif', fontSize: '11px', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Your full reading includes:
              </p>
              <ul style={{ marginBottom: '20px', paddingLeft: 0, listStyle: 'none' }}>
                {WHATS_INCLUDED.map((item) => (
                  <li key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '7px 0', borderBottom: '1px solid rgba(201,168,76,0.1)', fontFamily: 'EB Garamond, serif', fontSize: '15px', color: '#D4C9A8' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '3px' }}>
                      <path d="M5 12l5 5L19 7" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{item.icon} {item.text}</span>
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div style={{ textAlign: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '16px', color: 'rgba(245,239,214,0.3)', textDecoration: 'line-through' }}>₹149</span>
                  <span style={{ fontFamily: 'Cinzel, serif', fontSize: '30px', fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>₹49</span>
                </div>
                <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '12px', color: 'rgba(201,168,76,0.5)', letterSpacing: '0.04em' }}>
                  Launch price — will increase soon
                </p>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {paymentState === 'error' && errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ background: 'rgba(180,50,50,0.12)', border: '1px solid rgba(180,50,50,0.35)', borderRadius: '8px', padding: '10px 14px', margin: '12px 0', color: '#f87171', fontFamily: 'EB Garamond, serif', fontSize: '14px', textAlign: 'center' }}>
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Unlock button */}
              <button
                onClick={handleUnlockClick}
                disabled={isProcessing}
                className="glow-btn w-full rounded-xl transition-all duration-300"
                style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', padding: '15px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', marginBottom: '14px', opacity: isProcessing ? 0.8 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin" width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(10,10,15,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0110 10" stroke="#0A0A0F" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    {paymentState === 'creating-order'   && 'Preparing Payment…'}
                    {paymentState === 'awaiting-payment' && 'Opening Checkout…'}
                    {paymentState === 'verifying'        && 'Verifying Payment…'}
                  </>
                ) : (
                  '🔮 Unlock Full Reading — ₹49'
                )}
              </button>

              {/* Trust row */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" />
                  <path d="M8 11V7a4 4 0 118 0v4" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '13px', color: 'rgba(201,168,76,0.55)' }}>
                  Secure payment via Razorpay
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
