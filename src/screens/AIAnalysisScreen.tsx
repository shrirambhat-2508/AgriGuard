import { useState, useEffect } from "react"
import ProgressStep from "../components/ProgressStep"

interface AIAnalysisScreenProps {
  navigate: (screen: string) => void
}

const STEPS = [
  "Field conditions received",
  "Image captured",
  "Analyzing crop",
  "Preparing recommendation",
]

type StepState = "done" | "active" | "pending"

export default function AIAnalysisScreen({ navigate }: AIAnalysisScreenProps) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setStepIndex(i + 1), i * 900 + 400))
    })
    timers.push(
      setTimeout(() => navigate("crop-result"), STEPS.length * 900 + 600),
    )
    return () => timers.forEach(clearTimeout)
  }, [navigate])

  const getState = (i: number): StepState => {
    if (i < stepIndex) return "done"
    if (i === stepIndex) return "active"
    return "pending"
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-8 pb-16 gap-10">
      {/* Icon */}
      <div className="w-20 h-20 rounded-3xl bg-brand-pale flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 36V20"
            stroke="#2C5F2E"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M20 20C20 20 8 16 6 4C6 4 18 2 24 10C28 15 26 20 20 20Z"
            fill="#2C5F2E"
            opacity="0.9"
          />
          <path
            d="M20 26C20 26 29 21 34 11C34 11 24 8 19 16C16 21 18 26 20 26Z"
            fill="#7A9E7E"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <h1 className="font-display font-bold text-[24px] text-charcoal">
          Analyzing your crop
        </h1>
        <p className="text-[14px] text-muted leading-relaxed">
          Checking the crop image and field conditions…
        </p>
      </div>

      {/* Steps */}
      <div className="w-full card p-5 space-y-4">
        {STEPS.map((label, i) => (
          <ProgressStep key={i} label={label} state={getState(i)} />
        ))}
      </div>

      <p className="text-xs text-muted/60 font-medium text-center">
        Running locally on your device · No internet required
      </p>
    </div>
  )
}
