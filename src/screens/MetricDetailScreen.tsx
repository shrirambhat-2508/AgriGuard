import { useState, useMemo } from "react"
import TopBar from "../components/TopBar"
import { type CropRecord } from "../data/mockData"

type MetricKey = "moisture" | "temp" | "humidity"
type Range = "week" | "month" | "year"

interface MetricDetailScreenProps {
  navigate: (screen: string) => void
  metric: MetricKey
  records: CropRecord[]
}

const META: Record<MetricKey, {
  label: string
  emoji: string
  unit: string
  color: string
  paleBg: string
  paleText: string
}> = {
  moisture: {
    label: "Soil Moisture",
    emoji: "💧",
    unit: "%",
    color: "#2563EB",
    paleBg: "var(--color-sensor-blue-pale)",
    paleText: "#1D4ED8",
  },
  temp: {
    label: "Temperature",
    emoji: "🌡️",
    unit: "°C",
    color: "#D97706",
    paleBg: "var(--color-amber-pale)",
    paleText: "#B45309",
  },
  humidity: {
    label: "Humidity",
    emoji: "💨",
    unit: "%",
    color: "#0891B2",
    paleBg: "#E0F7FA",
    paleText: "#0E7490",
  },
}

const RANGES: { id: Range label: string }[] = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
]

/* Build richer mock data for week/month/year views */
function buildExtendedRecords(
  real: CropRecord[],
  metric: MetricKey,
): CropRecord[] {
  if (real.length === 0) return []
  const base = real[0][metric] as number
  const today = new Date("2026-09-24")
  const realDates = new Set(real.map((r) => r.date))
  const extra: CropRecord[] = []

  /* Fill synthetic daily readings for the past 365 days, skipping real record dates */
  for (let d = 1; d <= 365; d++) {
    const date = new Date(today)
    date.setDate(today.getDate() - d)
    const ds = date.toISOString().slice(0, 10)
    if (realDates.has(ds)) continue // real record already covers this date
    const noise = Math.sin(d * 0.4) * 4 + Math.cos(d * 0.7) * 3
    const drift = d < 30 ? 0 : d < 90 ? 2 : d < 180 ? -3 : -5
    const val = Math.round(Math.min(99, Math.max(1, base + noise + drift)))
    extra.push({
      ...real[0],
      id: `synth-${d}`,
      date: ds,
      displayDate: `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`,
      displayTime: "6:00 AM",
      month: `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`,
      moisture: metric === "moisture" ? val : real[0].moisture,
      temp: metric === "temp" ? val : real[0].temp,
      humidity: metric === "humidity" ? val : real[0].humidity,
    })
  }
  return [...real, ...extra].sort((a, b) => a.date.localeCompare(b.date))
}

function filterByRange(records: CropRecord[], range: Range): CropRecord[] {
  const today = new Date("2026-09-24")
  const cutoff = new Date(today)
  if (range === "week") cutoff.setDate(today.getDate() - 7)
  if (range === "month") cutoff.setDate(today.getDate() - 30)
  const cutoffStr = cutoff.toISOString().slice(0, 10)
  return records.filter((r) => r.date >= cutoffStr)
}

/* Downsample to at most N points for chart readability */
function downsample(records: CropRecord[], maxPts: number): CropRecord[] {
  if (records.length <= maxPts) return records
  const step = records.length / maxPts
  return Array.from({ length: maxPts }, (_, i) => records[Math.round(i * step)])
}

/* SVG line chart — inline, no deps */
function DetailChart({
  data,
  labels,
  color,
  unit,
}: {
  data: number[]
  labels: string[]
  color: string
  unit: string
}) {
  if (data.length < 2)
    return (
      <div
        className="flex items-center justify-center h-40 text-[13px]"
        style={{ color: "var(--color-muted)" }}
      >
        Not enough data
      </div>
    )

  const W = 340,
    H = 140,
    padL = 36,
    padR = 12,
    padT = 12,
    padB = 28

  const lo = Math.min(...data) - 2
  const hi = Math.max(...data) + 2
  const range = hi - lo || 1

  const pts = data.map((v, i) => {
    const x = padL + (i / (data.length - 1)) * (W - padL - padR)
    const y = padT + (1 - (v - lo) / range) * (H - padT - padB)
    return [x, y] as [number, number]
  })

  const linePath =
    "M " + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")
  const areaPath =
    `M ${pts[0][0]},${H - padB} ` +
    pts.map(([x, y]) => `L ${x.toFixed(1)},${y.toFixed(1)}`).join(" ") +
    ` L ${pts[pts.length - 1][0]},${H - padB} Z`

  /* Y-axis ticks */
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    val: Math.round(lo + t * range),
    y: padT + (1 - t) * (H - padT - padB),
  }))

  /* X-axis labels — show 4 evenly spaced */
  const xLabels =
    labels.length > 4
      ? [
          0,
          Math.floor(labels.length / 3),
          Math.floor((2 * labels.length) / 3),
          labels.length - 1,
        ].map((i) => ({ label: labels[i], x: pts[i]?.[0] ?? 0 }))
      : labels.map((l, i) => ({ label: l, x: pts[i]?.[0] ?? 0 }))

  const gradId = `dgrad-${color.replace("#", "")}`

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map(({ y, val }) => (
        <line
          key={`grid-${val}`}
          x1={padL}
          y1={y}
          x2={W - padR}
          y2={y}
          stroke="var(--color-border)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      ))}

      {/* Y-axis labels */}
      {yTicks.map(({ val, y }) => (
        <text
          key={`ylabel-${val}`}
          x={padL - 4}
          y={y + 3.5}
          textAnchor="end"
          fontSize="9"
          fill="var(--color-muted)"
          fontFamily="system-ui"
          fontWeight="600"
        >
          {val}
          {unit}
        </text>
      ))}

      {/* X-axis labels */}
      {xLabels.map(({ label, x }, i) => (
        <text
          key={`xlabel-${i}-${label}`}
          x={x}
          y={H - 4}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-muted)"
          fontFamily="system-ui"
          fontWeight="500"
        >
          {label}
        </text>
      ))}

      {/* Area */}
      <path d={areaPath} fill={`url(#${gradId})`} />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Latest point highlight */}
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="5"
        fill={color}
        stroke="var(--color-card)"
        strokeWidth="2"
      />
    </svg>
  )
}

export default function MetricDetailScreen({
  navigate,
  metric,
  records,
}: MetricDetailScreenProps) {
  const [range, setRange] = useState<Range>("month")
  const m = META[metric]

  const allRecords = useMemo(
    () => buildExtendedRecords(records, metric),
    [records, metric],
  )
  const filtered = useMemo(
    () => filterByRange(allRecords, range),
    [allRecords, range],
  )
  const chartData = useMemo(
    () =>
      downsample(filtered, range === "week" ? 7 : range === "month" ? 30 : 52),
    [filtered, range],
  )

  const values = filtered.map((r) => r[metric] as number)
  const chartVals = chartData.map((r) => r[metric] as number)
  const chartLabels = chartData.map((r) => r.displayDate)

  const latest = values[values.length - 1] ?? 0
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 0
  const avg = values.length
    ? Math.round(values.reduce((s, v) => s + v, 0) / values.length)
    : 0

  const first = values[0] ?? 0
  const trend =
    latest > first
      ? "↑ Increasing"
      : latest < first
        ? "↓ Decreasing"
        : "→ Stable"
  const trendColor =
    latest > first ? "#16A34A" : latest < first ? "#DC2626" : "#D97706"

  /* Recent records to show in history list (newest first, max 30) */
  const listRecords = [...filtered].reverse().slice(0, 30)

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar
        title={m.label}
        subtitle={m.emoji + " Field Reading History"}
        onBack={() => navigate("insights")}
      />

      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-28 space-y-5">
        {/* ── Hero value card ── */}
        <div
          className="rounded-2xl p-5 tile"
          style={{ background: m.paleBg, border: `1.5px solid ${m.color}28` }}
        >
          <div className="flex items-end justify-between">
            <div>
              <p
                className="text-[12px] font-bold uppercase tracking-wider mb-1"
                style={{ color: m.paleText }}
              >
                Current Reading
              </p>
              <p
                className="font-display font-extrabold leading-none"
                style={{ fontSize: 48, color: m.color }}
              >
                {latest}
                <span style={{ fontSize: 22, fontWeight: 600 }}>{m.unit}</span>
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-[13px] font-bold"
                style={{ color: trendColor }}
              >
                {trend}
              </p>
              <p
                className="text-[11px] mt-0.5"
                style={{ color: "var(--color-muted)" }}
              >
                vs. period start
              </p>
            </div>
          </div>
        </div>

        {/* ── Range selector ── */}
        <div
          className="flex rounded-2xl p-1 gap-1"
          style={{
            background: "var(--color-ground)",
            border: "1px solid var(--color-border)",
          }}
        >
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className="flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all"
              style={{
                background: range === r.id ? m.color : "transparent",
                color: range === r.id ? "#fff" : "var(--color-muted)",
                boxShadow: range === r.id ? `0 2px 8px ${m.color}40` : "none",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* ── Chart ── */}
        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <p
              className="font-display font-semibold text-[15px]"
              style={{ color: "var(--color-charcoal)" }}
            >
              {range === "week"
                ? "Last 7 days"
                : range === "month"
                  ? "Last 30 days"
                  : "This year"}
            </p>
            <span
              className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
              style={{ background: m.paleBg, color: m.paleText }}
            >
              {filtered.length} readings
            </span>
          </div>
          <DetailChart
            data={chartVals}
            labels={chartLabels}
            color={m.color}
            unit={m.unit}
          />
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Min", val: min },
            { label: "Avg", val: avg },
            { label: "Max", val: max },
          ].map(({ label, val }) => (
            <div
              key={label}
              className="card p-4 flex flex-col items-center gap-1 tile"
            >
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--color-muted)" }}
              >
                {label}
              </p>
              <p
                className="font-display font-extrabold text-[24px] leading-none"
                style={{ color: m.color }}
              >
                {val}
                <span className="text-[13px] font-semibold">{m.unit}</span>
              </p>
            </div>
          ))}
        </div>

        {/* ── Reading history list ── */}
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-widest px-1 mb-3"
            style={{ color: "var(--color-muted)" }}
          >
            Reading Log
          </p>
          <div className="space-y-2">
            {listRecords.map((r, i) => {
              const val = r[metric] as number
              const pct = max > min ? (val - min) / (max - min) : 0.5
              const isLatest = i === 0
              return (
                <div
                  key={r.id}
                  className="card flex items-center gap-4 px-4 py-3.5 tile"
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  {/* Date */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-semibold"
                      style={{ color: "var(--color-charcoal)" }}
                    >
                      {r.displayDate}
                      {isLatest && (
                        <span
                          className="ml-2 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                          style={{ background: m.paleBg, color: m.paleText }}
                        >
                          Latest
                        </span>
                      )}
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {r.displayTime}
                    </p>
                  </div>

                  {/* Mini bar */}
                  <div className="w-20 flex flex-col gap-1">
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "var(--color-border)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round(pct * 100)}%`,
                          background: m.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Value */}
                  <p
                    className="font-display font-bold text-[18px] w-14 text-right flex-shrink-0"
                    style={{ color: m.color }}
                  >
                    {val}
                    <span className="text-[12px] font-medium">{m.unit}</span>
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
