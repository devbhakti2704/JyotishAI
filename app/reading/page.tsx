'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid'
import StarBackground from '@/components/StarBackground'
import MandalaDivider from '@/components/MandalaDivider'

// ── Location data ──────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

const UNION_TERRITORIES = [
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
  'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus',
  'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini',
  'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia',
  'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland',
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica',
  'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
  'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
  'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia',
  'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
  'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau',
  'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
  'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
  'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan',
  'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo',
  'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
]

function getCanonicalCountry(input: string): string | null {
  const normalized = input.trim().toLowerCase()
  if (!normalized) return null
  return COUNTRIES.find((c) => c.toLowerCase() === normalized) ?? null
}

// ── Animations ─────────────────────────────────────────────────────────────────

interface FormData {
  name: string
  dob: string
  tob: string
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ── Shared input style ─────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(10,10,15,0.8)',
  border: '1px solid rgba(201,168,76,0.4)',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '#F5EFD6',
  fontFamily: 'EB Garamond, serif',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.875rem',
  marginBottom: '0.5rem',
  fontFamily: 'Cinzel, serif',
  color: '#C9A84C',
  letterSpacing: '0.05em',
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ReadingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({ name: '', dob: '', tob: '' })
  const [pobSelection, setPobSelection] = useState('')         // dropdown value
  const [pobCountryInput, setPobCountryInput] = useState('')   // text when "other"
  const [countryError, setCountryError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isOther = pobSelection === 'other'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPobSelection(e.target.value)
    setPobCountryInput('')
    setCountryError('')
    if (error) setError('')
  }

  const handleCountryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPobCountryInput(e.target.value)
    // Clear error only after user starts correcting — don't validate mid-type
    if (countryError) setCountryError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.dob) {
      setError('Please fill in all required fields.')
      return
    }

    if (!pobSelection) {
      setError('Please select a place of birth.')
      return
    }

    // Resolve final pob value
    let finalPob: string
    if (isOther) {
      const canonical = getCanonicalCountry(pobCountryInput)
      if (!canonical) {
        setCountryError('Please enter a valid country name.')
        return
      }
      finalPob = canonical
    } else {
      finalPob = pobSelection
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, pob: finalPob }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to generate reading')
      }

      const reading = await response.json()

      const id = uuidv4()
      const payload = {
        ...reading,
        formData: { ...formData, pob: finalPob },
        generatedAt: new Date().toISOString(),
      }
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
        <motion.div initial="hidden" animate="visible" variants={stagger} className="w-full max-w-lg">

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
            <p style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1.1rem', fontStyle: 'italic' }}>
              The moment of your birth holds the secrets of your entire life.
            </p>
          </motion.div>

          <MandalaDivider />

          {/* Form card */}
          <motion.div variants={fadeInUp} className="glass-card p-8 mt-6">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label htmlFor="name" style={labelStyle}>Full Name *</label>
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
                <label htmlFor="dob" style={labelStyle}>Date of Birth *</label>
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
                <label htmlFor="tob" style={labelStyle}>
                  Time of Birth{' '}
                  <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: '0.75rem' }}>
                    (optional)
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
                <p style={{
                  marginTop: '6px',
                  fontFamily: 'EB Garamond, serif',
                  fontSize: '0.85rem',
                  color: 'rgba(245,239,214,0.4)',
                  fontStyle: 'italic',
                }}>
                  Don&apos;t know your birth time? That&apos;s okay — we&apos;ll still generate your reading.
                </p>
              </div>

              {/* Place of Birth */}
              <div>
                <label htmlFor="pob-select" style={labelStyle}>Place of Birth *</label>

                {/* Step 1 — State / UT dropdown */}
                <div style={{ position: 'relative' }}>
                  <select
                    id="pob-select"
                    value={pobSelection}
                    onChange={handleDropdownChange}
                    disabled={isLoading}
                    style={{
                      ...inputStyle,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      paddingRight: '2.5rem',
                      cursor: 'pointer',
                      color: pobSelection ? '#F5EFD6' : 'rgba(245,239,214,0.4)',
                    }}
                  >
                    <option value="" disabled style={{ background: '#0F0F1A', color: 'rgba(245,239,214,0.4)' }}>
                      Select Place of Birth
                    </option>

                    <option disabled style={{ background: '#0F0F1A', color: 'rgba(201,168,76,0.5)', fontSize: '0.8rem' }}>
                      ── Indian States ──
                    </option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state} style={{ background: '#0F0F1A', color: '#F5EFD6' }}>
                        {state}
                      </option>
                    ))}

                    <option disabled style={{ background: '#0F0F1A', color: 'rgba(201,168,76,0.5)', fontSize: '0.8rem' }}>
                      ── Union Territories ──
                    </option>
                    {UNION_TERRITORIES.map((ut) => (
                      <option key={ut} value={ut} style={{ background: '#0F0F1A', color: '#F5EFD6' }}>
                        {ut}
                      </option>
                    ))}

                    <option disabled style={{ background: '#0F0F1A', color: 'rgba(201,168,76,0.5)', fontSize: '0.8rem' }}>
                      ── Born Outside India ──
                    </option>
                    <option value="other" style={{ background: '#0F0F1A', color: '#F5EFD6' }}>
                      Other (Outside India)
                    </option>
                  </select>

                  {/* Custom dropdown arrow */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#C9A84C',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Step 2 — Country text input (only when "Other" is selected) */}
                {isOther && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ marginTop: '10px' }}
                  >
                    <input
                      type="text"
                      value={pobCountryInput}
                      onChange={handleCountryInputChange}
                      placeholder="Enter your country of birth"
                      disabled={isLoading}
                      style={{
                        ...inputStyle,
                        borderColor: countryError
                          ? 'rgba(248,113,113,0.6)'
                          : 'rgba(201,168,76,0.4)',
                      }}
                      autoFocus
                    />
                    {countryError && (
                      <p
                        style={{
                          marginTop: '6px',
                          fontSize: '0.85rem',
                          color: '#f87171',
                          fontFamily: 'EB Garamond, serif',
                        }}
                      >
                        {countryError}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* General error */}
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

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="glow-btn w-full py-4 rounded-xl text-lg relative overflow-hidden"
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(10,10,15,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0110 10" stroke="#0A0A0F" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Reading your chart…
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
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
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
