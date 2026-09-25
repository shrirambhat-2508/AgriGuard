type MetricType = "moisture" | "temp" | "humidity"

interface MetricCardProps {
  type: MetricType
  value: number
  compact?: boolean
}

const CONFIG = {
  moisture: {
    icon: "💧",
    label: "Soil Moisture",
    unit: "%",
    accent: "#2563EB",
    accentPale: "var(--color-sensor-blue-pale)",
    valueCss: { color: "#2563EB" },
  },
  temp: {
    icon: "🌡️",
    label: "Temperature",
    unit: "°C",
    accent: "#D97706",
    accentPale: "var(--color-amber-pale)",
    valueCss: { color: "#D97706" },
  },
  humidity: {
    icon: "💨",
    label: "Humidity",
    unit: "%",
    accent: "#0891B2",
    accentPale: "#E0F7FA",
    valueCss: { color: "#0891B2" },
  },
}

export default function MetricCard({
  type,
  value,
  compact = false,
}: MetricCardProps) {
  const c = CONFIG[type]

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[13px]">{c.icon}</span>
        <span
          className="font-display font-bold text-[14px]"
          style={{ color: "var(--color-charcoal)" }}
        >
          {value}
          {c.unit}
        </span>
      </div>
    )
  }

  return (
    <div
      className="flex-1 rounded-2xl flex flex-col overflow-hidden transition-all duration-150 active:scale-[0.96] cursor-pointer"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 1px 4px rgba(44,95,46,0.08)",
      }}
    >
      {/* Accent bar */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ background: c.accent, opacity: 0.85 }}
      />
      <div className="p-4 flex flex-col gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[17px]"
          style={{ background: c.accentPale }}
        >
          {c.icon}
        </div>
        <div>
          <p
            className="font-display font-extrabold text-[26px] leading-none"
            style={c.valueCss}
          >
            {value}
            <span className="text-[16px] font-semibold">{c.unit}</span>
          </p>
          <p
            className="text-[10px] font-bold uppercase tracking-wider mt-1.5 leading-tight"
            style={{ color: "var(--color-muted)" }}
          >
            {c.label}
          </p>
        </div>
      </div>
    </div>
  )
}
