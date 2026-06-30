'use client'

import { useEffect, useState } from 'react'

// One-time, first-visit disclosure banner. This is informational (DPDP notice);
// the actual storage opt-in is the explicit checkbox on the reading form.
export default function ConsentBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('jyotish_notice_ack')) setShow(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem('jyotish_notice_ack', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="region"
      aria-label="Privacy notice"
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 100,
        maxWidth: 720,
        margin: '0 auto',
        background: 'rgba(15,15,26,0.97)',
        border: '1px solid rgba(201,168,76,0.4)',
        borderRadius: 12,
        padding: '14px 16px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <p
        style={{
          flex: 1,
          minWidth: 220,
          margin: 0,
          fontFamily: 'EB Garamond, serif',
          color: '#D4C9A8',
          fontSize: '0.92rem',
          lineHeight: 1.5,
        }}
      >
        We generate readings with AI. Your birth details are used only for your reading and are{' '}
        <strong>not stored unless you opt in</strong>. See our{' '}
        <a href="/privacy" style={{ color: '#C9A84C', textDecoration: 'underline' }}>Privacy Policy</a>.
      </p>
      <button
        onClick={dismiss}
        className="glow-btn"
        style={{ fontFamily: 'Cinzel, serif', padding: '9px 20px', borderRadius: 8, fontSize: '0.85rem' }}
      >
        Got it
      </button>
    </div>
  )
}
