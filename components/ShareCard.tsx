'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ShareCardProps {
  open: boolean
  onClose: () => void
  name: string
  rashi: string
  rashiSymbol: string
  tagline: string
}

const SITE = 'jyotishai.xyz'

export default function ShareCard({ open, onClose, name, rashi, rashiSymbol, tagline }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  // Render the off-screen 1080x1920 card to a PNG blob.
  const generateBlob = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null
    // Make sure web fonts are painted before capture.
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      try { await document.fonts.ready } catch { /* ignore */ }
    }
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(cardRef.current, {
      width: 1080,
      height: 1920,
      scale: 1,
      backgroundColor: '#0A0A0F',
      useCORS: true,
      logging: false,
    })
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png', 1))
  }

  const triggerDownload = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jyotishai-${rashi.toLowerCase().replace(/[^a-z]/g, '')}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // Mobile: native share sheet (WhatsApp / Instagram). Desktop: download.
  const handleShare = async () => {
    setBusy(true)
    try {
      const blob = await generateBlob()
      if (!blob) return
      const file = new File([blob], 'jyotishai-rashi.png', { type: 'image/png' })

      const canShareFiles =
        typeof navigator !== 'undefined' &&
        !!navigator.canShare &&
        navigator.canShare({ files: [file] })

      if (canShareFiles) {
        await navigator.share({
          files: [file],
          title: 'My Vedic Rashi',
          text: `My Rashi is ${rashi}. Get your free Vedic Kundali reading at ${SITE}`,
        })
      } else {
        triggerDownload(blob)
      }
    } catch {
      // user cancelled share, or capture failed — no-op
    } finally {
      setBusy(false)
    }
  }

  const handleDownload = async () => {
    setBusy(true)
    try {
      const blob = await generateBlob()
      if (blob) triggerDownload(blob)
    } catch {
      /* ignore */
    } finally {
      setBusy(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${SITE}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="w-full max-w-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 style={{ fontFamily: 'Cinzel, serif', color: '#E2C07A', fontSize: '1.1rem', fontWeight: 700 }}>
                Share My Rashi
              </h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Scaled preview (the real card is the off-screen one below) */}
            <div
              className="mx-auto rounded-2xl overflow-hidden"
              style={{
                width: 270,
                height: 480,
                border: '1px solid rgba(201,168,76,0.4)',
                boxShadow: '0 0 50px rgba(201,168,76,0.15)',
              }}
            >
              <div style={{ width: 1080, height: 1920, transform: 'scale(0.25)', transformOrigin: 'top left' }}>
                <ShareCardArt
                  innerRef={null}
                  name={name}
                  rashi={rashi}
                  rashiSymbol={rashiSymbol}
                  tagline={tagline}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={handleShare}
                disabled={busy}
                className="glow-btn py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                style={{ fontFamily: 'Cinzel, serif', opacity: busy ? 0.7 : 1 }}
              >
                {busy ? (
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(10,10,15,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="#0A0A0F" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <>↗ Share</>
                )}
              </button>
              <button
                onClick={handleDownload}
                disabled={busy}
                className="py-3 rounded-xl text-sm transition-all duration-300"
                style={{
                  fontFamily: 'Cinzel, serif',
                  border: '1px solid rgba(201,168,76,0.45)',
                  color: '#C9A84C',
                  background: 'rgba(201,168,76,0.06)',
                }}
              >
                ⤓ Download
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full mt-3 py-2.5 rounded-xl text-sm transition-all duration-300"
              style={{
                fontFamily: 'EB Garamond, serif',
                color: copied ? '#4ade80' : 'rgba(201,168,76,0.7)',
                border: '1px solid rgba(201,168,76,0.2)',
              }}
            >
              {copied ? '✓ Link copied!' : '🔗 Copy link'}
            </button>

            <p
              className="text-center mt-3 text-xs"
              style={{ fontFamily: 'EB Garamond, serif', color: 'rgba(245,239,214,0.4)' }}
            >
              Instagram-story size · perfect for WhatsApp & Stories
            </p>
          </motion.div>

          {/* Off-screen full-resolution card used for capture */}
          <div style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none' }} aria-hidden>
            <ShareCardArt
              innerRef={cardRef}
              name={name}
              rashi={rashi}
              rashiSymbol={rashiSymbol}
              tagline={tagline}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── The actual 1080x1920 art. Pure inline styles so html2canvas renders it faithfully. ── */
function ShareCardArt({
  innerRef,
  name,
  rashi,
  rashiSymbol,
  tagline,
}: {
  innerRef: React.Ref<HTMLDivElement> | null
  name: string
  rashi: string
  rashiSymbol: string
  tagline: string
}) {
  return (
    <div
      ref={innerRef ?? undefined}
      style={{
        width: 1080,
        height: 1920,
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 50% 28%, #1A1A2E 0%, #0F0F1A 45%, #0A0A0F 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: 'Cinzel, serif',
      }}
    >
      {/* Decorative star field (static dots) */}
      {STAR_DOTS.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            width: s.r,
            height: s.r,
            borderRadius: '50%',
            background: '#F5EFD6',
            opacity: s.o,
          }}
        />
      ))}

      {/* Outer gold frame */}
      <div
        style={{
          position: 'absolute',
          inset: 48,
          border: '2px solid rgba(201,168,76,0.45)',
          borderRadius: 28,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 64,
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 20,
        }}
      />

      {/* Top label */}
      <div
        style={{
          color: 'rgba(201,168,76,0.7)',
          fontSize: 30,
          letterSpacing: 12,
          textTransform: 'uppercase',
          marginBottom: 24,
        }}
      >
        ✦ My Vedic Rashi ✦
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: 'EB Garamond, serif',
          color: '#F5EFD6',
          fontSize: 64,
          fontStyle: 'italic',
          marginBottom: 60,
          padding: '0 80px',
        }}
      >
        {name}
      </div>

      {/* Rashi symbol in a gold ring */}
      <div
        style={{
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '3px solid rgba(201,168,76,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 50,
          background: 'rgba(201,168,76,0.06)',
          boxShadow: '0 0 80px rgba(201,168,76,0.25)',
        }}
      >
        {/* ︎ = text-presentation selector: forces a monochrome glyph
            instead of a color emoji tile (which html2canvas bakes in). */}
        <span style={{ fontSize: 180, color: '#C9A84C', lineHeight: 1, fontFamily: '"Noto Sans Symbols", "Cinzel", serif' }}>
          {rashiSymbol + '︎'}
        </span>
      </div>

      {/* Rashi name — solid gold. (Avoid background-clip:text: html2canvas
          can't clip it and paints the gradient as a solid band over the text.) */}
      <div
        style={{
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: 2,
          marginBottom: 40,
          color: '#E2C07A',
          padding: '0 60px',
        }}
      >
        {rashi}
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: 'EB Garamond, serif',
          fontStyle: 'italic',
          color: '#D4C9A8',
          fontSize: 40,
          lineHeight: 1.5,
          maxWidth: 760,
          padding: '0 60px',
        }}
      >
        &ldquo;{tagline}&rdquo;
      </div>

      {/* Mandala motif */}
      <div style={{ marginTop: 70, marginBottom: 40 }}>
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
          <circle cx="80" cy="80" r="70" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="22" stroke="#C9A84C" strokeWidth="1.5" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * 45 * Math.PI) / 180
            return (
              <ellipse
                key={i}
                cx={80 + Math.cos(a) * 46}
                cy={80 + Math.sin(a) * 46}
                rx="14"
                ry="7"
                stroke="#C9A84C"
                strokeOpacity="0.7"
                strokeWidth="1.2"
                transform={`rotate(${i * 45} ${80 + Math.cos(a) * 46} ${80 + Math.sin(a) * 46})`}
              />
            )
          })}
          <circle cx="80" cy="80" r="6" fill="#C9A84C" />
        </svg>
      </div>

      {/* Footer site */}
      <div
        style={{
          position: 'absolute',
          bottom: 96,
          color: '#C9A84C',
          fontSize: 40,
          letterSpacing: 6,
        }}
      >
        ॐ {SITE}
      </div>
    </div>
  )
}

// Deterministic decorative stars (avoid hydration mismatch — fixed positions)
const STAR_DOTS: { x: number; y: number; r: number; o: number }[] = [
  { x: 120, y: 180, r: 4, o: 0.7 }, { x: 940, y: 150, r: 3, o: 0.5 },
  { x: 220, y: 420, r: 2, o: 0.6 }, { x: 870, y: 520, r: 5, o: 0.8 },
  { x: 90, y: 760, r: 3, o: 0.5 }, { x: 990, y: 820, r: 2, o: 0.6 },
  { x: 160, y: 1080, r: 4, o: 0.7 }, { x: 920, y: 1180, r: 3, o: 0.5 },
  { x: 260, y: 1420, r: 2, o: 0.6 }, { x: 840, y: 1520, r: 4, o: 0.7 },
  { x: 110, y: 1700, r: 3, o: 0.5 }, { x: 960, y: 1740, r: 5, o: 0.8 },
  { x: 540, y: 110, r: 2, o: 0.5 }, { x: 480, y: 1820, r: 3, o: 0.6 },
]
