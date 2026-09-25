import Button from "../components/Button"
import InsightChart from "../components/InsightChart"
import TopBar from "../components/TopBar"
import { type CropRecord } from "../data/mockData"

interface InsightsScreenProps {
  navigate: (screen: string, id?: string) => void
  records: CropRecord[]
}

type MetricKey = "moisture" | "temp" | "humidity"

const METRIC_CONFIG: Record<MetricKey, {
  label: string
  emoji: string
  unit: string
  color: string
  paleBg: string
  paleText: string
  trendColor: (up: boolean) => string
}> = {
  moisture: {
    label: "Soil Moisture",
    emoji: "💧",
    unit: "%",
    color: "#2563EB",
    paleBg: "var(--color-sensor-blue-pale)",
    paleText: "#1D4ED8",
    trendColor: (up) => (up ? "#16A34A" : "#DC2626"),
  },
  temp: {
    label: "Temperature",
    emoji: "🌡️",
    unit: "°C",
    color: "#D97706",
    paleBg: "var(--color-amber-pale)",
    paleText: "#B45309",
    trendColor: () => "#D97706",
  },
  humidity: {
    label: "Humidity",
    emoji: "💨",
    unit: "%",
    color: "#0891B2",
    paleBg: "#E0F7FA",
    paleText: "#0E7490",
    trendColor: (up) => (up ? "#16A34A" : "#DC2626"),
  },
}

function MetricCard({
  metric,
  data,
  dates,
  latest,
  trend,
  onPress,
}: {
  metric: MetricKey
  data: number[]
  dates: string[]
  latest: number
  trend: string
  onPress: () => void
}) {
  const m = METRIC_CONFIG[metric]
  const isUp = trend.startsWith("↑")

  return (
    <button onClick={onPress} className="w-full card p-5 text-left tile">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p
            className="font-display font-bold text-[16px]"
            style={{ color: "var(--color-charcoal)" }}
          >
            {m.emoji} {m.label}
          </p>
          <p
            className="text-[11px] font-bold uppercase tracking-wide mt-0.5"
            style={{ color: m.trendColor(isUp) }}
          >
            {trend}
          </p>
        </div>
        <div className="text-right">
          <p
            className="font-display font-bold leading-none"
            style={{ fontSize: 30, color: m.color }}
          >
            {latest}
            <span style={{ fontSize: 16, fontWeight: 600 }}>{m.unit}</span>
          </p>
          <p
            className="text-[11px] font-medium mt-1"
            style={{ color: "var(--color-muted)" }}
          >
            Latest
          </p>
        </div>
      </div>

      <InsightChart data={data} color={m.color} unit={m.unit} />

      <div
        className="flex justify-between mt-2"
        style={{ borderTop: "1px solid var(--color-border)", paddingTop: 8 }}
      >
        {dates.map((d, i) => (
          <span
            key={`date-${i}`}
            className="text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-muted)" }}
          >
            {d}
          </span>
        ))}
        {/* Tap hint */}
        <span
          className="text-[11px] font-semibold flex items-center gap-1"
          style={{ color: m.color }}
        >
          Full history →
        </span>
      </div>
    </button>
  )
}

export default function InsightsScreen({
  navigate,
  records,
}: InsightsScreenProps) {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date))

  const moistureData = sorted.map((r) => r.moisture)
  const tempData = sorted.map((r) => r.temp)
  const humidityData = sorted.map((r) => r.humidity)
  const dates = sorted.map((r) => r.displayDate)

  const latest = (arr: number[]) => arr[arr.length - 1] ?? 0
  const trend = (arr: number[]) => {
    const first = arr[0] ?? 0,
      last = latest(arr)
    return last < first
      ? "↓ Decreasing"
      : last > first
        ? "↑ Increasing"
        : "→ Stable"
  }

  const hasAttention = records.some((r) => r.result !== "healthy")
  const overallStatus = hasAttention ? "attention" : "healthy"

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar title="Crop Insights" />

      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-28 space-y-5">
        <p
          className="text-[14px] -mt-2 leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          Tap a metric to view its full history and graphs.
        </p>

        {/* Overall status */}
        <div
          className="rounded-2xl p-5 border tile"
          style={
            overallStatus === "attention"
              ? {
                  background: "var(--color-amber-pale)",
                  borderColor: "#FDE68A",
                }
              : {
                  background: "var(--color-brand-pale)",
                  borderColor: "#B6D4B8",
                }
          }
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">
              {overallStatus === "attention" ? "⚠️" : "✅"}
            </span>
            <span
              className="text-[12px] font-bold uppercase tracking-wider"
              style={{
                color: overallStatus === "attention" ? "#92400E" : "#1E5C22",
              }}
            >
              {overallStatus === "attention"
                ? "Needs Attention"
                : "Looking Good"}
            </span>
          </div>
          <p
            className="text-[15px] font-medium leading-relaxed"
            style={{
              color: overallStatus === "attention" ? "#92400E" : "#1E5C22",
            }}
          >
            Based on your recent crop observations.
          </p>
          <button
            onClick={() => navigate("overall-analysis")}
            className="text-[13px] font-bold mt-3 underline underline-offset-2 block"
            style={{
              color: overallStatus === "attention" ? "#B45309" : "#2C5F2E",
            }}
          >
            View overall analysis →
          </button>
        </div>

        {/* Tappable metric cards */}
        <MetricCard
          metric="moisture"
          data={moistureData}
          dates={dates}
          latest={latest(moistureData)}
          trend={trend(moistureData)}
          onPress={() => navigate("metric-detail", "moisture")}
        />
        <MetricCard
          metric="temp"
          data={tempData}
          dates={dates}
          latest={latest(tempData)}
          trend={trend(tempData)}
          onPress={() => navigate("metric-detail", "temp")}
        />
        <MetricCard
          metric="humidity"
          data={humidityData}
          dates={dates}
          latest={latest(humidityData)}
          trend={trend(humidityData)}
          onPress={() => navigate("metric-detail", "humidity")}
        />

        <Button
          variant="secondary"
          onClick={() => navigate("overall-analysis")}
        >
          View Overall Analysis
        </Button>
      </div>
    </div>
  )
}
