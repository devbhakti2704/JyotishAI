'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import StarBackground from '@/components/StarBackground'
import MandalaDivider from '@/components/MandalaDivider'

interface RashiHoroscope {
  horoscope: string
  luckyNumber?: number
  luckyColor?: string
  advice?: string
}

interface Rashi {
  symbol: string
  hindi: string
  english: string
  element: string
  ruler: string
}

const rashis: Rashi[] = [
  { symbol: '♈', hindi: 'मेष', english: 'Aries', element: 'Fire', ruler: 'Mars' },
  { symbol: '♉', hindi: 'वृषभ', english: 'Taurus', element: 'Earth', ruler: 'Venus' },
  { symbol: '♊', hindi: 'मिथुन', english: 'Gemini', element: 'Air', ruler: 'Mercury' },
  { symbol: '♋', hindi: 'कर्क', english: 'Cancer', element: 'Water', ruler: 'Moon' },
  { symbol: '♌', hindi: 'सिंह', english: 'Leo', element: 'Fire', ruler: 'Sun' },
  { symbol: '♍', hindi: 'कन्या', english: 'Virgo', element: 'Earth', ruler: 'Mercury' },
  { symbol: '♎', hindi: 'तुला', english: 'Libra', element: 'Air', ruler: 'Venus' },
  { symbol: '♏', hindi: 'वृश्चिक', english: 'Scorpio', element: 'Water', ruler: 'Mars' },
  { symbol: '♐', hindi: 'धनु', english: 'Sagittarius', element: 'Fire', ruler: 'Jupiter' },
  { symbol: '♑', hindi: 'मकर', english: 'Capricorn', element: 'Earth', ruler: 'Saturn' },
  { symbol: '♒', hindi: 'कुम्भ', english: 'Aquarius', element: 'Air', ruler: 'Saturn' },
  { symbol: '♓', hindi: 'मीन', english: 'Pisces', element: 'Water', ruler: 'Jupiter' },
]

const elementColors: Record<string, string> = {
  Fire: 'rgba(220,80,30,0.15)',
  Earth: 'rgba(100,140,60,0.15)',
  Air: 'rgba(80,140,200,0.15)',
  Water: 'rgba(40,100,180,0.15)',
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
}

export default function RashifalPage() {
  const [selectedRashi, setSelectedRashi] = useState<Rashi | null>(null)
  const [horoscope, setHoroscope] = useState<RashiHoroscope | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date()
  const formattedDate = format(today, 'EEEE, MMMM do, yyyy')
  const apiDate = format(today, 'yyyy-MM-dd')

  const handleRashiClick = async (rashi: Rashi) => {
    setSelectedRashi(rashi)
    setHoroscope(null)
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/rashifal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rashi: rashi.english, date: apiDate }),
      })


      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to fetch horoscope')
      }

      const data = await response.json()
      setHoroscope(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'The stars are temporarily misaligned. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedRashi(null)
    setHoroscope(null)
    setError('')
  }

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
        <Link
          href="/reading"
          className="glow-btn px-4 py-2 rounded-lg text-sm"
        >
          Free Kundali
        </Link>
      </nav>

      <div className="relative z-10 min-h-screen px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center mb-4">
              <h1
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
              >
                आज का राशिफल
              </h1>
              <p
                className="text-xl md:text-2xl italic"
                style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8' }}
              >
                Today's Cosmic Guidance
              </p>
            </motion.div>

            {/* Date display */}
            <motion.div variants={fadeInUp} className="flex justify-center mb-8">
              <div
                className="px-6 py-3 rounded-full"
                style={{
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.25)',
                }}
              >
                <p
                  className="text-sm text-center"
                  style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', letterSpacing: '0.1em' }}
                >
                  ✦ {formattedDate} ✦
                </p>
              </div>
            </motion.div>

            <MandalaDivider />

            {/* Instruction */}
            <motion.p
              variants={fadeInUp}
              className="text-center mb-8"
              style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1.1rem', fontStyle: 'italic' }}
            >
              Select your Rashi to reveal today's cosmic guidance
            </motion.p>

            {/* Rashi grid */}
            <motion.div
              variants={stagger}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {rashis.map((rashi) => (
                <motion.button
                  key={rashi.english}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleRashiClick(rashi)}
                  className="glass-card p-5 text-center cursor-pointer group transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, rgba(15,15,26,0.8), ${elementColors[rashi.element]})`,
                  }}
                >
                  {/* Symbol */}
                  <div
                    className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: '#C9A84C' }}
                  >
                    {rashi.symbol}
                  </div>

                  {/* Hindi name */}
                  <p
                    className="text-lg font-bold mb-1"
                    style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
                  >
                    {rashi.hindi}
                  </p>

                  {/* English name */}
                  <p
                    className="text-sm mb-2"
                    style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8' }}
                  >
                    {rashi.english}
                  </p>

                  {/* Element & ruler */}
                  <div className="flex justify-center gap-2 text-xs flex-wrap">
                    <span style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'EB Garamond, serif' }}>
                      {rashi.element}
                    </span>
                    <span style={{ color: 'rgba(201,168,76,0.3)' }}>·</span>
                    <span style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'EB Garamond, serif' }}>
                      {rashi.ruler}
                    </span>
                  </div>

                  {/* Hover indicator */}
                  <div
                    className="mt-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}
                  >
                    Read →
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeInUp} className="text-center mt-12">
              <MandalaDivider />
              <p
                className="mb-4 italic"
                style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8' }}
              >
                Want a personalized reading beyond your sun sign?
              </p>
              <Link href="/reading" className="glow-btn inline-block px-8 py-4 rounded-xl text-lg">
                Get Your Full Kundali ✦
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedRashi && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card w-full max-w-lg max-h-[85vh] overflow-y-auto"
              style={{
                background: 'rgba(10,10,15,0.97)',
                border: '1px solid rgba(201,168,76,0.4)',
                boxShadow: '0 0 60px rgba(201,168,76,0.15)',
              }}
            >
              {/* Modal header */}
              <div
                className="flex items-center justify-between p-6 border-b"
                style={{ borderColor: 'rgba(201,168,76,0.2)' }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '2rem', color: '#C9A84C' }}>{selectedRashi.symbol}</span>
                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
                    >
                      {selectedRashi.hindi} · {selectedRashi.english}
                    </h2>
                    <p
                      className="text-sm"
                      style={{ fontFamily: 'EB Garamond, serif', color: 'rgba(201,168,76,0.6)' }}
                    >
                      {formattedDate}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{
                    border: '1px solid rgba(201,168,76,0.3)',
                    color: '#C9A84C',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6">
                {isLoading && (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      style={{ animation: 'spin-slow 4s linear infinite' }}
                    >
                      <circle cx="30" cy="30" r="28" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180
                        return (
                          <circle
                            key={i}
                            cx={30 + Math.cos(rad) * 20}
                            cy={30 + Math.sin(rad) * 20}
                            r="3"
                            fill="#C9A84C"
                            opacity={0.3 + (i % 4) * 0.2}
                          />
                        )
                      })}
                      <circle cx="30" cy="30" r="4" fill="#C9A84C" opacity="0.8" />
                    </svg>
                    <p
                      className="italic"
                      style={{ fontFamily: 'EB Garamond, serif', color: '#E2C07A' }}
                    >
                      Reading the cosmic vibrations...
                    </p>
                  </div>
                )}

                {error && (
                  <div
                    className="rounded-lg p-4 text-center"
                    style={{
                      background: 'rgba(180,50,50,0.1)',
                      border: '1px solid rgba(180,50,50,0.3)',
                    }}
                  >
                    <p style={{ fontFamily: 'EB Garamond, serif', color: '#f87171' }}>{error}</p>
                    <button
                      onClick={() => handleRashiClick(selectedRashi)}
                      className="mt-3 text-sm"
                      style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {horoscope && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    {/* Horoscope text */}
                    <div>
                      <p
                        className="leading-relaxed whitespace-pre-line"
                        style={{
                          fontFamily: 'EB Garamond, serif',
                          color: '#D4C9A8',
                          fontSize: '1.05rem',
                          lineHeight: 1.8,
                        }}
                      >
                        {horoscope.horoscope}
                      </p>
                    </div>

                    {/* Lucky tip */}
                    {horoscope.advice && (
                      <div
                        className="p-4 rounded-lg"
                        style={{
                          background: 'rgba(201,168,76,0.08)',
                          border: '1px solid rgba(201,168,76,0.25)',
                        }}
                      >
                        <p
                          className="text-xs mb-1 uppercase tracking-wider"
                          style={{ fontFamily: 'Cinzel, serif', color: 'rgba(201,168,76,0.6)' }}
                        >
                          ✦ Lucky Tip
                        </p>
                        <p style={{ fontFamily: 'EB Garamond, serif', color: '#E2C07A', fontSize: '1rem' }}>
                          {horoscope.advice}
                        </p>
                      </div>
                    )}

                    {/* Lucky number & color — only shown if API returns them */}
                    {(horoscope.luckyNumber || horoscope.luckyColor) && (
                      <div className="grid grid-cols-2 gap-3">
                        {horoscope.luckyNumber && (
                          <div
                            className="p-4 rounded-lg text-center"
                            style={{
                              background: 'rgba(201,168,76,0.08)',
                              border: '1px solid rgba(201,168,76,0.2)',
                            }}
                          >
                            <p
                              className="text-xs mb-1"
                              style={{ fontFamily: 'Cinzel, serif', color: 'rgba(201,168,76,0.6)' }}
                            >
                              Lucky Number
                            </p>
                            <p
                              className="text-3xl font-bold"
                              style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}
                            >
                              {horoscope.luckyNumber}
                            </p>
                          </div>
                        )}
                        {horoscope.luckyColor && (
                          <div
                            className="p-4 rounded-lg text-center"
                            style={{
                              background: 'rgba(201,168,76,0.08)',
                              border: '1px solid rgba(201,168,76,0.2)',
                            }}
                          >
                            <p
                              className="text-xs mb-1"
                              style={{ fontFamily: 'Cinzel, serif', color: 'rgba(201,168,76,0.6)' }}
                            >
                              Lucky Color
                            </p>
                            <p
                              className="text-lg font-bold"
                              style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
                            >
                              {horoscope.luckyColor}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="pt-2">
                      <Link
                        href="/reading"
                        className="glow-btn block w-full py-3 rounded-xl text-center text-sm"
                        onClick={closeModal}
                      >
                        Get Your Full Kundali Reading ✦
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
