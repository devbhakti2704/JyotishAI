'use client'

import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LockedSectionProps {
  isUnlocked: boolean
  onUnlock: () => void
  children: ReactNode
}

type PaymentState = 'idle' | 'creating-order' | 'awaiting-payment' | 'verifying' | 'success' | 'error'

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.id = 'razorpay-sdk'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function LockedSection({ isUnlocked, onUnlock, children }: LockedSectionProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleUnlockClick = async () => {
    setPaymentState('creating-order')
    setErrorMsg('')

    try {
      // Step 1: Create Razorpay order on server
      const orderRes = await fetch('/api/create-order', { method: 'POST' })
      if (!orderRes.ok) {
        const data = await orderRes.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create payment order.')
      }
      const { orderId, amount, currency, keyId } = await orderRes.json()

      // Step 2: Load Razorpay checkout script
      setPaymentState('awaiting-payment')
      const loaded = await loadRazorpayScript()
      if (!loaded) throw new Error('Could not load payment gateway. Check your connection.')

      // Step 3: Open Razorpay popup
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
            // Step 4: Verify signature on server
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
                // Brief success message before revealing content
                setTimeout(() => onUnlock(), 1800)
                resolve()
              } else {
                throw new Error('Payment verification failed.')
              }
            } catch (err) {
              reject(err)
            }
          },
          modal: {
            ondismiss: () => {
              setPaymentState('idle')
              resolve() // user closed without paying — not an error
            },
          },
        })
        rzp.open()
      })
    } catch (err) {
      setPaymentState('error')
      setErrorMsg(
        err instanceof Error ? err.message : 'Payment failed. Please try again.'
      )
    }
  }

  if (isUnlocked) {
    return <>{children}</>
  }

  const isProcessing =
    paymentState === 'creating-order' ||
    paymentState === 'awaiting-payment' ||
    paymentState === 'verifying'

  return (
    <div className="relative">
      {/* Blurred content preview */}
      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.6 }}>
        {children}
      </div>

      {/* Lock overlay */}
      <div className="locked-overlay">
        <div
          className="glass-card mx-4 max-w-md w-full p-8 text-center"
          style={{
            background: 'rgba(10,10,15,0.95)',
            border: '1px solid rgba(201,168,76,0.5)',
            boxShadow: '0 0 60px rgba(201,168,76,0.15), 0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Lock / success icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(226,192,122,0.1))',
                border: '1px solid rgba(201,168,76,0.4)',
              }}
            >
              <AnimatePresence mode="wait">
                {paymentState === 'success' ? (
                  <motion.svg
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    width="32" height="32" viewBox="0 0 24 24" fill="none"
                  >
                    <path d="M5 12l5 5L19 7" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="lock"
                    initial={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    width="32" height="32" viewBox="0 0 24 24" fill="none"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#C9A84C" strokeWidth="1.5" />
                    <path d="M8 11V7a4 4 0 118 0v4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="16" r="1.5" fill="#C9A84C" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            {paymentState === 'success' ? (
              <motion.div
                key="success-msg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3
                  className="text-xl md:text-2xl font-bold mb-2"
                  style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
                >
                  ✨ Reading Unlocked!
                </h3>
                <p style={{ color: 'rgba(245,239,214,0.7)', fontFamily: 'EB Garamond, serif' }}>
                  The stars have spoken. Revealing your complete cosmic blueprint…
                </p>
              </motion.div>
            ) : (
              <motion.div key="locked-msg" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3
                  className="text-xl md:text-2xl font-bold mb-2"
                  style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
                >
                  Unlock Your Complete Reading
                </h3>
                <p
                  className="text-sm mb-6"
                  style={{ color: 'rgba(245,239,214,0.6)', fontFamily: 'EB Garamond, serif' }}
                >
                  The cosmos has revealed your free chart. Now unlock the full cosmic blueprint.
                </p>

                {/* What's inside */}
                <ul className="text-left space-y-2 mb-6">
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
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: '#D4C9A8', fontFamily: 'EB Garamond, serif' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M5 12l5 5L19 7" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Error message */}
                <AnimatePresence>
                  {paymentState === 'error' && errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-lg p-3 mb-4 text-sm"
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

                {/* Unlock button */}
                <button
                  onClick={handleUnlockClick}
                  disabled={isProcessing}
                  className="glow-btn w-full py-4 rounded-lg text-lg transition-all duration-300 flex items-center justify-center gap-3"
                  style={{
                    fontFamily: 'Cinzel, serif',
                    opacity: isProcessing ? 0.8 : 1,
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(10,10,15,0.3)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0110 10" stroke="#0A0A0F" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      {paymentState === 'creating-order' && 'Preparing Payment…'}
                      {paymentState === 'awaiting-payment' && 'Opening Checkout…'}
                      {paymentState === 'verifying' && 'Verifying Payment…'}
                    </>
                  ) : (
                    '🔮 Unlock Full Reading — ₹149'
                  )}
                </button>

                <p
                  className="text-xs mt-3"
                  style={{ color: 'rgba(245,239,214,0.4)', fontFamily: 'EB Garamond, serif' }}
                >
                  Secure payment via Razorpay · Instant access · 100% satisfaction guaranteed
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
