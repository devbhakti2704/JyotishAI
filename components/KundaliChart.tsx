interface KundaliChartProps {
  name: string
  rashi: string
  lagna: string
}

export default function KundaliChart({ name, rashi, lagna }: KundaliChartProps) {
  const size = 300
  const mid = size / 2
  const gold = '#C9A84C'
  const goldLight = '#E2C07A'
  const darkBg = '#0F0F1A'

  // North Indian Kundali layout
  // The chart is a square with an inner square rotated 45°, creating 12 houses
  // House positions in North Indian style (top center = Lagna/House 1, going clockwise)
  //
  // Layout visualization:
  //  [12][  1  ][2]
  //  [11]       [3]
  //  [10][  7  ][4]   ← Wait, standard North Indian:
  //
  // Correct North Indian:
  //  ┌────┬──────┬────┐
  //  │ 12 │  1   │  2 │
  //  ├────┤      ├────┤
  //  │ 11 │      │  3 │
  //  ├────┤      ├────┤
  //  │ 10 │  7   │  4 │
  //  └────┴──────┴────┘
  // But actually the classic layout uses triangles:
  //
  // Top row: houses 12, 1, 2 (left to right)
  // Left col: 11, (center), 3 right col
  // Bottom: 10, 7, 4
  // Diagonals create inner diamond with houses 5,6,8,9

  // House centers for number labels (North Indian style)
  // The 12 triangular regions
  const housePositions: { house: number; x: number; y: number; label?: string }[] = [
    // Top triangle (house 1 - Lagna)
    { house: 1, x: mid, y: 60, label: lagna || 'Lagna' },
    // Top-right triangle (house 2)
    { house: 2, x: 235, y: 65 },
    // Right-top (house 3)
    { house: 3, x: 258, y: mid - 40 },
    // Right-bottom (house 4)
    { house: 4, x: 258, y: mid + 40 },
    // Bottom-right (house 5)
    { house: 5, x: 235, y: 235 },
    // Bottom (house 6)
    { house: 6, x: mid, y: 255 },
    // Bottom-left (house 7)
    { house: 7, x: 65, y: 235 },
    // Left-bottom (house 8)
    { house: 8, x: 42, y: mid + 40 },
    // Left-top (house 9)
    { house: 9, x: 42, y: mid - 40 },
    // Top-left (house 10)
    { house: 10, x: 65, y: 65 },
    // Inner top-left (house 11)
    { house: 11, x: mid - 70, y: mid - 20 },
    // Inner top-right (house 12)
    { house: 12, x: mid + 70, y: mid - 20 },
  ]

  return (
    <div className="kundali-container">
      <div className="flex flex-col items-center gap-2">
        <p
          className="text-sm font-cinzel tracking-widest uppercase"
          style={{ color: goldLight, fontFamily: 'Cinzel, serif' }}
        >
          Kundali Chart
        </p>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 0 10px rgba(201,168,76,0.2))' }}
        >
          {/* Outer square */}
          <rect
            x="10"
            y="10"
            width={size - 20}
            height={size - 20}
            fill={darkBg}
            stroke={gold}
            strokeWidth="1.5"
          />

          {/* Inner diamond (square rotated 45°) */}
          <polygon
            points={`${mid},20 ${size - 20},${mid} ${mid},${size - 20} 20,${mid}`}
            fill="none"
            stroke={gold}
            strokeWidth="1.2"
          />

          {/* Diagonal lines from corners to inner diamond corners */}
          {/* Top-left to inner-top */}
          <line x1="10" y1="10" x2={mid} y2={mid - mid + 20} stroke={gold} strokeWidth="0.8" strokeOpacity="0.6" />
          {/* Actually let's draw the full diagonal cross lines */}
          <line x1="10" y1="10" x2={mid} y2="20" stroke={gold} strokeWidth="0.8" strokeOpacity="0.7" />
          <line x1={size - 10} y1="10" x2={mid} y2="20" stroke={gold} strokeWidth="0.8" strokeOpacity="0.7" />

          <line x1={size - 10} y1="10" x2={size - 20} y2={mid} stroke={gold} strokeWidth="0.8" strokeOpacity="0.7" />
          <line x1={size - 10} y1={size - 10} x2={size - 20} y2={mid} stroke={gold} strokeWidth="0.8" strokeOpacity="0.7" />

          <line x1={size - 10} y1={size - 10} x2={mid} y2={size - 20} stroke={gold} strokeWidth="0.8" strokeOpacity="0.7" />
          <line x1="10" y1={size - 10} x2={mid} y2={size - 20} stroke={gold} strokeWidth="0.8" strokeOpacity="0.7" />

          <line x1="10" y1={size - 10} x2="20" y2={mid} stroke={gold} strokeWidth="0.8" strokeOpacity="0.7" />
          <line x1="10" y1="10" x2="20" y2={mid} stroke={gold} strokeWidth="0.8" strokeOpacity="0.7" />

          {/* Center cross lines in inner diamond */}
          <line x1={mid} y1="20" x2={mid} y2={size - 20} stroke={gold} strokeWidth="0.6" strokeOpacity="0.4" />
          <line x1="20" y1={mid} x2={size - 20} y2={mid} stroke={gold} strokeWidth="0.6" strokeOpacity="0.4" />

          {/* Inner diamond dividers */}
          <line x1={mid} y1="20" x2="20" y2={mid} stroke={gold} strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1={mid} y1="20" x2={size - 20} y2={mid} stroke={gold} strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1="20" y1={mid} x2={mid} y2={size - 20} stroke={gold} strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1={size - 20} y1={mid} x2={mid} y2={size - 20} stroke={gold} strokeWidth="0.5" strokeOpacity="0.3" />

          {/* House numbers */}
          {housePositions.map(({ house, x, y, label }) => (
            <g key={house}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={house === 1 ? goldLight : gold}
                fontSize={house === 1 ? '11' : '10'}
                fontFamily="Cinzel, serif"
                fontWeight={house === 1 ? '700' : '400'}
                opacity={house === 1 ? 1 : 0.8}
              >
                {house}
              </text>
              {label && (
                <text
                  x={x}
                  y={y + 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={goldLight}
                  fontSize="8"
                  fontFamily="Cinzel, serif"
                  fontWeight="600"
                  opacity="0.9"
                >
                  {label.length > 8 ? label.substring(0, 8) : label}
                </text>
              )}
            </g>
          ))}

          {/* Rashi name display */}
          <text
            x={mid}
            y={mid + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={goldLight}
            fontSize="9"
            fontFamily="Cinzel, serif"
            fontWeight="600"
            opacity="0.7"
          >
            {rashi.length > 10 ? rashi.substring(0, 10) : rashi}
          </text>

          {/* Corner decorations */}
          {[
            [10, 10],
            [size - 10, 10],
            [10, size - 10],
            [size - 10, size - 10],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="3"
              fill={gold}
              opacity="0.6"
            />
          ))}
        </svg>
        <p
          className="text-xs tracking-wider"
          style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Cinzel, serif' }}
        >
          {name} · North Indian Style
        </p>
      </div>
    </div>
  )
}
