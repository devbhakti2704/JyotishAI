'use client'

import { ReactNode } from 'react'

interface LockedSectionProps {
  isUnlocked: boolean
  onUnlock: () => void
  children: ReactNode
}

export default function LockedSection({ isUnlocked, onUnlock, children }: LockedSectionProps) {
  const handleUnlockClick = () => {
    console.log('TODO: Integrate Razorpay - Test key format: rzp_test_XXXXXXXXXX')
    // TODO: Initialize Razorpay with key from env, create order via /api/create-order,
    // open Razorpay checkout, on payment success call /api/unlock with orderId
    // and reveal full reading
    onUnlock()
  }

  if (isUnlocked) {
    return <>{children}</>
  }

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
          {/* Lock icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(226,192,122,0.1))',
                border: '1px solid rgba(201,168,76,0.4)',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="#C9A84C"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 11V7a4 4 0 118 0v4"
                  stroke="#C9A84C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="16" r="1.5" fill="#C9A84C" />
              </svg>
            </div>
          </div>

          {/* Heading */}
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
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M5 12l5 5L19 7"
                    stroke="#C9A84C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          {/* Unlock button */}
          <button
            onClick={handleUnlockClick}
            className="glow-btn w-full py-4 rounded-lg text-lg transition-all duration-300"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Unlock Full Reading — ₹149
          </button>

          <p
            className="text-xs mt-3"
            style={{ color: 'rgba(245,239,214,0.4)', fontFamily: 'EB Garamond, serif' }}
          >
            Secure payment · Instant access · 100% satisfaction guaranteed
          </p>
        </div>
      </div>
    </div>
  )
}
