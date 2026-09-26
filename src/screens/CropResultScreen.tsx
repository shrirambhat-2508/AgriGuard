import Button from "../components/Button"
import MetricCard from "../components/MetricCard"
import StatusBadge from "../components/StatusBadge"
import SectionHeader from "../components/SectionHeader"
import TopBar from "../components/TopBar"
import { type CropRecord } from "../data/mockData"

interface CropResultScreenProps {
  navigate: (screen: string) => void
  record: CropRecord
  onSaveReport: () => void
}

export default function CropResultScreen({
  navigate,
  record,
  onSaveReport,
}: CropResultScreenProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar
        title="Crop Check"
        onBack={() => navigate("home")}
        subtitle={`${record.displayDate} · ${record.displayTime}`}
      />

      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-28 space-y-5">
        {/* Main result card */}
        <div className="card p-5 border-amber/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-pale flex items-center justify-center text-2xl flex-shrink-0">
              ⚠️
            </div>
            <div className="flex-1 min-w-0">
              <StatusBadge status={record.result} size="sm" />
              <h2 className="font-display font-bold text-[22px] text-charcoal mt-2 leading-tight">
                {record.condition}
              </h2>
              <p className="text-sm text-muted font-medium mt-1">
                {record.confidence}% model confidence
              </p>
            </div>
          </div>
          {record.photoData && (
            <img
              src={record.photoData}
              alt={`${record.cropName ?? "Crop"} photo`}
              className="mt-4 aspect-[4/3] w-full rounded-xl object-cover"
            />
          )}
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
            <MetricCard type="moisture" value={record.moisture} />
            <MetricCard type="temp" value={record.temp} />
            <MetricCard type="humidity" value={record.humidity} />
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
          <Button variant="primary" onClick={onSaveReport}>
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
