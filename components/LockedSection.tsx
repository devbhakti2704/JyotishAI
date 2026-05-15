'use client'

import { ReactNode, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LockedSectionProps {
  isUnlocked: boolean
  onUnlock: () => void
  children: ReactNode
}

type PaymentState = 'idle' | 'creating-order' | 'awaiting-payment' | 'verifying' | 'success' | 'error'

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) { resolve(true); return }
    const script = document.createElement('script')
    script.id = 'razorpay-sdk'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// ── Countdown hook ─────────────────────────────────────────────────────────────
function useCountdown() {
  const [seconds, setSeconds] = useState(() => randomBetween(8 * 60, 12 * 60))

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) return randomBetween(8 * 60, 12 * 60)
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return seconds
}

// ── Social proof hook ──────────────────────────────────────────────────────────
function useSocialCount() {
  const [count, setCount] = useState(() => randomBetween(2400, 2600))
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const schedule = () => {
      timeoutRef.current = setTimeout(() => {
        setCount((c) => c + 1)
        schedule()
      }, randomBetween(45_000, 90_000))
    }
    schedule()
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  return count.toLocaleString('en-IN')
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function LockedSection({ isUnlocked, onUnlock, children }: LockedSectionProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const countdown = useCountdown()
  const socialCount = useSocialCount()

  const isProcessing =
    paymentState === 'creating-order' ||
    paymentState === 'awaiting-payment' ||
    paymentState === 'verifying'

  const timerIsUrgent = countdown < 120

  const handleUnlockClick = async () => {
    setPaymentState('creating-order')
    setErrorMsg('')

    try {
      const orderRes = await fetch('/api/create-order', { method: 'POST' })
      if (!orderRes.ok) {
        const data = await orderRes.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create payment order.')
      }
      const { orderId, amount, currency, keyId } = await orderRes.json()

      setPaymentState('awaiting-payment')
      const loaded = await loadRazorpayScript()
      if (!loaded) throw new Error('Could not load payment gateway. Check your connection.')

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId,
          amount,
          currency,
          name: 'JyotishAI',
          description: 'Full Vedic Kundali Reading',
          order_id: orderId,
          theme: { color: '#C9A84C' },
          handler: async (response) => {
            setPaymentState('verifying')
            try {
              const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              })
              const verifyData = await verifyRes.json()
              if (verifyData.success) {
                setPaymentState('success')
                setTimeout(() => onUnlock(), 1800)
                resolve()
              } else {
                throw new Error('Payment verification failed.')
              }
            } catch (err) { reject(err) }
          },
          modal: { ondismiss: () => { setPaymentState('idle'); resolve() } },
        })
        rzp.open()
      })
    } catch (err) {
      setPaymentState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Payment failed. Please try again.')
    }
  }

  if (isUnlocked) return <>{children}</>

  return (
    <div className="relative">

      {/* ── Blurred background content ── */}
      <div style={{ filter: 'blur(4px)', opacity: 0.5, pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>

      {/* ── Lock overlay ── */}
      <div className="locked-overlay">
        <div
          className="glass-card mx-4 max-w-md w-full p-7 text-center"
          style={{
            background: 'rgba(10,10,15,0.97)',
            border: '1px solid rgba(201,168,76,0.5)',
            boxShadow: '0 0 60px rgba(201,168,76,0.15), 0 20px 60px rgba(0,0,0,0.6)',
          }}
        >

          {/* Lock / success icon */}
          <div className="flex justify-center mb-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(226,192,122,0.1))',
                border: '1px solid rgba(201,168,76,0.4)',
              }}
            >
              <AnimatePresence mode="wait">
                {paymentState === 'success' ? (
                  <motion.svg key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L19 7" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                ) : (
                  <motion.svg key="lock" initial={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#C9A84C" strokeWidth="1.5" />
                    <path d="M8 11V7a4 4 0 118 0v4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="16" r="1.5" fill="#C9A84C" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* ── Success state ── */}
            {paymentState === 'success' ? (
              <motion.div key="success-msg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-xl md:text-2xl font-bold mb-2"
                  style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}>
                  ✨ Reading Unlocked!
                </h3>
                <p style={{ color: 'rgba(245,239,214,0.7)', fontFamily: 'EB Garamond, serif' }}>
                  The stars have spoken. Revealing your complete cosmic blueprint…
                </p>
              </motion.div>

            ) : (
              /* ── Locked state ── */
              <motion.div key="locked-msg" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>

                <h3 className="text-lg md:text-xl font-bold mb-1"
                  style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}>
                  Unlock Your Complete Reading
                </h3>
                <p className="text-sm mb-4"
                  style={{ color: 'rgba(245,239,214,0.55)', fontFamily: 'EB Garamond, serif' }}>
                  The cosmos has revealed your free chart. Now unlock the full blueprint.
                </p>

                {/* ── Social proof counter ── */}
                <div className="flex items-center justify-center gap-1 mb-3">
                  <motion.span
                    key={socialCount}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontFamily: 'Cinzel, serif', fontSize: '0.8rem', color: '#C9A84C', fontWeight: 600 }}
                  >
                    ✨ {socialCount} readings unlocked today
                  </motion.span>
                </div>

                {/* ── Countdown timer ── */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '0.85rem', color: 'rgba(245,239,214,0.55)' }}>
                    ⏰ Offer expires in
                  </span>
                  <span
                    style={{
                      fontFamily: 'Cinzel, serif',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: timerIsUrgent ? '#f87171' : '#E2C07A',
                      transition: 'color 0.5s',
                    }}
                  >
                    {formatTime(countdown)}
                  </span>
                </div>

                {/* ── What's inside list ── */}
                <ul className="text-left space-y-1.5 mb-4">
                  {[
                    '💼 Detailed Career Predictions (12 months)',
                    '💕 Love & Relationship Forecast',
                    '🌿 Health & Wellness Guidance',
                    '💰 Finance & Wealth Outlook',
                    '⏳ Dasha Period Timeline (5 years)',
                    '💎 Personalized Gemstone Remedy',
                    '🕉️ Sacred Mantra & Fasting Ritual',
                    '🔴 Mangal Dosha Analysis',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm"
                      style={{ color: '#D4C9A8', fontFamily: 'EB Garamond, serif' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M5 12l5 5L19 7" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* ── Teaser previews ── */}
                <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                  {[
                    { icon: '💼', label: 'Career',  text: 'Your career is about to face a significant...' },
                    { icon: '❤️', label: 'Love',    text: 'In matters of love, there is someone who...' },
                    { icon: '💰', label: 'Finance', text: 'A major financial shift is coming in...' },
                    { icon: '🌿', label: 'Health',  text: 'Your body is sending you signals about...' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '10px',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        background: 'rgba(201,168,76,0.05)',
                        border: '1px solid rgba(201,168,76,0.12)',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'EB Garamond, serif',
                          fontSize: '0.95rem',
                          color: '#F5EFD6',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ color: '#C9A84C', fontWeight: 600 }}>
                          {item.icon} {item.label}:{' '}
                        </span>
                        {item.text}
                      </span>
                      {/* Gradient curtain — fades text into background colour */}
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          width: '55%',
                          height: '100%',
                          background: 'linear-gradient(to right, transparent, #0A0A0F)',
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* ── Urgency line ── */}
                <p className="text-xs mb-3"
                  style={{ color: '#f87171', fontFamily: 'EB Garamond, serif', fontStyle: 'italic' }}>
                  ⚠️ Your Saturn return window is active — critical predictions locked
                </p>

                {/* ── Limited time badge + price ── */}
                <div className="flex flex-col items-center gap-1 mb-3">
                  <span
                    className="inline-block px-3 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: 'rgba(239,68,68,0.15)',
                      border: '1px solid rgba(239,68,68,0.4)',
                      color: '#f87171',
                      fontFamily: 'Cinzel, serif',
                      letterSpacing: '0.04em',
                    }}
                  >
                    🔥 Limited Time Offer
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span style={{
                      fontFamily: 'EB Garamond, serif',
                      fontSize: '0.95rem',
                      color: 'rgba(245,239,214,0.35)',
                      textDecoration: 'line-through',
                    }}>
                      ₹149
                    </span>
                    <span style={{
                      fontFamily: 'Cinzel, serif',
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      color: '#C9A84C',
                      lineHeight: 1,
                    }}>
                      ₹49
                    </span>
                  </div>
                </div>

                {/* ── Error message ── */}
                <AnimatePresence>
                  {paymentState === 'error' && errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="rounded-lg p-3 mb-3 text-sm"
                      style={{
                        background: 'rgba(180,50,50,0.15)',
                        border: '1px solid rgba(180,50,50,0.4)',
                        color: '#f87171',
                        fontFamily: 'EB Garamond, serif',
                      }}
                    >
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Unlock button ── */}
                <button
                  onClick={handleUnlockClick}
                  disabled={isProcessing}
                  className="glow-btn w-full py-4 rounded-lg text-base transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    fontFamily: 'Cinzel, serif',
                    opacity: isProcessing ? 0.8 : 1,
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin" width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(10,10,15,0.3)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0110 10" stroke="#0A0A0F" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      {paymentState === 'creating-order'  && 'Preparing Payment…'}
                      {paymentState === 'awaiting-payment' && 'Opening Checkout…'}
                      {paymentState === 'verifying'        && 'Verifying Payment…'}
                    </>
                  ) : (
                    '🔮 Unlock Full Reading'
                  )}
                </button>

                {/* ── Trust badges ── */}
                <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
                  {['🔒 Secure Payment', '⚡ Instant Unlock', '↩️ Money Back Guarantee'].map((badge) => (
                    <span
                      key={badge}
                      className="text-xs"
                      style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'EB Garamond, serif' }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
