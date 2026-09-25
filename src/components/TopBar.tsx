import React from "react"

interface TopBarProps {
  title?: string
  subtitle?: string
  onBack?: () => void
  rightElement?: React.ReactNode
}

export default function TopBar({
  title,
  subtitle,
  onBack,
  rightElement,
}: TopBarProps) {
  return (
    <div
      className="flex items-center px-5 pt-12 pb-4 gap-3 flex-shrink-0"
      style={{ color: "var(--color-charcoal)" }}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="w-10 h-10 -ml-2 flex items-center justify-center rounded-xl transition-all active:scale-90 flex-shrink-0"
          style={{ background: "transparent" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--color-border)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <div className="flex-1">
        {subtitle && (
          <p
            className="text-xs font-medium uppercase tracking-widest mb-0.5"
            style={{ color: "var(--color-muted)" }}
          >
            {subtitle}
          </p>
        )}
        {title && (
          <h1
            className="font-display font-bold text-[22px] leading-tight"
            style={{ color: "var(--color-charcoal)" }}
          >
            {title}
          </h1>
        )}
      </div>
      {rightElement && <div className="flex-shrink-0">{rightElement}</div>}
    </div>
  )
}
