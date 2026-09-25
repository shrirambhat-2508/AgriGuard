interface InsightChartProps {
  data: number[]
  color?: string
  unit?: string
  minVal?: number
  maxVal?: number
}

export default function InsightChart({
  data,
  color = "#2563EB",
  unit = "%",
  minVal,
  maxVal,
}: InsightChartProps) {
  if (data.length < 2) return null

  const W = 280
  const H = 64
  const pad = 8

  const lo = minVal ?? Math.min(...data) - 4
  const hi = maxVal ?? Math.max(...data) + 4
  const range = hi - lo || 1

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2)
    const y = H - pad - ((v - lo) / range) * (H - pad * 2)
    return [x, y] as [number, number]
  })

  const polyline = pts.map(([x, y]) => `${x},${y}`).join(" ")

  const areaPath =
    `M ${pts[0][0]},${H} ` +
    pts.map(([x, y]) => `L ${x},${y}`).join(" ") +
    ` L ${pts[pts.length - 1][0]},${H} Z`

  const gradId = `grad-${color.replace("#", "")}`

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ maxHeight: H }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((t) => {
        const y = pad + t * (H - pad * 2)
        return (
          <line
            key={t}
            x1={pad}
            y1={y}
            x2={W - pad}
            y2={y}
            stroke="#E5E0D8"
            strokeWidth="1"
          />
        )
      })}

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradId})`} />

      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={color} />
      ))}

      {/* Value labels at first and last */}
      <text
        x={pts[0][0]}
        y={H}
        textAnchor="middle"
        fontSize="9"
        fill="#9CA3AF"
        fontFamily="system-ui"
      >
        {data[0]}
        {unit}
      </text>
      <text
        x={pts[pts.length - 1][0]}
        y={H}
        textAnchor="middle"
        fontSize="9"
        fill="#9CA3AF"
        fontFamily="system-ui"
      >
        {data[data.length - 1]}
        {unit}
      </text>
    </svg>
  )
}
