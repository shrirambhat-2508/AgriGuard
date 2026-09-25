type Status = "healthy" | "attention" | "warning" | "connected" | "disconnected" | "loading" | "offline-ready"

interface StatusBadgeProps {
  status: Status
  label?: string
  size?: "sm" | "md"
}

const CONFIG: Record<Status, {
  dot: string
  bg: string
  text: string
  defaultLabel: string
}> = {
  healthy: {
    dot: "bg-healthy",
    bg: "bg-healthy-pale",
    text: "text-[#15803D]",
    defaultLabel: "Healthy",
  },
  attention: {
    dot: "bg-amber",
    bg: "bg-amber-pale",
    text: "text-[#B45309]",
    defaultLabel: "Needs Attention",
  },
  warning: {
    dot: "bg-danger",
    bg: "bg-danger-pale",
    text: "text-[#B91C1C]",
    defaultLabel: "Warning",
  },
  connected: {
    dot: "bg-healthy",
    bg: "bg-healthy-pale",
    text: "text-[#15803D]",
    defaultLabel: "Connected",
  },
  disconnected: {
    dot: "bg-danger",
    bg: "bg-danger-pale",
    text: "text-[#B91C1C]",
    defaultLabel: "Disconnected",
  },
  loading: {
    dot: "bg-muted animate-pulse-dot",
    bg: "bg-[#F3F4F6]",
    text: "text-muted",
    defaultLabel: "Checking…",
  },
  "offline-ready": {
    dot: "bg-healthy",
    bg: "bg-healthy-pale",
    text: "text-[#15803D]",
    defaultLabel: "Offline ready",
  },
}

export default function StatusBadge({
  status,
  label,
  size = "md",
}: StatusBadgeProps) {
  const c = CONFIG[status]
  const padding =
    size === "sm" ? "px-2 py-0.5 text-xs gap-1.5" : "px-3 py-1 text-sm gap-2"
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${padding} ${c.bg} ${c.text}`}
    >
      <span
        className={`rounded-full ${
          size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"
        } flex-shrink-0 ${c.dot}`}
      />
      {label ?? c.defaultLabel}
    </span>
  )
}
