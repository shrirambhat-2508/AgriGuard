import Button from "../components/Button"
import MetricCard from "../components/MetricCard"
import TopBar from "../components/TopBar"
import { type CropRecord, MOCK_HISTORY } from "../data/mockData"

interface HistoryDetailScreenProps {
  navigate: (screen: string) => void
  recordId?: string
  records: CropRecord[]
}

const STATUS_BADGE: Record<string, string> = {
  healthy: "bg-healthy-pale text-[#15803D]",
  attention: "bg-amber-pale text-[#B45309]",
  warning: "bg-danger-pale text-[#B91C1C]",
}

export default function HistoryDetailScreen({
  navigate,
  recordId,
  records,
}: HistoryDetailScreenProps) {
  const record =
    records.find((r) => r.id === recordId) ?? records[0] ?? MOCK_HISTORY[0]

  if (!record) {
    return (
      <div className="flex-1 min-h-0 flex flex-col">
        <TopBar title="Crop Check" onBack={() => navigate("history")} />
        <div className="flex-1 flex items-center justify-center px-8 text-center">
          <p className="text-muted text-[15px]">Record not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar
        title="Crop Check"
        onBack={() => navigate("history")}
        subtitle={record.displayDate}
      />

      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-28 space-y-5">
        {/* Photo */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                record.result === "healthy"
                  ? "linear-gradient(135deg, #4a7c59 0%, #2d5a27 60%, #6b9e5e 100%)"
                  : "linear-gradient(135deg, #7c4a3a 0%, #5a2d2d 40%, #9e6b5e 100%)",
            }}
          >
            <div className="text-center space-y-1">
              <div className="text-5xl">
                {record.result === "healthy" ? "🌿" : "🍂"}
              </div>
              <p className="text-white/50 text-xs font-medium">Crop photo</p>
            </div>
          </div>
        </div>

        {/* AI Observation */}
        <div className="card p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-1">
                AI Observation
              </p>
              <p className="font-display font-bold text-[21px] text-charcoal leading-tight">
                {record.condition}
              </p>
              <p className="text-sm text-muted mt-1">
                {record.confidence}% model confidence
              </p>
            </div>
            <span
              className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full flex-shrink-0 ${STATUS_BADGE[record.result]}`}
            >
              {record.result === "healthy"
                ? "Healthy"
                : record.result === "attention"
                  ? "Attention"
                  : "Warning"}
            </span>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-3">
              Field Conditions
            </p>
            <div className="flex gap-3">
              <MetricCard type="moisture" value={record.moisture} />
              <MetricCard type="temp" value={record.temp} />
              <MetricCard type="humidity" value={record.humidity} />
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-2">
              Recommendation
            </p>
            <p className="text-[14px] text-charcoal leading-relaxed">
              {record.recommendation}
            </p>
          </div>
        </div>

        <Button variant="outline" onClick={() => navigate("history")}>
          Back to History
        </Button>
      </div>
    </div>
  )
}
