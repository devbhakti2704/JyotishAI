'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'
import { startRazorpayCheckout, type CheckoutStage } from '@/lib/razorpay'

type State = 'idle' | CheckoutStage | 'error'

export default function TalkToAstrologer() {
  const router = useRouter()
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const busy = state === 'creating-order' || state === 'awaiting-payment' || state === 'verifying'

  const handleClick = () => {
    setErrorMsg('')
    trackEvent('astrologer_clicked')
    startRazorpayCheckout({
      product: 'astrologer',
      description: 'Live consultation with a Vedic astrologer',
      onStage: (s) => setState(s),
      onSuccess: () => {
        trackEvent('purchase', { value: 499, currency: 'INR', product: 'astrologer' })
        // Redirect to the confirmation / thank-you screen with the WhatsApp CTA.
        router.push('/astrologer/thank-you')
      },
      onError: (msg) => { setState('error'); setErrorMsg(msg) },
      onDismiss: () => setState('idle'),
    })
  }

  return (
    <div
      className="glass-card"
      style={{ border: '1px solid rgba(201,168,76,0.3)', padding: '24px', textAlign: 'center' }}
    >
      <div className="flex justify-center mb-3">
        <div className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.35)' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '19px', color: '#E2C07A', fontWeight: 700, marginBottom: '6px' }}>
        Talk to a Real Astrologer
      </h3>
      <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '15px', color: 'rgba(245,239,214,0.6)', lineHeight: 1.5, marginBottom: '16px' }}>
        Want a human expert to interpret your chart and answer your questions personally?
        Book a 1-on-1 consultation over WhatsApp.
      </p>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '26px', fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>₹499</span>
        <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '14px', color: 'rgba(245,239,214,0.5)' }}>per consultation</span>
      </div>

      {state === 'error' && errorMsg && (
        <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '14px', color: '#f87171', marginBottom: '12px' }}>{errorMsg}</p>
      )}

      <motion.button
        onClick={handleClick}
        disabled={busy}
        whileHover={busy ? {} : { scale: 1.02 }}
        whileTap={busy ? {} : { scale: 0.98 }}
        className="glow-btn w-full rounded-xl"
        style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: busy ? 0.8 : 1, cursor: busy ? 'not-allowed' : 'pointer' }}
      >
        {busy ? (
          <>
            <svg className="animate-spin" width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(10,10,15,0.3)" strokeWidth="3" />
              <path d="M12 2a10 10 0 0110 10" stroke="#0A0A0F" strokeWidth="3" strokeLinecap="round" />
            </svg>
            {state === 'creating-order' && 'Preparing Payment…'}
            {state === 'awaiting-payment' && 'Opening Checkout…'}
            {state === 'verifying' && 'Verifying Payment…'}
          </>
        ) : (
          '🧑‍🏫 Talk to a Real Astrologer — ₹499'
        )}
      </motion.button>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" />
          <path d="M8 11V7a4 4 0 118 0v4" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '13px', color: 'rgba(201,168,76,0.55)' }}>
          Secure payment via Razorpay
        </span>
      </div>
    </div>
  )
}
