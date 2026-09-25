import Button from "../components/Button"
import MetricCard from "../components/MetricCard"
import StatusBadge from "../components/StatusBadge"
import SectionHeader from "../components/SectionHeader"
import TopBar from "../components/TopBar"
import { MOCK_HISTORY, MOCK_SENSOR } from "../data/mockData"

interface CropResultScreenProps {
  navigate: (screen: string) => void
}

export default function CropResultScreen({ navigate }: CropResultScreenProps) {
  const record = MOCK_HISTORY[0]

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar
        title="Crop Check"
        onBack={() => navigate("home")}
        subtitle="24 September 2026"
      />

      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-28 space-y-5">
        {/* Main result card */}
        <div className="card p-5 border-amber/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-pale flex items-center justify-center text-2xl flex-shrink-0">
              ⚠️
            </div>
            <div className="flex-1 min-w-0">
              <StatusBadge status="attention" size="sm" />
              <h2 className="font-display font-bold text-[22px] text-charcoal mt-2 leading-tight">
                {record.condition}
              </h2>
              <p className="text-sm text-muted font-medium mt-1">
                {record.confidence}% model confidence
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border bg-[#FFFBF0] rounded-xl px-3 py-2.5">
            <p className="text-[12px] text-[#92700B] font-medium leading-relaxed">
              This is an AI indication based on the crop image. It is not a
              confirmed agricultural diagnosis. Always inspect the crop in
              person.
            </p>
          </div>
        </div>

        {/* Field Conditions */}
        <div>
          <SectionHeader title="Field Conditions" />
          <div className="flex gap-3">
            <MetricCard type="moisture" value={MOCK_SENSOR.moisture} />
            <MetricCard type="temp" value={MOCK_SENSOR.temp} />
            <MetricCard type="humidity" value={MOCK_SENSOR.humidity} />
          </div>
        </div>

        {/* What this means */}
        <div className="card p-5 space-y-4">
          <div>
            <p className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-2">
              What this means
            </p>
            <p className="text-[15px] text-charcoal leading-relaxed">
              {record.whatItMeans}
            </p>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-2">
              Recommended Next Step
            </p>
            <p className="text-[15px] text-charcoal leading-relaxed">
              {record.recommendation}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-1">
          <Button variant="primary" onClick={() => navigate("saved-report")}>
            Save &amp; View Report
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("sensor-connecting")}
          >
            Check Again
          </Button>
        </div>
      </div>
    </div>
  )
}
