import { useState, useEffect } from "react"
import Button from "../components/Button"
import MetricCard from "../components/MetricCard"
import ProgressStep from "../components/ProgressStep"
import TopBar from "../components/TopBar"
import { MOCK_SENSOR } from "../data/mockData"

interface SensorScreenProps {
  navigate: (screen: string) => void
  subState?: "connecting" | "connected" | "disconnected"
  onContinue?: () => void
  cameraRequesting?: boolean
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
  onContinue,
  cameraRequesting = false,
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
        <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden flex flex-col gap-5 px-5 pb-8">
          <div className="rounded-3xl bg-[#1E4A20] p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                ✓
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">
                  Field sensor ready
                </p>
                <h2 className="mt-1 font-display text-[22px] font-bold leading-tight">
                  Readings received
                </h2>
                <p className="mt-1 text-[13px] text-white/75">
                  Your field conditions are ready for the crop check.
                </p>
              </div>
            </div>
          </div>

          <div className="card flex-1 p-5">
            <h2 className="mb-4 font-display text-[16px] font-bold text-charcoal">
              Current field readings
            </h2>
            <div className="flex gap-3">
              <MetricCard type="moisture" value={MOCK_SENSOR.moisture} />
              <MetricCard type="temp" value={MOCK_SENSOR.temp} />
              <MetricCard type="humidity" value={MOCK_SENSOR.humidity} />
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-[#C4D9C5] bg-brand-pale p-4">
            <span className="text-xl" aria-hidden="true">📷</span>
            <p className="text-[13px] font-medium leading-relaxed text-[#2C5F2E]">
              Next, allow camera access and photograph a clear leaf or crop.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={onContinue ?? (() => navigate("crop-photo"))}
            disabled={cameraRequesting}
          >
            {cameraRequesting ? "Waiting for camera permission…" : "Continue to camera"}
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
      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden flex flex-col gap-5 px-5 pb-8">
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-3xl bg-[#1E4A20] px-6 py-7 text-center text-white shadow-lg">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <div className="absolute inset-0 rounded-full border-2 border-white/25 border-t-white animate-spin-ring" />
            <span className="text-3xl" aria-hidden="true">📡</span>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">
              Live field connection
            </p>
            <h2 className="mt-1 font-display text-[21px] font-bold">
              Reading your field
            </h2>
            <p className="mt-1 text-[13px] text-white/75">
              Keep your sensor powered on and nearby.
            </p>
          </div>
        </div>

        <div className="card flex-1 space-y-4 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Connection progress
          </p>
          {STEPS.map((label, i) => (
            <ProgressStep key={i} label={label} state={getStepState(i)} />
          ))}
        </div>

        <button
          onClick={() => setPhase("disconnected")}
          className="mx-auto block py-2 text-xs text-muted underline underline-offset-2"
        >
          Having trouble connecting?
        </button>
      </div>
    </div>
  )
}
