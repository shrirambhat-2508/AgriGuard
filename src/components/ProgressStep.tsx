type StepState = "done" | "active" | "pending"

interface ProgressStepProps {
  label: string
  state: StepState
}

export default function ProgressStep({ label, state }: ProgressStepProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
        {state === "done" && (
          <div className="w-6 h-6 rounded-full bg-brand-pale flex items-center justify-center">
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
              <path
                d="M1.5 5L5 8.5L11.5 1.5"
                stroke="#2C5F2E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        {state === "active" && (
          <div className="w-5 h-5 rounded-full border-2 border-brand border-t-transparent animate-spin-ring" />
        )}
        {state === "pending" && (
          <div className="w-5 h-5 rounded-full border-2 border-border" />
        )}
      </div>
      <span
        className={`text-[15px] font-medium ${
          state === "done"
            ? "text-charcoal"
            : state === "active"
              ? "text-charcoal"
              : "text-muted"
        }`}
      >
        {label}
      </span>
    </div>
  )
}
