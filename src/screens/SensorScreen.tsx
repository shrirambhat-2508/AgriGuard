import { useState, useEffect } from "react"
import Button from "../components/Button"
import MetricCard from "../components/MetricCard"
import ProgressStep from "../components/ProgressStep"
import TopBar from "../components/TopBar"
import { MOCK_SENSOR } from "../data/mockData"

interface SensorScreenProps {
  navigate: (screen: string) => void
  subState?: "connecting" | "connected" | "disconnected"
}

type StepState = "done" | "active" | "pending"

const STEPS = [
  "Sensor connected",
  "Soil moisture received",
  "Temperature received",
  "Humidity received",
]

export default function SensorScreen({
  navigate,
  subState = "connecting",
}: SensorScreenProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [phase, setPhase] =
    useState<"connecting" | "connected" | "disconnected">(subState)

  useEffect(() => {
    if (phase !== "connecting") return
    const timers: ReturnType<typeof setTimeout>[] = []
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setStepIndex(i + 1), (i + 1) * 700))
    })
    timers.push(
      setTimeout(() => setPhase("connected"), STEPS.length * 700 + 400),
    )
    return () => timers.forEach(clearTimeout)
  }, [phase])

  const getStepState = (i: number): StepState => {
    if (i < stepIndex) return "done"
    if (i === stepIndex) return "active"
    return "pending"
  }

  if (phase === "disconnected") {
    return (
      <div className="flex-1 min-h-0 flex flex-col">
        <TopBar title="Field Conditions" onBack={() => navigate("home")} />
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 text-center pb-16">
          <div className="w-20 h-20 rounded-3xl bg-danger-pale flex items-center justify-center text-4xl">
            🔴
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-bold text-[22px] text-charcoal">
              Sensor disconnected
            </h2>
            <p className="text-[15px] text-muted leading-relaxed">
              Make sure your field sensor is powered on and nearby, then try
              again.
            </p>
          </div>
          <div className="w-full space-y-3">
            <Button variant="primary" onClick={() => setPhase("connecting")}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate("home")}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === "connected") {
    return (
      <div className="flex-1 min-h-0 flex flex-col">
        <TopBar title="Field Conditions" onBack={() => navigate("home")} />
        <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-8 space-y-6">
          {/* Steps summary */}
          <div className="card p-5 space-y-4">
            {STEPS.map((label, i) => (
              <ProgressStep key={i} label={label} state="done" />
            ))}
          </div>

          {/* Readings */}
          <div>
            <h2 className="font-display font-semibold text-[15px] text-charcoal mb-3">
              Current Readings
            </h2>
            <div className="flex gap-3">
              <MetricCard type="moisture" value={MOCK_SENSOR.moisture} />
              <MetricCard type="temp" value={MOCK_SENSOR.temp} />
              <MetricCard type="humidity" value={MOCK_SENSOR.humidity} />
            </div>
          </div>

          <div className="bg-brand-pale rounded-2xl p-4 border border-[#C4D9C5]">
            <p className="text-[13px] text-[#2C5F2E] font-medium leading-relaxed">
              Field conditions have been recorded. Proceed to take a photo of
              your crop.
            </p>
          </div>

          <Button variant="primary" onClick={() => navigate("crop-photo")}>
            Continue
          </Button>
        </div>
      </div>
    )
  }

  // Connecting state
  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="Checking field conditions"
        onBack={() => navigate("home")}
      />
      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-8 space-y-6">
        <p className="text-[14px] text-muted">
          Connecting to your field sensor…
        </p>

        <div className="card p-5 space-y-4">
          {STEPS.map((label, i) => (
            <ProgressStep key={i} label={label} state={getStepState(i)} />
          ))}
        </div>

        <button
          onClick={() => setPhase("disconnected")}
          className="text-xs text-muted underline underline-offset-2 mx-auto block"
        >
          Having trouble connecting?
        </button>
      </div>
    </div>
  )
}
