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

function useCountdown() {
  const [seconds, setSeconds] = useState(() => randomBetween(8 * 60, 12 * 60))
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? randomBetween(8 * 60, 12 * 60) : prev - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return seconds
}

function useSocialCount() {
  const [count, setCount] = useState(() => randomBetween(2400, 2600))
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const schedule = () => {
      timeoutRef.current = setTimeout(() => { setCount((c) => c + 1); schedule() }, randomBetween(45_000, 90_000))
    }
    schedule()
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])
  return count.toLocaleString('en-IN')
}

const TEASERS = [
  { icon: '💼', label: 'Career',  text: 'Your career is about to face a significant turning point that will redefine your path entirely...' },
  { icon: '❤️', label: 'Love',    text: 'In matters of love, there is someone who has been thinking of you and the stars say...' },
  { icon: '💰', label: 'Finance', text: 'A major financial shift is coming in the next 60 days — one decision will determine...' },
  { icon: '🌿', label: 'Health',  text: 'Your body is sending you signals about a hidden imbalance that if addressed now will...' },
]

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
          key: keyId, amount, currency,
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
      {/* Blurred background */}
      <div style={{ filter: 'blur(4px)', opacity: 0.4, pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>

      {/* Lock overlay */}
      <div className="locked-overlay">
        <div
          className="mx-4 max-w-lg w-full"
          style={{
            background: 'rgba(15, 15, 26, 0.97)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 0 60px rgba(201,168,76,0.12), 0 20px 60px rgba(0,0,0,0.7)',
          }}
        >
          <AnimatePresence mode="wait">
            {/* ── Success state ── */}
            {paymentState === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L19 7" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '22px', color: '#E2C07A', marginBottom: '8px' }}>
                  ✨ Reading Unlocked!
                </h3>
                <p style={{ fontFamily: 'EB Garamond, serif', color: 'rgba(245,239,214,0.7)', fontSize: '16px' }}>
                  The stars have spoken. Revealing your complete cosmic blueprint…
                </p>
              </motion.div>

            ) : (
              /* ── Locked state ── */
              <motion.div key="locked" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '20px',
                  color: '#C9A84C',
                  textAlign: 'center',
                  marginBottom: '20px',
                  fontWeight: 700,
                }}>
                  🔮 Your Full Reading Awaits
                </h3>

                {/* ── Teaser rows ── */}
                <div style={{ marginBottom: '24px' }}>
                  {TEASERS.map((item, i) => (
                    <div
                      key={item.label}
                      style={{
                        background: 'transparent',
                        padding: '12px 0',
                        borderBottom: i < TEASERS.length - 1
                          ? '1px solid rgba(201, 168, 76, 0.2)'
                          : 'none',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Label */}
                      <div style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize: '11px',
                        color: '#C9A84C',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                      }}>
                        {item.icon} {item.label}
                      </div>
                      {/* Text with mask — left 40% fully visible, fades right */}
                      <div
                        style={{
                          fontFamily: 'EB Garamond, serif',
                          fontSize: '15px',
                          color: '#F5EFD6',
                          lineHeight: 1.5,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          WebkitMaskImage: 'linear-gradient(to right, black 40%, transparent 100%)',
                          maskImage: 'linear-gradient(to right, black 40%, transparent 100%)',
                        }}
                      >
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Social proof ── */}
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <motion.span
                    key={socialCount}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      fontFamily: 'Cinzel, serif',
                      fontSize: '12px',
                      color: '#C9A84C',
                      fontWeight: 600,
                    }}
                  >
                    ✨ {socialCount} readings unlocked today
                  </motion.span>
                </div>

                {/* ── Countdown ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '14px', color: 'rgba(245,239,214,0.6)' }}>
                    ⏰ Offer expires in
                  </span>
                  <span style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: timerIsUrgent ? '#f87171' : '#E2C07A',
                    transition: 'color 0.5s',
                  }}>
                    {formatTime(countdown)}
                  </span>
                </div>

                {/* ── Urgency line ── */}
                <p style={{
                  fontFamily: 'EB Garamond, serif',
                  fontSize: '13px',
                  color: '#f87171',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  marginBottom: '16px',
                }}>
                  ⚠️ Your Saturn return window is active — critical predictions locked
                </p>

                {/* ── Price block ── */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 12px',
                    borderRadius: '999px',
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.4)',
                    color: '#f87171',
                    fontFamily: 'Cinzel, serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    marginBottom: '8px',
                  }}>
                    🔥 Limited Time Offer
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '10px' }}>
                    <span style={{
                      fontFamily: 'EB Garamond, serif',
                      fontSize: '16px',
                      color: 'rgba(245,239,214,0.3)',
                      textDecoration: 'line-through',
                    }}>₹149</span>
                    <span style={{
                      fontFamily: 'Cinzel, serif',
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#C9A84C',
                      lineHeight: 1,
                    }}>₹49</span>
                  </div>
                </div>

                {/* ── Error ── */}
                <AnimatePresence>
                  {paymentState === 'error' && errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{
                        background: 'rgba(180,50,50,0.15)',
                        border: '1px solid rgba(180,50,50,0.4)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        marginBottom: '12px',
                        color: '#f87171',
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '14px',
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
                  className="glow-btn w-full rounded-lg transition-all duration-300"
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '16px',
                    padding: '14px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isProcessing ? 0.8 : 1,
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    marginBottom: '16px',
                  }}
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
                    '🔮 Unlock Full Reading'
                  )}
                </button>

                {/* ── Trust badges ── */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}>
                  {['🔒 Secure Payment', '⚡ Instant Unlock', '↩️ Money Back Guarantee'].map((badge) => (
                    <span key={badge} style={{
                      fontFamily: 'EB Garamond, serif',
                      fontSize: '12px',
                      color: 'rgba(201,168,76,0.6)',
                    }}>
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
