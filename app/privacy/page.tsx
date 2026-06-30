'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PrivacyPage() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Pre-fill the deletion code if this browser made a stored submission.
  useEffect(() => {
    const saved = localStorage.getItem('jyotish_deletion_code')
    if (saved) setCode(saved)
  }, [])

  const requestErasure = async () => {
    if (!code.trim()) return
    setStatus('working')
    setMessage('')
    try {
      const res = await fetch(`/api/submissions/${encodeURIComponent(code.trim())}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.deleted) {
        setStatus('done')
        setMessage('Your stored data has been permanently deleted.')
        localStorage.removeItem('jyotish_deletion_code')
      } else {
        setStatus('error')
        setMessage(data.error || 'No record found for that code.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please email us instead.')
    }
  }

  const h2 = { fontFamily: 'Cinzel, serif', color: '#E2C07A', fontSize: '1.25rem', margin: '28px 0 10px' }
  const p = { fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1.02rem', lineHeight: 1.75, margin: '0 0 12px' }

  return (
    <main style={{ minHeight: '100vh', background: '#0A0A0F', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <Link href="/" style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', fontSize: '1.1rem', fontWeight: 700 }}>
          ॐ JyotishAI
        </Link>

        <h1 style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A', fontSize: '2rem', margin: '24px 0 6px' }}>
          Privacy Policy
        </h1>
        <p style={{ ...p, color: 'rgba(245,239,214,0.5)', fontSize: '0.9rem' }}>
          Last updated 3 June 2026 · Consent version 2026-06-03
        </p>

        <p style={p}>
          JyotishAI is an AI-powered Vedic astrology tool. This policy explains, in plain language,
          what we collect, why, how long we keep it, and how you can have it deleted. We follow
          India&apos;s Digital Personal Data Protection (DPDP) Act, 2023.
        </p>

        <h2 style={h2}>What we collect</h2>
        <p style={p}>
          To generate a reading we use your <strong>name, date of birth, time of birth, place of
          birth</strong>, and any <strong>optional question</strong> you type. By default, this is
          processed only to produce your reading and is <strong>not stored</strong>.
        </p>
        <p style={p}>
          We only save these details if you tick the consent box on the reading form. If you don&apos;t
          tick it, your reading is still generated — nothing is written to our database.
        </p>

        <h2 style={h2}>Why we collect it &amp; how we use it</h2>
        <p style={p}>
          Stored details let us improve our service and produce <strong>anonymized, aggregated
          insights</strong> (for example: &ldquo;X% of users aged 25–34 in Maharashtra asked about
          career this month&rdquo;). These aggregates contain <strong>no names, no exact birth data,
          and no raw question text</strong>, and we only ever report a group when it contains at least
          25 people. We may share or sell these anonymized aggregates to third parties. We do
          <strong> not</strong> sell your individual personal data.
        </p>

        <h2 style={h2}>How it&apos;s protected</h2>
        <p style={p}>
          Sensitive fields (your name, birth details, and question text) are <strong>encrypted at
          rest</strong>. The coarse buckets used for aggregates (state, age band, topic) are derived
          once at the time of saving and stored separately from the encrypted personal data.
        </p>

        <h2 style={h2}>How long we keep it</h2>
        <p style={p}>
          We retain your stored personal data until you withdraw consent / request deletion (below).
          Anonymized aggregates, which can no longer identify you, may be kept indefinitely.
        </p>

        <h2 style={h2}>Your rights &amp; how to delete your data</h2>
        <p style={p}>
          You can request erasure at any time. When you consented, we showed your browser a private
          deletion code (auto-filled below if available). Enter it and delete your record instantly:
        </p>

        <div
          style={{
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: 10,
            padding: 16,
            margin: '12px 0 16px',
            background: 'rgba(15,15,26,0.6)',
          }}
        >
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your deletion code"
              style={{
                flex: 1,
                minWidth: 220,
                background: 'rgba(10,10,15,0.8)',
                border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#F5EFD6',
                fontFamily: 'EB Garamond, serif',
              }}
            />
            <button
              onClick={requestErasure}
              disabled={status === 'working' || !code.trim()}
              className="glow-btn"
              style={{ fontFamily: 'Cinzel, serif', padding: '10px 20px', borderRadius: 8, opacity: status === 'working' ? 0.7 : 1 }}
            >
              {status === 'working' ? 'Deleting…' : 'Delete My Data'}
            </button>
          </div>
          {message && (
            <p style={{ ...p, margin: '10px 0 0', color: status === 'done' ? '#4ade80' : '#f87171' }}>
              {message}
            </p>
          )}
        </div>

        <p style={p}>
          Lost your code, or want help? Email our grievance contact at{' '}
          <a href="mailto:privacy@jyotishai.xyz" style={{ color: '#C9A84C' }}>privacy@jyotishai.xyz</a>{' '}
          and we will erase your data on request.
        </p>

        <h2 style={h2}>Intended for adults</h2>
        <p style={p}>
          JyotishAI is intended for users aged 18 and over. Please do not submit a minor&apos;s personal
          data.
        </p>

        <p style={{ ...p, marginTop: 32 }}>
          <Link href="/" style={{ color: '#C9A84C' }}>← Back to JyotishAI</Link>
        </p>
      </div>
    </main>
  )
}
