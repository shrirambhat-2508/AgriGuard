import Button from "../components/Button"
import StatusBadge from "../components/StatusBadge"
import TopBar from "../components/TopBar"
import { type CropRecord } from "../data/mockData"

interface OverallAnalysisScreenProps {
  navigate: (screen: string) => void
  records: CropRecord[]
}

export default function OverallAnalysisScreen({
  navigate,
  records,
}: OverallAnalysisScreenProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar title="Overall Analysis" onBack={() => navigate("insights")} />

      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-28 space-y-5">
        {/* Status */}
        <div className="card p-5 border-amber/30">
          <StatusBadge status="attention" />
          <h2 className="font-display font-bold text-[22px] text-charcoal mt-3 leading-tight">
            Your crop needs attention
          </h2>
          <p className="text-[15px] text-charcoal leading-relaxed mt-2">
            Recent observations show decreasing soil moisture and increasing
            humidity. The latest crop image also produced a possible disease
            indication.
          </p>
        </div>

        {/* What changed */}
        <div className="card p-5 space-y-4">
          <p className="text-[13px] font-semibold text-muted uppercase tracking-wider">
            What changed?
          </p>
          <div className="space-y-3">
            {[
              "Soil moisture has gradually decreased over your last four checks.",
              "Humidity has increased over the same period.",
              "The latest crop image produced a possible early blight indication.",
            ].map((point) => (
              <div key={point} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber mt-2 flex-shrink-0" />
                <p className="text-[14px] text-charcoal leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What to monitor */}
        <div className="card p-5 space-y-3">
          <p className="text-[13px] font-semibold text-muted uppercase tracking-wider">
            What to monitor
          </p>
          <p className="text-[15px] text-charcoal leading-relaxed">
            Continue checking soil condition and inspect affected leaves during
            your next crop check.
          </p>
          <div className="pt-3 border-t border-border bg-[#FFFBF0] rounded-xl px-3 py-2.5 -mx-0 mt-2">
            <p className="text-[12px] text-[#92700B] font-medium leading-relaxed">
              This analysis is based on your recorded observations. AI results
              are indications only — not confirmed agricultural diagnoses.
              Always inspect the crop in person and consult appropriate
              agricultural guidance when needed.
            </p>
          </div>
        </div>

        <Button variant="primary" onClick={() => navigate("sensor-connecting")}>
          Check My Crop Now
        </Button>
      </div>
    </div>
  )
}
