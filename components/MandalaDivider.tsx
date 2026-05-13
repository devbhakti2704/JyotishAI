interface MandalaDividerProps {
  className?: string
}

export default function MandalaDivider({ className = '' }: MandalaDividerProps) {
  return (
    <div className={`flex items-center justify-center w-full py-4 ${className}`}>
      <svg
        viewBox="0 0 600 60"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl"
        height="60"
        aria-hidden="true"
      >
        {/* Left decorative line — tapers to center */}
        <line x1="0" y1="30" x2="230" y2="30" stroke="#C9A84C" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="0" y1="30" x2="200" y2="30" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.6" />

        {/* Left diamond accents */}
        <polygon points="195,30 205,24 215,30 205,36" fill="none" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.7" />
        <circle cx="185" cy="30" r="2" fill="#C9A84C" fillOpacity="0.5" />
        <circle cx="170" cy="30" r="1.5" fill="#C9A84C" fillOpacity="0.4" />
        <circle cx="155" cy="30" r="1" fill="#C9A84C" fillOpacity="0.3" />

        {/* Right decorative line */}
        <line x1="370" y1="30" x2="600" y2="30" stroke="#C9A84C" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="400" y1="30" x2="600" y2="30" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.6" />

        {/* Right diamond accents */}
        <polygon points="385,30 395,24 405,30 395,36" fill="none" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.7" />
        <circle cx="415" cy="30" r="2" fill="#C9A84C" fillOpacity="0.5" />
        <circle cx="430" cy="30" r="1.5" fill="#C9A84C" fillOpacity="0.4" />
        <circle cx="445" cy="30" r="1" fill="#C9A84C" fillOpacity="0.3" />

        {/* Central mandala/lotus */}
        <g transform="translate(300, 30)">
          {/* Outer ring */}
          <circle cx="0" cy="0" r="26" fill="none" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.5" />

          {/* 8 petals of lotus */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const x = Math.cos(rad) * 16
            const y = Math.sin(rad) * 16
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="7"
                ry="4"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="0.8"
                strokeOpacity="0.8"
                transform={`rotate(${angle} ${x} ${y})`}
              />
            )
          })}

          {/* Inner circle */}
          <circle cx="0" cy="0" r="10" fill="none" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.8" />

          {/* Center dot */}
          <circle cx="0" cy="0" r="3" fill="#C9A84C" fillOpacity="0.9" />

          {/* 4 cardinal spokes */}
          <line x1="-26" y1="0" x2="-10" y2="0" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.5" />
          <line x1="10" y1="0" x2="26" y2="0" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.5" />
          <line x1="0" y1="-26" x2="0" y2="-10" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.5" />
          <line x1="0" y1="10" x2="0" y2="26" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.5" />
        </g>
      </svg>
    </div>
  )
}
