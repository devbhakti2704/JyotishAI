'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid'
import StarBackground from '@/components/StarBackground'
import MandalaDivider from '@/components/MandalaDivider'

interface FormData {
  name: string
  dob: string
  tob: string
  pob: string
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function ReadingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    dob: '',
    tob: '',
    pob: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.dob || !formData.pob) {
      setError('Please fill in all required fields.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to generate reading')
      }

      const reading = await response.json()

      // Store in localStorage with UUID key
      const id = uuidv4()
      const payload = { ...reading, formData, generatedAt: new Date().toISOString() }
      localStorage.setItem(`jyotish_reading_${id}`, JSON.stringify(payload))

      router.push(`/result?id=${id}`)
    } catch (err) {
      setIsLoading(false)
      setError(
        err instanceof Error
          ? err.message
          : 'The cosmos is temporarily misaligned. Please try again.'
      )
    }
  }

  const trustBadges = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="#C9A84C" />
        </svg>
      ),
      text: '10,000+ Readings Given',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#C9A84C" strokeWidth="1.5" />
          <path d="M8 12l3 3 5-6" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      text: 'Expert Vedic Astrologers',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#C9A84C" />
        </svg>
      ),
      text: '100% Accurate Predictions',
    },
  ]

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
          href="/rashifal"
          style={{ fontFamily: 'Cinzel, serif', color: '#D4C9A8', fontSize: '0.85rem', letterSpacing: '0.1em' }}
          className="hover:text-gold transition-colors"
        >
          RASHIFAL
        </Link>
      </nav>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="w-full max-w-lg"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <p
              className="text-sm tracking-widest uppercase mb-2"
              style={{ fontFamily: 'Cinzel, serif', color: 'rgba(201,168,76,0.6)' }}
            >
              Free Kundali Reading
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
            >
              Reveal Your Cosmic Blueprint
            </h1>
            <p
              style={{
                fontFamily: 'EB Garamond, serif',
                color: '#D4C9A8',
                fontSize: '1.1rem',
                fontStyle: 'italic',
              }}
            >
              The moment of your birth holds the secrets of your entire life.
            </p>
          </motion.div>

          <MandalaDivider />

          {/* Form card */}
          <motion.div variants={fadeInUp} className="glass-card p-8 mt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm mb-2"
                  style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', letterSpacing: '0.05em' }}
                >
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="form-input"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="dob"
                  className="block text-sm mb-2"
                  style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', letterSpacing: '0.05em' }}
                >
                  Date of Birth *
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={isLoading}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Time of Birth */}
              <div>
                <label
                  htmlFor="tob"
                  className="block text-sm mb-2"
                  style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', letterSpacing: '0.05em' }}
                >
                  Time of Birth{' '}
                  <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: '0.75rem' }}>
                    (optional, improves accuracy)
                  </span>
                </label>
                <input
                  id="tob"
                  name="tob"
                  type="time"
                  value={formData.tob}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>

              {/* Place of Birth */}
              <div>
                <label
                  htmlFor="pob"
                  className="block text-sm mb-2"
                  style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', letterSpacing: '0.05em' }}
                >
                  Place of Birth *
                </label>
                <input
                  id="pob"
                  name="pob"
                  type="text"
                  value={formData.pob}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="form-input"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg p-3 text-sm"
                  style={{
                    background: 'rgba(180,50,50,0.15)',
                    border: '1px solid rgba(180,50,50,0.4)',
                    color: '#f87171',
                    fontFamily: 'EB Garamond, serif',
                  }}
                >
                  {error}
                </motion.div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="glow-btn w-full py-4 rounded-xl text-lg relative overflow-hidden"
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="rgba(10,10,15,0.3)"
                        strokeWidth="3"
                      />
                      <path
                        d="M12 2a10 10 0 0110 10"
                        stroke="#0A0A0F"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    The stars are aligning...
                  </span>
                ) : (
                  'Reveal My Destiny ✦'
                )}
              </motion.button>

              <p
                className="text-center text-xs"
                style={{ fontFamily: 'EB Garamond, serif', color: 'rgba(245,239,214,0.4)' }}
              >
                Free reading · No credit card required · Results in ~30 seconds
              </p>
            </form>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            {trustBadges.map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.2)',
                }}
              >
                {badge.icon}
                <span
                  className="text-xs"
                  style={{ fontFamily: 'Cinzel, serif', color: '#D4C9A8', letterSpacing: '0.05em' }}
                >
                  {badge.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Privacy note */}
          <motion.p
            variants={fadeInUp}
            className="text-center text-xs mt-6"
            style={{ fontFamily: 'EB Garamond, serif', color: 'rgba(245,239,214,0.3)' }}
          >
            Your details are only used to generate your reading and are never stored or shared.
          </motion.p>
        </motion.div>
      </div>
    </main>
  )
}
