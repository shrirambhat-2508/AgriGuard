import MetricCard from "../components/MetricCard"
import SectionHeader from "../components/SectionHeader"
import Button from "../components/Button"
import { type CropRecord, MOCK_SENSOR, getGreeting } from "../data/mockData"
import { type Crop } from "../data/crops"

interface HomeScreenProps {
  navigate: (screen: string, id?: string) => void
  records: CropRecord[]
  activeCrop?: Crop
  darkMode?: boolean
  onToggleDark?: () => void
}

const STATUS_CARD: Record<string, {
  bg: string
  border: string
  iconBg: string
  icon: string
  textColor: string
  label: string
}> = {
  healthy: {
    bg: "#EBF2EC",
    border: "#B6D4B8",
    iconBg: "#C8DFC9",
    icon: "✅",
    textColor: "#1E5C22",
    label: "Healthy",
  },
  attention: {
    bg: "#FFFBEB",
    border: "#FDE68A",
    iconBg: "#FEF3C7",
    icon: "⚠️",
    textColor: "#92400E",
    label: "Attention",
  },
  warning: {
    bg: "#FEF2F2",
    border: "#FCA5A5",
    iconBg: "#FEE2E2",
    icon: "🚨",
    textColor: "#991B1B",
    label: "Warning",
  },
}

const STATUS_DARK: Record<string, {
  bg: string
  border: string
  iconBg: string
  textColor: string
}> = {
  healthy: {
    bg: "#142A17",
    border: "#2A5030",
    iconBg: "#1C3820",
    textColor: "#6ECA78",
  },
  attention: {
    bg: "#241908",
    border: "#5A3A0C",
    iconBg: "#2E200A",
    textColor: "#F5C050",
  },
  warning: {
    bg: "#250E0E",
    border: "#5A1A1A",
    iconBg: "#2E1212",
    textColor: "#F87171",
  },
}

export default function HomeScreen({
  navigate,
  records,
  activeCrop,
  darkMode,
  onToggleDark,
}: HomeScreenProps) {
  const latest = records[0]
  const greeting = getGreeting()
  const s = latest
    ? (STATUS_CARD[latest.result] ?? STATUS_CARD.attention)
    : null
  const sd = latest
    ? (STATUS_DARK[latest.result] ?? STATUS_DARK.attention)
    : null

  return (
    <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden">
      {/* ── Header band ── */}
      <div
        className="px-5 pt-12 pb-8 relative"
        style={{
          background: darkMode
            ? "linear-gradient(160deg, #1A2E1C 0%, #0E1512 100%)"
            : "linear-gradient(160deg, #2C5F2E 0%, #3E7A40 100%)",
        }}
      >
        {/* Dark mode toggle — hidden on desktop (sidebar has it) */}
        <button
          onClick={onToggleDark}
          className="absolute top-12 right-5 w-9 h-9 rounded-xl items-center justify-center transition-all active:scale-90 flex md:hidden"
          style={{ background: "rgba(255,255,255,0.12)" }}
          aria-label="Toggle dark mode"
        >
          <span className="text-lg">{darkMode ? "☀️" : "🌙"}</span>
        </button>

        {/* Logo + app name — top left, hidden on desktop (sidebar has it) */}
        <div className="flex items-center gap-2.5 mb-5 md:hidden">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <svg width="20" height="20" viewBox="0 0 54 54" fill="none">
              <path
                d="M27 48V27"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M27 27C27 27 14 23 11 9C11 9 24 7 31 16C35.5 22 33 27 27 27Z"
                fill="rgba(255,255,255,0.93)"
              />
              <path
                d="M27 33C27 33 38 28 43 16C43 16 31 13 25 22C22 27 24 33 27 33Z"
                fill="rgba(152,210,158,0.85)"
              />
            </svg>
          </div>
          <span
            className="font-display font-bold text-[18px] text-white"
            style={{ letterSpacing: "-0.2px" }}
          >
            AgriGuard
          </span>
        </div>

        <p
          className="text-[12px] font-semibold uppercase tracking-widest mb-1"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {greeting}
        </p>
        <h1 className="text-white font-display font-bold text-[27px] leading-tight">
          Your crop overview
        </h1>

        {/* Active crop pill */}
        {activeCrop && (
          <button
            onClick={() => navigate("manage-crops")}
            className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span className="text-base">{activeCrop.emoji}</span>
            <span className="text-[13px] font-semibold text-white">
              {activeCrop.name}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{ opacity: 0.6 }}
            >
              <path
                d="M5 10L9 7L5 4"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="px-5 pb-28 space-y-5 -mt-3">
        {/* ── Crop Status Card ── */}
        {latest && s && sd ? (
          <div
            className="rounded-2xl p-5 transition-all duration-150 active:scale-[0.98] cursor-pointer tile-enter"
            style={{
              background: darkMode ? sd.bg : s.bg,
              border: `1.5px solid ${darkMode ? sd.border : s.border}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              animationDelay: "0ms",
            }}
            onClick={() => navigate("history-detail")}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: darkMode ? sd.iconBg : s.iconBg }}
              >
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: darkMode ? sd.iconBg : s.iconBg,
                    color: darkMode ? sd.textColor : s.textColor,
                  }}
                >
                  {s.label}
                </span>
                <p
                  className="font-display font-bold text-[19px] leading-tight mt-1.5"
                  style={{ color: darkMode ? sd.textColor : s.textColor }}
                >
                  {latest.condition}
                </p>
                <p
                  className="text-[12px] mt-1 font-medium"
                  style={{ color: "var(--color-muted)" }}
                >
                  Last checked: {latest.displayDate} · {latest.displayTime}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Primary CTA ── */}
        <div className="tile-enter" style={{ animationDelay: "50ms" }}>
          <Button
            variant="primary"
            onClick={() => navigate("sensor-connecting")}
          >
            Check My Crop
          </Button>
        </div>

        {/* ── Field Conditions ── */}
        <div className="tile-enter" style={{ animationDelay: "100ms" }}>
          <SectionHeader title="Field Conditions" />
          <div className="flex gap-3">
            <MetricCard
              type="moisture"
              value={MOCK_SENSOR.moisture}
              onClick={() => navigate("metric-detail", "moisture")}
            />
            <MetricCard
              type="temp"
              value={MOCK_SENSOR.temp}
              onClick={() => navigate("metric-detail", "temp")}
            />
            <MetricCard
              type="humidity"
              value={MOCK_SENSOR.humidity}
              onClick={() => navigate("metric-detail", "humidity")}
            />
          </div>
        </div>

        {/* ── Latest Observation ── */}
        {latest && (
          <div className="tile-enter" style={{ animationDelay: "150ms" }}>
            <SectionHeader title="Latest Observation" />
            <div
              className="card p-4 transition-all duration-150 active:scale-[0.98] cursor-pointer"
              onClick={() => navigate("history-detail")}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className="font-display font-semibold text-[16px] leading-tight"
                  style={{ color: "var(--color-charcoal)" }}
                >
                  {latest.condition}
                </p>
                <span
                  className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                  style={{
                    background:
                      latest.result === "healthy"
                        ? "var(--color-healthy-pale)"
                        : latest.result === "attention"
                          ? "var(--color-amber-pale)"
                          : "var(--color-danger-pale)",
                    color:
                      latest.result === "healthy"
                        ? "#15803D"
                        : latest.result === "attention"
                          ? "#B45309"
                          : "#B91C1C",
                  }}
                >
                  {latest.result === "healthy"
                    ? "Healthy"
                    : latest.result === "attention"
                      ? "Attention"
                      : "Warning"}
                </span>
              </div>
              <p
                className="text-[12px] font-medium mb-3"
                style={{ color: "var(--color-muted)" }}
              >
                {latest.displayDate} · {latest.displayTime}
              </p>
              <div
                className="flex gap-4 pt-3"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <MetricCard type="moisture" value={latest.moisture} compact />
                <MetricCard type="temp" value={latest.temp} compact />
                <MetricCard type="humidity" value={latest.humidity} compact />
              </div>
            </div>
          </div>
        )}

        {/* ── Insight teaser ── */}
        {records.length >= 2 && (
          <div className="tile-enter" style={{ animationDelay: "200ms" }}>
            <button
              onClick={() => navigate("insights")}
              className="w-full rounded-2xl p-4 text-left transition-all duration-150 active:scale-[0.98]"
              style={{
                background: "var(--color-brand-pale)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5 flex-shrink-0">📊</span>
                <div className="flex-1">
                  <p
                    className="text-[14px] font-medium leading-relaxed"
                    style={{ color: darkMode ? "#6ECA78" : "#2C5F2E" }}
                  >
                    Soil moisture has gradually decreased over your recent
                    checks.
                  </p>
                  <p
                    className="text-[13px] font-bold mt-1.5"
                    style={{ color: "#2C5F2E" }}
                  >
                    View Insights →
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* ── Offline badge ── */}
        <div
          className="flex justify-center tile-enter"
          style={{ animationDelay: "250ms" }}
        >
          <div
            className="flex items-center gap-2 text-[11px] font-medium"
            style={{ color: "var(--color-muted)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-healthy inline-block" />
            Offline ready · All data stored locally
          </div>
        </div>
      </div>
    </div>
  )
}
