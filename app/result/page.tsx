'use client'

import { useEffect, useState, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import StarBackground from '@/components/StarBackground'
import MandalaDivider from '@/components/MandalaDivider'
import KundaliChart from '@/components/KundaliChart'
import LockedSection from '@/components/LockedSection'
import ShareCard from '@/components/ShareCard'
import TalkToAstrologer from '@/components/TalkToAstrologer'
import { trackEvent } from '@/lib/analytics'

interface DashaPeriod {
  period: string
  planet: string
  prediction: string
}

interface ReadingData {
  rashi: string
  lagna: string
  luckyNumber: number
  luckyColor: string
  freeReading: {
    personalityOverview: string
    currentPhase: string
  }
  fullReading: {
    career: string
    love: string
    health: string
    finance: string
    dashas: DashaPeriod[]
    remedies: {
      gemstone: string
      mantra: string
      fasting: string
      other: string
    }
    mangalDosha: {
      present: boolean
      description: string
    }
  }
  formData: {
    name: string
    dob: string
    tob: string
    pob: string
  }
  generatedAt: string
}

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

function SpinningMandala() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: 'spin-slow 8s linear infinite' }}
      >
        <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
        <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="0.8" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const x = 60 + Math.cos(rad) * 35
          const y = 60 + Math.sin(rad) * 35
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="10"
              ry="5"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="0.8"
              strokeOpacity="0.7"
              transform={`rotate(${angle} ${x} ${y})`}
            />
          )
        })}
        <circle cx="60" cy="60" r="15" fill="none" stroke="#C9A84C" strokeWidth="1" />
        <circle cx="60" cy="60" r="5" fill="#C9A84C" opacity="0.8" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <line
              key={i}
              x1={60 + Math.cos(rad) * 15}
              y1={60 + Math.sin(rad) * 15}
              x2={60 + Math.cos(rad) * 45}
              y2={60 + Math.sin(rad) * 45}
              stroke="#C9A84C"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />
          )
        })}
      </svg>
      <p
        className="text-lg italic"
        style={{ fontFamily: 'EB Garamond, serif', color: '#E2C07A' }}
      >
        Reading your chart…
      </p>
      <p
        className="text-sm"
        style={{ fontFamily: 'EB Garamond, serif', color: 'rgba(212,201,168,0.6)' }}
      >
        Calculating your cosmic blueprint
      </p>
    </div>
  )
}

function ReadingCard({ title, content, icon }: { title: string; content: string; icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3
          className="font-bold"
          style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A', fontSize: '1rem' }}
        >
          {title}
        </h3>
      </div>
      <p
        className="leading-relaxed"
        style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1rem' }}
      >
        {content}
      </p>
    </div>
  )
}

function ResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')

  const [reading, setReading] = useState<ReadingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribeState, setSubscribeState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  useEffect(() => {
    if (!id) {
      setError('No reading ID found. Please start a new reading.')
      setIsLoading(false)
      return
    }

    try {
      const stored = localStorage.getItem(`jyotish_reading_${id}`)
      if (!stored) {
        setError('Reading not found. It may have expired. Please start a new reading.')
        setIsLoading(false)
        return
      }
      const data = JSON.parse(stored) as ReadingData
      setReading(data)
      trackEvent('reading_completed')
    } catch {
      setError('Failed to load your reading. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const rashiSymbols: Record<string, string> = {
    Mesh: '♈',
    Vrishabh: '♉',
    Mithun: '♊',
    Kark: '♋',
    Sinh: '♌',
    Kanya: '♍',
    Tula: '♎',
    Vrishchik: '♏',
    Dhanu: '♐',
    Makar: '♑',
    Kumbh: '♒',
    Meen: '♓',
    Aries: '♈',
    Taurus: '♉',
    Gemini: '♊',
    Cancer: '♋',
    Leo: '♌',
    Virgo: '♍',
    Libra: '♎',
    Scorpio: '♏',
    Sagittarius: '♐',
    Capricorn: '♑',
    Aquarius: '♒',
    Pisces: '♓',
  }

  const handleShare = useCallback(async (rashi: string) => {
    const text = `I just got my free Vedic Kundali reading on JyotishAI! My Rashi is ${rashi}. Check yours free at jyotishai.xyz`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for browsers that block clipboard without user gesture
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }, [])

  const handleSubscribe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setSubscribeState('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setSubscribeState('done')
    } catch {
      setSubscribeState('error')
    }
  }, [email])

  const getRashiSymbol = (rashi: string) => {
    for (const [key, val] of Object.entries(rashiSymbols)) {
      if (rashi.toLowerCase().includes(key.toLowerCase())) return val
    }
    return '✦'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinningMandala />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <p
          className="text-4xl"
          style={{ color: '#C9A84C' }}
        >
          ✦
        </p>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
        >
          The Stars Are Momentarily Obscured
        </h2>
        <p
          style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', maxWidth: '400px' }}
        >
          {error}
        </p>
        <Link href="/reading" className="glow-btn px-8 py-3 rounded-xl">
          Start a New Reading
        </Link>
      </div>
    )
  }

  if (!reading) return null

  const name = reading.formData?.name || 'Seeker'
  const rashiSymbol = getRashiSymbol(reading.rashi)

  // One poetic line for the shareable card — first sentence of the overview.
  const tagline = (() => {
    const overview = reading.freeReading?.personalityOverview || ''
    const first = overview.split(/(?<=[.!?])\s/)[0]?.trim() || 'Written in the stars, guided by ancient light.'
    return first.length > 120 ? first.slice(0, 117).trimEnd() + '…' : first
  })()

  // First few sentences of the full reading — shown as a REAL (un-blurred) preview
  // that fades into the paywall, so the visitor reads genuine content before paying.
  const previewText = (() => {
    const career = reading.fullReading?.career || ''
    const sentences = career.split(/(?<=[.!?])\s+/).slice(0, 3).join(' ')
    return sentences || career.slice(0, 320)
  })()

  return (
    <div className="relative z-10 min-h-screen px-4 pt-20 pb-16">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Back button */}
          <motion.div variants={fadeInUp} className="mb-6">
            <button
              onClick={() => router.push('/reading')}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ fontFamily: 'Cinzel, serif', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.05em' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              New Reading
            </button>
          </motion.div>

          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <p
              className="text-sm tracking-widest uppercase mb-2"
              style={{ fontFamily: 'Cinzel, serif', color: 'rgba(201,168,76,0.6)' }}
            >
              Your Cosmic Blueprint
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold mb-3 gold-text"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {name}
            </h1>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span
                className="text-2xl md:text-3xl"
                style={{ color: '#C9A84C' }}
              >
                {rashiSymbol}
              </span>
              <span
                className="text-xl md:text-2xl font-bold"
                style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
              >
                {reading.rashi}
              </span>
              <span style={{ color: 'rgba(201,168,76,0.4)' }}>·</span>
              <span
                className="text-lg"
                style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontStyle: 'italic' }}
              >
                Lagna: {reading.lagna}
              </span>
            </div>
          </motion.div>

          {/* Kundali Chart — draws itself in once on load */}
          <motion.div variants={fadeInUp} className="flex justify-center mb-8">
            <motion.div
              className="glass-card p-6"
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
            >
              <KundaliChart name={name} rashi={reading.rashi} lagna={reading.lagna} />
            </motion.div>
          </motion.div>

          <MandalaDivider />

          {/* Free Section */}
          <motion.div variants={fadeInUp} className="mt-8">
            {/* Free badge */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C, #E2C07A)',
                  color: '#0A0A0F',
                  fontFamily: 'Cinzel, serif',
                  letterSpacing: '0.1em',
                }}
              >
                FREE READING
              </span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }} />
            </div>

            {/* Rashi card */}
            <div className="glass-card p-6 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.3)',
                  }}
                >
                  {rashiSymbol}
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
                  >
                    {reading.rashi}
                  </h2>
                  <p
                    className="text-sm"
                    style={{ fontFamily: 'EB Garamond, serif', color: 'rgba(201,168,76,0.7)' }}
                  >
                    Your Vedic Rashi (Moon Sign)
                  </p>
                </div>
              </div>
            </div>

            {/* Personality overview */}
            <div className="glass-card p-6 mb-4">
              <h3
                className="font-bold mb-3"
                style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
              >
                Personality Overview
              </h3>
              <p
                className="leading-relaxed"
                style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1.05rem', lineHeight: 1.8 }}
              >
                {reading.freeReading?.personalityOverview}
              </p>
              {reading.freeReading?.currentPhase && (
                <p
                  className="mt-3 leading-relaxed italic"
                  style={{ fontFamily: 'EB Garamond, serif', color: 'rgba(212,201,168,0.8)', fontSize: '1rem' }}
                >
                  {reading.freeReading.currentPhase}
                </p>
              )}
            </div>

            {/* Lucky number and color */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="glass-card p-5 text-center">
                <p
                  className="text-xs mb-2 uppercase tracking-wider"
                  style={{ fontFamily: 'Cinzel, serif', color: 'rgba(201,168,76,0.6)' }}
                >
                  Lucky Number
                </p>
                <p
                  className="text-4xl font-bold"
                  style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}
                >
                  {reading.luckyNumber}
                </p>
              </div>
              <div className="glass-card p-5 text-center">
                <p
                  className="text-xs mb-2 uppercase tracking-wider"
                  style={{ fontFamily: 'Cinzel, serif', color: 'rgba(201,168,76,0.6)' }}
                >
                  Lucky Color
                </p>
                <div
                  className="inline-block px-4 py-1.5 rounded-full text-sm font-bold"
                  style={{
                    background: 'rgba(201,168,76,0.15)',
                    border: '1px solid rgba(201,168,76,0.4)',
                    fontFamily: 'Cinzel, serif',
                    color: '#E2C07A',
                  }}
                >
                  {reading.luckyColor}
                </div>
              </div>
            </div>

            {/* Share — secondary action, outline so the unlock CTA stays primary */}
            <motion.button
              onClick={() => setShareOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                fontFamily: 'Cinzel, serif',
                border: '1px solid rgba(201,168,76,0.4)',
                color: '#C9A84C',
                background: 'rgba(201,168,76,0.05)',
                letterSpacing: '0.05em',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M12 16V4M8 8l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Share My Rashi
            </motion.button>
          </motion.div>

          {/* Share button */}
          <motion.div variants={fadeInUp} className="mt-4 mb-2 flex justify-center">
            <button
              onClick={() => handleShare(reading.rashi)}
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '13px',
                color: copied ? '#4ade80' : '#C9A84C',
                background: copied ? 'rgba(74,222,128,0.08)' : 'rgba(201,168,76,0.08)',
                border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'rgba(201,168,76,0.25)'}`,
                borderRadius: '999px',
                padding: '8px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                transition: 'all 0.3s',
                letterSpacing: '0.04em',
              }}
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Share My Rashi
                </>
              )}
            </button>
          </motion.div>

          <MandalaDivider />

          {/* Locked Section */}
          <motion.div variants={fadeInUp} className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(226,192,122,0.1))',
                  border: '1px solid rgba(201,168,76,0.4)',
                  color: '#C9A84C',
                  fontFamily: 'Cinzel, serif',
                  letterSpacing: '0.1em',
                }}
              >
                FULL READING
              </span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }} />
            </div>

            <LockedSection
              isUnlocked={isUnlocked}
              onUnlock={() => setIsUnlocked(true)}
              preview={
                <ReadingCard
                  title="Career & Professional Life"
                  content={previewText}
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="7" width="20" height="14" rx="2" stroke="#C9A84C" strokeWidth="1.5" />
                      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#C9A84C" strokeWidth="1.5" />
                    </svg>
                  }
                />
              }
            >
              <div className="space-y-4">
                {/* Career */}
                <ReadingCard
                  title="Career & Professional Life"
                  content={reading.fullReading?.career || ''}
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="7" width="20" height="14" rx="2" stroke="#C9A84C" strokeWidth="1.5" />
                      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#C9A84C" strokeWidth="1.5" />
                      <line x1="12" y1="12" x2="12" y2="16" stroke="#C9A84C" strokeWidth="1.5" />
                      <line x1="10" y1="14" x2="14" y2="14" stroke="#C9A84C" strokeWidth="1.5" />
                    </svg>
                  }
                />

                {/* Love */}
                <ReadingCard
                  title="Love & Relationships"
                  content={reading.fullReading?.love || ''}
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="#C9A84C" strokeWidth="1.5" />
                    </svg>
                  }
                />

                {/* Health */}
                <ReadingCard
                  title="Health & Wellness"
                  content={reading.fullReading?.health || ''}
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  }
                />

                {/* Finance */}
                <ReadingCard
                  title="Finance & Wealth"
                  content={reading.fullReading?.finance || ''}
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#C9A84C" strokeWidth="1.5" />
                      <path d="M12 6v2m0 8v2M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3s2.5 1.5 2.5 3a2.5 2.5 0 01-5 0" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  }
                />

                {/* Dasha periods */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#C9A84C" strokeWidth="1.5" />
                      <path d="M12 6v6l4 2" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <h3
                      className="font-bold"
                      style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A', fontSize: '1rem' }}
                    >
                      Dasha Period Timeline
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {(reading.fullReading?.dashas || []).map((dasha, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-3 rounded-lg"
                        style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)' }}
                      >
                        <div className="flex-shrink-0">
                          <span
                            className="text-xs font-bold"
                            style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}
                          >
                            {dasha.planet}
                          </span>
                          <br />
                          <span
                            className="text-xs"
                            style={{ color: 'rgba(201,168,76,0.5)' }}
                          >
                            {dasha.period}
                          </span>
                        </div>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8' }}
                        >
                          {dasha.prediction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remedies */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <polygon points="12,2 22,9 18,21 6,21 2,9" stroke="#C9A84C" strokeWidth="1.5" />
                    </svg>
                    <h3
                      className="font-bold"
                      style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A', fontSize: '1rem' }}
                    >
                      Vedic Remedies
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Gemstone', value: reading.fullReading?.remedies?.gemstone, emoji: '💎' },
                      { label: 'Mantra', value: reading.fullReading?.remedies?.mantra, emoji: '🕉️' },
                      { label: 'Fasting', value: reading.fullReading?.remedies?.fasting, emoji: '✨' },
                      { label: 'Other', value: reading.fullReading?.remedies?.other, emoji: '🌿' },
                    ].map((r) => (
                      <div
                        key={r.label}
                        className="p-3 rounded-lg"
                        style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)' }}
                      >
                        <p
                          className="text-xs mb-1"
                          style={{ fontFamily: 'Cinzel, serif', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.05em' }}
                        >
                          {r.emoji} {r.label}
                        </p>
                        <p
                          className="text-sm"
                          style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8' }}
                        >
                          {r.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mangal Dosha */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span style={{ fontSize: '1.3rem' }}>
                      {reading.fullReading?.mangalDosha?.present ? '🔴' : '🟢'}
                    </span>
                    <h3
                      className="font-bold"
                      style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A', fontSize: '1rem' }}
                    >
                      Mangal Dosha Analysis
                    </h3>
                  </div>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                    style={{
                      background: reading.fullReading?.mangalDosha?.present
                        ? 'rgba(180,50,50,0.2)'
                        : 'rgba(50,180,50,0.15)',
                      border: `1px solid ${reading.fullReading?.mangalDosha?.present ? 'rgba(180,50,50,0.4)' : 'rgba(50,180,50,0.3)'}`,
                      color: reading.fullReading?.mangalDosha?.present ? '#f87171' : '#4ade80',
                      fontFamily: 'Cinzel, serif',
                    }}
                  >
                    {reading.fullReading?.mangalDosha?.present ? 'Dosha Present' : 'No Dosha'}
                  </div>
                  <p
                    className="leading-relaxed"
                    style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1rem' }}
                  >
                    {reading.fullReading?.mangalDosha?.description}
                  </p>
                </div>
              </div>
            </LockedSection>
          </motion.div>

          {/* Talk to a real astrologer — alternative paid path (₹499) */}
          <motion.div variants={fadeInUp} className="mt-8">
            <TalkToAstrologer />
          </motion.div>

          <MandalaDivider />

          {/* Email capture — optional */}
          <motion.div variants={fadeInUp} className="mt-6 mb-2">
            <div className="glass-card p-5" style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
              {subscribeState === 'done' ? (
                <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '15px', color: '#4ade80', textAlign: 'center' }}>
                  ✓ You&apos;re subscribed! Your daily Rashifal is on its way.
                </p>
              ) : (
                <>
                  <p style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', color: '#C9A84C', marginBottom: '4px', letterSpacing: '0.04em' }}>
                    Want your free daily Rashifal?
                  </p>
                  <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '14px', color: 'rgba(245,239,214,0.5)', marginBottom: '12px' }}>
                    Enter your email — completely optional, unsubscribe any time.
                  </p>
                  <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={{
                        flex: 1,
                        minWidth: '180px',
                        background: 'rgba(10,10,15,0.8)',
                        border: '1px solid rgba(201,168,76,0.35)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#F5EFD6',
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '15px',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={subscribeState === 'loading'}
                      style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize: '13px',
                        background: 'rgba(201,168,76,0.15)',
                        border: '1px solid rgba(201,168,76,0.4)',
                        borderRadius: '8px',
                        padding: '10px 18px',
                        color: '#C9A84C',
                        cursor: subscribeState === 'loading' ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {subscribeState === 'loading' ? 'Saving…' : 'Subscribe'}
                    </button>
                  </form>
                  {subscribeState === 'error' && (
                    <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '13px', color: '#f87171', marginTop: '6px' }}>
                      Something went wrong. Please try again.
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Footer actions */}
          <motion.div variants={fadeInUp} className="mt-12 text-center space-y-4">
            <MandalaDivider />
            <Link
              href="/reading"
              className="inline-block px-8 py-3 rounded-xl text-sm border transition-all duration-300"
              style={{
                fontFamily: 'Cinzel, serif',
                borderColor: 'rgba(201,168,76,0.4)',
                color: '#C9A84C',
                background: 'rgba(201,168,76,0.05)',
              }}
            >
              ✦ Get Another Reading
            </Link>
            <p
              className="text-sm"
              style={{ fontFamily: 'EB Garamond, serif', color: 'rgba(245,239,214,0.3)' }}
            >
              Reading generated on {new Date(reading.generatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </motion.div>
        </motion.div>
      </div>

      <ShareCard
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        name={name}
        rashi={reading.rashi}
        rashiSymbol={rashiSymbol}
        tagline={tagline}
      />
    </div>
  )
}

export default function ResultPage() {
  return (
    <main className="relative min-h-screen" style={{ zIndex: 0 }}>
      <StarBackground />

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(10,10,15,0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}
      >
        <Link href="/" style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', fontSize: '1.2rem', fontWeight: 700 }}>
          ॐ JyotishAI
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/rashifal"
            style={{ fontFamily: 'Cinzel, serif', color: '#D4C9A8', fontSize: '0.8rem', letterSpacing: '0.1em' }}
          >
            RASHIFAL
          </Link>
        </div>
      </nav>

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <SpinningMandala />
          </div>
        }
      >
        <ResultContent />
      </Suspense>
    </main>
  )
}
