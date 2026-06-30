'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import StarBackground from '@/components/StarBackground'
import MandalaDivider from '@/components/MandalaDivider'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

function StarIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
        stroke="#C9A84C"
        strokeWidth="1.5"
        fill="rgba(201,168,76,0.15)"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke="#C9A84C"
        strokeWidth="1.5"
        fill="rgba(201,168,76,0.15)"
      />
    </svg>
  )
}

function GemIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="12,2 22,9 18,21 6,21 2,9"
        stroke="#C9A84C"
        strokeWidth="1.5"
        fill="rgba(201,168,76,0.15)"
      />
      <polyline points="2,9 12,15 22,9" stroke="#C9A84C" strokeWidth="1" />
      <line x1="12" y1="2" x2="12" y2="15" stroke="#C9A84C" strokeWidth="1" />
    </svg>
  )
}

const features = [
  {
    icon: <StarIcon />,
    title: 'Kundali Reading',
    description:
      'Receive a detailed birth chart analysis rooted in classical Jyotish shastra. Understand your planetary positions, doshas, and life path with precision.',
    link: '/reading',
    linkText: 'Get Your Reading →',
  },
  {
    icon: <MoonIcon />,
    title: 'Daily Rashifal',
    description:
      "Each day the cosmos writes a new message for your rashi. Discover today's guidance for love, career, health, and your overall energy alignment.",
    link: '/rashifal',
    linkText: 'View Rashifal →',
  },
  {
    icon: <GemIcon />,
    title: 'Gemstone Advice',
    description:
      'Planetary remedies through sacred stones. Learn which gemstones amplify your beneficial planets and how to wear them for maximum cosmic benefit.',
    link: '/reading',
    linkText: 'Discover Your Stone →',
  },
]

const steps = [
  {
    number: '01',
    title: 'Enter Birth Details',
    description: 'Share your name, date, time, and place of birth. Every detail matters to the cosmos.',
  },
  {
    number: '02',
    title: 'Stars Align',
    description: 'Our AI, guided by ancient Jyotish principles, calculates your unique planetary blueprint.',
  },
  {
    number: '03',
    title: 'Receive Your Reading',
    description: 'Get a deeply personal Kundali reading with predictions, remedies, and cosmic guidance.',
  },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    initials: 'PS',
    quote:
      'The reading was so accurate it gave me goosebumps. The career prediction for the next 12 months described my exact situation. I felt truly seen by the cosmos.',
    stars: 5,
  },
  {
    name: 'Rajesh Kumar',
    location: 'Delhi',
    initials: 'RK',
    quote:
      'I was skeptical at first, but this changed my perspective completely. The Mangal Dosha analysis explained so much about my relationship patterns. Truly eye-opening.',
    stars: 5,
  },
  {
    name: 'Ananya Iyer',
    location: 'Bangalore',
    initials: 'AI',
    quote:
      "The gemstone recommendation transformed my life. I started wearing the Blue Sapphire as suggested and within 3 months my career took off in ways I'd never imagined.",
    stars: 5,
  },
]

export default function HomePage() {
  // Capture SEO attribution params (?src=&intent=&slug=) once on landing.
  // Only overwrite when a value is actually present, so later internal
  // navigations to "/" don't wipe the original attribution.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const persist = (param: string, key: string) => {
      const value = params.get(param)
      if (value) sessionStorage.setItem(key, value)
    }
    persist('src', 'jyotish_src')
    persist('intent', 'jyotish_intent')
    persist('slug', 'jyotish_slug')
  }, [])

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <StarBackground />

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', fontSize: '1.2rem', fontWeight: 700 }}>
            ॐ JyotishAI
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/reading"
            style={{ fontFamily: 'Cinzel, serif', color: '#D4C9A8', fontSize: '0.85rem', letterSpacing: '0.1em' }}
            className="hover:text-gold transition-colors"
          >
            KUNDALI
          </Link>
          <Link
            href="/rashifal"
            style={{ fontFamily: 'Cinzel, serif', color: '#D4C9A8', fontSize: '0.85rem', letterSpacing: '0.1em' }}
            className="hover:text-gold transition-colors"
          >
            RASHIFAL
          </Link>
          <Link
            href="/reading"
            className="glow-btn px-5 py-2 rounded-lg text-sm"
          >
            Free Reading
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20"
        style={{ zIndex: 1 }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          {/* Sanskrit headline */}
          <motion.h1
            variants={fadeInUp}
            className="gold-text font-cinzel font-bold leading-tight mb-4"
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              lineHeight: 1.1,
            }}
          >
            जानिए अपना भाग्य
          </motion.h1>

          {/* English subtitle */}
          <motion.h2
            variants={fadeInUp}
            className="font-garamond mb-4"
            style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              color: '#E2C07A',
              letterSpacing: '0.05em',
            }}
          >
            Discover Your Cosmic Destiny
          </motion.h2>

          {/* Tagline */}
          <motion.p
            variants={fadeInUp}
            style={{
              fontFamily: 'EB Garamond, serif',
              color: '#D4C9A8',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
              opacity: 0.85,
            }}
          >
            Ancient wisdom meets modern intelligence. Your stars have been waiting to speak.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/reading"
              className="glow-btn px-8 py-4 rounded-xl text-lg w-full sm:w-auto"
            >
              Get Your Free Kundali Reading
            </Link>
            <Link
              href="/rashifal"
              className="px-8 py-4 rounded-xl text-lg border transition-all duration-300 w-full sm:w-auto text-center"
              style={{
                fontFamily: 'Cinzel, serif',
                borderColor: 'rgba(201,168,76,0.4)',
                color: '#C9A84C',
                background: 'rgba(201,168,76,0.05)',
              }}
            >
              Today's Rashifal
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-6 mt-10">
            {['10,000+ Readings', 'Ancient Jyotish Wisdom', 'AI-Powered Accuracy'].map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-1.5 text-sm"
                style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}
              >
                <span style={{ color: '#C9A84C' }}>✦</span> {badge}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7 10l5 5 5-5" stroke="rgba(201,168,76,0.5)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative px-4 py-20" style={{ zIndex: 1 }}>
        <MandalaDivider />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-cinzel text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
            >
              Your Complete Cosmic Guide
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1.1rem' }}
            >
              Everything the ancient seers knew, now in your hands
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="glass-card p-8 text-center group cursor-pointer"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1rem' }}
                >
                  {feature.description}
                </p>
                <Link
                  href={feature.link}
                  className="text-sm font-cinzel transition-colors"
                  style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', letterSpacing: '0.05em' }}
                >
                  {feature.linkText}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-4 py-20" style={{ zIndex: 1 }}>
        <MandalaDivider />

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1.1rem' }}
            >
              Three sacred steps to cosmic clarity
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div key={step.number} variants={fadeInUp} className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 left-2/3 w-2/3 h-px"
                    style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.5), transparent)' }}
                  />
                )}
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{
                    border: '2px solid rgba(201,168,76,0.5)',
                    background: 'rgba(201,168,76,0.1)',
                    fontFamily: 'Cinzel, serif',
                    color: '#C9A84C',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                  }}
                >
                  {step.number}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
                >
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1rem' }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Link href="/reading" className="glow-btn inline-block px-10 py-4 rounded-xl text-lg">
              Begin Your Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative px-4 py-20" style={{ zIndex: 1 }}>
        <MandalaDivider />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
            >
              What the Stars Have Revealed
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1.1rem' }}
            >
              Stories from those who dared to look up
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeInUp} className="glass-card p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#C9A84C">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="text-sm leading-relaxed mb-6 italic"
                  style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1rem' }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #C9A84C, #E2C07A)',
                      color: '#0A0A0F',
                      fontFamily: 'Cinzel, serif',
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
                    >
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(201,168,76,0.6)' }}>
                      {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About / Transparency section */}
      <section className="relative px-4 py-20" style={{ zIndex: 1 }}>
        <MandalaDivider />
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
            >
              About JyotishAI
            </motion.h2>
            <motion.div variants={fadeInUp} className="glass-card p-8 text-left space-y-4">
              <p style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1.05rem', lineHeight: 1.8 }}>
                JyotishAI is an <strong style={{ color: '#E2C07A' }}>AI-powered Vedic astrology tool</strong>, not a human astrologer. Your reading is generated by an AI trained on classical Jyotish (Vedic astrology) principles — including rashi calculations, planetary dashas, dosha analysis, and traditional remedies.
              </p>
              <p style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1.05rem', lineHeight: 1.8 }}>
                We built JyotishAI to make authentic Vedic astrology accessible and affordable. A professional astrologer consultation costs ₹500–₹2,000 or more. We believe everyone deserves access to this ancient guidance — so we charge only ₹49 for a full reading.
              </p>
              <p style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1.05rem', lineHeight: 1.8 }}>
                Readings are for spiritual reflection and personal guidance. They are not a substitute for professional medical, financial, or legal advice.
              </p>
              <div
                className="flex items-start gap-3 pt-2"
                style={{
                  borderTop: '1px solid rgba(201,168,76,0.15)',
                  paddingTop: '16px',
                  marginTop: '8px',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '3px' }}>
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="#C9A84C" strokeWidth="1.5" />
                  <path d="M8 11V7a4 4 0 118 0v4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p style={{ fontFamily: 'EB Garamond, serif', color: 'rgba(245,239,214,0.55)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Your birth details are used only to generate your reading. We don't store or sell your personal information.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative px-4 py-20" style={{ zIndex: 1 }}>
        <MandalaDivider />
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p
              variants={fadeInUp}
              className="text-5xl mb-6"
              style={{ letterSpacing: '0.1em' }}
            >
              ✦
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A' }}
            >
              The Stars Are Ready When You Are
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mb-8"
              style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', fontSize: '1.1rem' }}
            >
              Your Kundali is a cosmic map written at the moment of your birth. Begin reading it today.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/reading" className="glow-btn inline-block px-12 py-5 rounded-xl text-xl">
                Get Your Free Reading Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative px-4 py-12 text-center"
        style={{ zIndex: 1, borderTop: '1px solid rgba(201,168,76,0.15)' }}
      >
        <p
          className="text-3xl mb-3"
          style={{ color: '#C9A84C' }}
        >
          ॐ
        </p>
        <p
          className="text-sm font-cinzel mb-4 tracking-widest"
          style={{ fontFamily: 'Cinzel, serif', color: 'rgba(201,168,76,0.6)' }}
        >
          JYOTISHAI
        </p>
        <p
          className="text-sm mb-6 italic"
          style={{ fontFamily: 'EB Garamond, serif', color: '#D4C9A8', opacity: 0.6 }}
        >
          &ldquo;Yatha Pinde Tatha Brahmande&rdquo; — As is the microcosm, so is the macrocosm.
        </p>
        <div className="flex justify-center gap-6 mb-6">
          {[
            { href: '/reading', label: 'Kundali' },
            { href: '/rashifal', label: 'Rashifal' },
            { href: '/reading', label: 'Gemstones' },
            { href: '/privacy', label: 'Privacy' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm transition-colors hover:text-gold"
              style={{ fontFamily: 'Cinzel, serif', color: 'rgba(201,168,76,0.5)', letterSpacing: '0.08em' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p
          className="text-sm mb-3"
          style={{ color: 'rgba(245,239,214,0.35)', fontFamily: 'EB Garamond, serif', maxWidth: '480px', margin: '0 auto 12px', lineHeight: 1.6 }}
        >
          Your birth details are used only to generate your reading. We don't store or sell your personal information.
        </p>
        <p
          className="text-xs"
          style={{ color: 'rgba(245,239,214,0.25)', fontFamily: 'EB Garamond, serif' }}
        >
          © {new Date().getFullYear()} JyotishAI · AI-powered Vedic astrology · For spiritual guidance purposes.
        </p>
      </footer>
    </main>
  )
}
