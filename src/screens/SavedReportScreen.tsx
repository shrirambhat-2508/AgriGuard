import Button from "../components/Button"
import MetricCard from "../components/MetricCard"
import StatusBadge from "../components/StatusBadge"
import TopBar from "../components/TopBar"
import { MOCK_HISTORY } from "../data/mockData"

interface SavedReportScreenProps {
  navigate: (screen: string) => void
}

export default function SavedReportScreen({
  navigate,
}: SavedReportScreenProps) {
  const record = MOCK_HISTORY[0]

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar title="Crop Report" onBack={() => navigate("home")} />

      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-28 space-y-5">
        {/* Saved confirmation */}
        <div className="flex items-center gap-2.5 bg-healthy-pale rounded-xl px-4 py-3 border border-[#BBF7D0]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8L6.5 11.5L13 4.5"
              stroke="#16A34A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-[13px] font-semibold text-[#15803D]">
            Added to crop history
          </p>
        </div>

        {/* Photo */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #4a7c59 0%, #2d5a27 40%, #6b9e5e 70%, #3d7a3a 100%)",
            }}
          >
            <div className="text-center space-y-1">
              <div className="text-5xl">🌿</div>
              <p className="text-white/60 text-xs font-medium">Crop photo</p>
            </div>
          </div>
        </div>

        {/* Date + crop */}
        <div className="card p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-1">
                Date
              </p>
              <p className="font-display font-semibold text-[16px] text-charcoal">
                {record.displayDate} · {record.displayTime}
              </p>
            </div>
            <StatusBadge status="attention" size="sm" />
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-1">
              AI Observation
            </p>
            <p className="font-display font-bold text-[18px] text-charcoal">
              {record.condition}
            </p>
            <p className="text-sm text-muted mt-0.5">
              {record.confidence}% model confidence
            </p>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-3">
              Field Conditions
            </p>
            <div className="flex gap-3">
              <MetricCard type="moisture" value={record.moisture} />
              <MetricCard type="temp" value={record.temp} />
              <MetricCard type="humidity" value={record.humidity} />
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2">
              Recommendation
            </p>
            <p className="text-[14px] text-charcoal leading-relaxed">
              {record.recommendation}
            </p>
          </div>
        </div>

        {/* AI disclaimer */}
        <div className="bg-[#FFFBF0] rounded-xl px-4 py-3 border border-amber/20">
          <p className="text-[12px] text-[#92700B] leading-relaxed">
            AI results are indications only. Always inspect the crop in person
            and seek appropriate agricultural guidance when needed.
          </p>
        </div>

        <div className="space-y-3">
          <Button variant="primary" onClick={() => navigate("home")}>
            Back to Home
          </Button>
          <Button variant="outline" onClick={() => navigate("history")}>
            View Crop History
          </Button>
        </div>
      </div>
    </div>
  )
}
