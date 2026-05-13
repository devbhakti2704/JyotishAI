'use client'

import { useEffect, useState } from 'react'

interface Star {
  id: number
  top: string
  left: string
  size: number
  delay: string
  opacity: number
  duration: string
}

interface ShootingStar {
  id: number
  top: string
  left: string
  delay: string
  duration: string
}

export default function StarBackground() {
  const [stars, setStars] = useState<Star[]>([])
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])

  useEffect(() => {
    const generatedStars: Star[] = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.7 + 0.1,
      duration: `${Math.random() * 3 + 2}s`,
    }))

    const generatedShootingStars: ShootingStar[] = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 50}%`,
      left: `${Math.random() * 80 + 10}%`,
      delay: `${i * 7 + Math.random() * 5}s`,
      duration: `${Math.random() * 2 + 3}s`,
    }))

    setStars(generatedStars)
    setShootingStars(generatedShootingStars)
  }, [])

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Static background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 20%, rgba(26, 26, 46, 0.8) 0%, #0A0A0F 70%)',
        }}
      />

      {/* Nebula glow effects */}
      <div
        className="absolute rounded-full"
        style={{
          width: '40vw',
          height: '40vw',
          top: '10%',
          left: '60%',
          background:
            'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '50vw',
          height: '50vw',
          top: '50%',
          left: '-10%',
          background:
            'radial-gradient(circle, rgba(100,60,180,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            backgroundColor:
              star.size > 2.5
                ? 'rgba(226,192,122,0.9)'
                : 'rgba(255,255,255,0.8)',
            animation: `twinkle ${star.duration} ease-in-out infinite`,
            animationDelay: star.delay,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((ss) => (
        <div
          key={ss.id}
          style={{
            position: 'absolute',
            top: ss.top,
            left: ss.left,
            width: '80px',
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), rgba(201,168,76,0.5), transparent)',
            animation: `shootingStar ${ss.duration} linear infinite`,
            animationDelay: ss.delay,
            transform: 'rotate(-45deg)',
          }}
        />
      ))}
    </div>
  )
}
