import React from "react"

type NavTab = "home" | "check" | "insights" | "history" | "settings"

interface SidebarProps {
  active: NavTab
  onNavigate: (tab: NavTab) => void
  darkMode: boolean
  onToggleDark: () => void
  activeCrop?: { name: string emoji: string }
}

const ITEMS: { id: NavTab label: string }[] = [
  { id: "home", label: "Home" },
  { id: "insights", label: "Insights" },
  { id: "history", label: "History" },
  { id: "settings", label: "Settings" },
]

function NavIcon({ id, active }: { id: NavTab active: boolean }) {
  const c = active ? "#ffffff" : "rgba(255,255,255,0.45)"
  if (id === "home")
    return (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <path
          d="M3 9.5L11 3L19 9.5V19C19 19.55 18.55 20 18 20H14V15H8V20H4C3.45 20 3 19.55 3 19V9.5Z"
          stroke={c}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={active ? "rgba(255,255,255,0.15)" : "none"}
        />
      </svg>
    )
  if (id === "insights")
    return (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <polyline
          points="3,16 8,10 12,13 19,6"
          stroke={c}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="3"
          y1="19"
          x2="19"
          y2="19"
          stroke={c}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    )
  if (id === "history")
    return (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke={c} strokeWidth="1.6" />
        <path
          d="M11 7V11L13.5 13.5"
          stroke={c}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  if (id === "settings")
    return (
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="2.5" stroke={c} strokeWidth="1.6" />
        <path
          d="M11 3V5M11 17V19M3 11H5M17 11H19M5.05 5.05L6.46 6.46M15.54 15.54L16.95 16.95M5.05 16.95L6.46 15.54M15.54 6.46L16.95 5.05"
          stroke={c}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    )
  return null
}

export default function Sidebar({
  active,
  onNavigate,
  darkMode,
  onToggleDark,
  activeCrop,
}: SidebarProps) {
  const bg = darkMode ? "#0D1A0F" : "#1E4A20"
  const border = darkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.10)"

  return (
    <aside
      className="flex flex-col flex-shrink-0 h-full"
      style={{ width: 240, background: bg, borderRight: `1px solid ${border}` }}
    >
      {/* ── Logo ── */}
      <div className="px-5 pt-8 pb-6 flex items-center gap-3 flex-shrink-0">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <svg width="22" height="22" viewBox="0 0 54 54" fill="none">
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
        <div>
          <p
            className="font-display font-bold text-[15px] leading-tight"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            AgriGuard
          </p>
        </div>
      </div>

      {/* ── Check Crop CTA ── */}
      <div className="px-4 mb-4 flex-shrink-0">
        <button
          onClick={() => onNavigate("check")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-display font-semibold text-[14px] transition-all active:scale-95"
          style={{
            background:
              active === "check"
                ? "rgba(255,255,255,0.22)"
                : "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#ffffff",
            boxShadow:
              active === "check" ? "0 2px 12px rgba(0,0,0,0.25)" : "none",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="1.7" />
            <path
              d="M7.5 11L9.8 13.5L14.5 8.5"
              stroke="white"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Check My Crop
        </button>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scroll-hidden">
        {ITEMS.map(({ id, label }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all active:scale-95"
              style={{
                background: isActive ? "rgba(255,255,255,0.14)" : "transparent",
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
              }}
            >
              <NavIcon id={id} active={isActive} />
              <span className="text-[14px] font-semibold">{label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70 flex-shrink-0" />
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Active crop ── */}
      {activeCrop && (
        <div
          className="mx-4 mb-3 px-3 py-2.5 rounded-xl flex items-center gap-2.5 flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span className="text-lg">{activeCrop.emoji}</span>
          <div className="flex-1 min-w-0">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Active Crop
            </p>
            <p
              className="text-[13px] font-semibold truncate"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {activeCrop.name}
            </p>
          </div>
        </div>
      )}

      {/* ── Dark mode + version ── */}
      <div
        className="px-4 py-4 flex-shrink-0 flex items-center justify-between"
        style={{ borderTop: `1px solid ${border}` }}
      >
        <p
          className="text-[11px] font-medium"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          v1.0 · Offline
        </p>
        <button
          onClick={onToggleDark}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.1)" }}
          aria-label="Toggle dark mode"
        >
          <span className="text-base">{darkMode ? "☀️" : "🌙"}</span>
        </button>
      </div>
    </aside>
  )
}
