import React from "react"

type NavTab = "home" | "check" | "insights" | "history" | "settings"

interface BottomNavProps {
  active: NavTab
  onNavigate: (tab: NavTab) => void
  darkMode?: boolean
}

const TABS: { id: NavTab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "insights", label: "Insights" },
  { id: "check", label: "Check" },
  { id: "history", label: "History" },
  { id: "settings", label: "Settings" },
]

function Icon({ id, active }: { id: NavTab; active: boolean }) {
  const c = active ? "#2C5F2E" : "var(--color-muted)"
  if (id === "home")
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M3 9.5L11 3L19 9.5V19C19 19.55 18.55 20 18 20H14V15H8V20H4C3.45 20 3 19.55 3 19V9.5Z"
          stroke={c}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={active ? "rgba(44,95,46,0.14)" : "none"}
        />
      </svg>
    )
  if (id === "insights")
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
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
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
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
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
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

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="flex-shrink-0"
      style={{
        background: "var(--color-card)",
        borderTop: "1px solid var(--color-border)",
        transition: "background 0.25s ease, border-color 0.25s ease",
        position: "relative",
        zIndex: 30,
      }}
    >
      <div className="flex items-stretch">
        {TABS.map(({ id, label }) => {
          const isActive = active === id
          const isCheck = id === "check"
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex-1 flex flex-col items-center justify-center pt-2.5 pb-3 gap-1 transition-transform active:scale-90"
            >
              {isCheck ? (
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(145deg, #2C5F2E 0%, #3E8040 100%)",
                    marginTop: -20,
                    boxShadow: "0 4px 14px rgba(44,95,46,0.40)",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="white"
                      strokeWidth="1.7"
                    />
                    <path
                      d="M8.5 12L10.8 14.5L15.5 9.5"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : (
                <Icon id={id} active={isActive} />
              )}
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{
                  color: isCheck
                    ? "#2C5F2E"
                    : isActive
                      ? "#2C5F2E"
                      : "var(--color-muted)",
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
