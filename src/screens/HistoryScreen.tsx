import { useState } from "react"
import TopBar from "../components/TopBar"
import MetricCard from "../components/MetricCard"
import {
  type CropRecord,
  groupByMonth,
  type ResultType,
} from "../data/mockData"

interface HistoryScreenProps {
  navigate: (screen: string, id?: string) => void
  records: CropRecord[]
}

type Filter = "all" | ResultType

const FILTERS: { id: Filter label: string }[] = [
  { id: "all", label: "All" },
  { id: "healthy", label: "Healthy" },
  { id: "attention", label: "Attention" },
  { id: "warning", label: "Warning" },
]

const STATUS_STRIPE: Record<string, string> = {
  healthy: "bg-healthy",
  attention: "bg-amber",
  warning: "bg-danger",
}

const STATUS_LABEL: Record<string, { text: string class: string }> = {
  healthy: { text: "Healthy", class: "bg-healthy-pale text-[#15803D]" },
  attention: { text: "Attention", class: "bg-amber-pale text-[#B45309]" },
  warning: { text: "Warning", class: "bg-danger-pale text-[#B91C1C]" },
}

export default function HistoryScreen({
  navigate,
  records,
}: HistoryScreenProps) {
  const [filter, setFilter] = useState<Filter>("all")

  const filtered = records.filter(
    (r) => filter === "all" || r.result === filter,
  )
  const grouped = groupByMonth(filtered)

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar title="Crop History" />

      {/* Filter chips */}
      <div className="px-5 pb-3 flex gap-2 overflow-x-auto scroll-hidden flex-shrink-0">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-shrink-0 h-8 px-4 rounded-full text-[13px] font-semibold border tile ${
              filter === f.id
                ? "bg-brand text-white border-brand shadow-sm"
                : "bg-card text-muted border-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-28 space-y-6">
        {Object.entries(grouped).map(([month, monthRecords]) => (
          <div key={month}>
            <p className="text-[12px] font-bold text-muted uppercase tracking-widest mb-3">
              {month}
            </p>
            <div className="space-y-3">
              {monthRecords.map((record) => {
                const stripe = STATUS_STRIPE[record.result] ?? "bg-muted"
                const lbl = STATUS_LABEL[record.result]
                return (
                  <button
                    key={record.id}
                    onClick={() => navigate("history-detail", record.id)}
                    className="w-full card flex overflow-hidden text-left tile"
                  >
                    {/* Colored left stripe */}
                    <div className={`w-1 flex-shrink-0 ${stripe}`} />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-[12px] text-muted font-semibold">
                            {record.displayDate} · {record.displayTime}
                          </p>
                          <p className="font-display font-bold text-[16px] text-charcoal mt-0.5 leading-tight">
                            {record.condition}
                          </p>
                        </div>
                        {lbl && (
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full flex-shrink-0 ${lbl.class}`}
                          >
                            {lbl.text}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 pt-2.5 border-t border-border">
                        <MetricCard
                          type="moisture"
                          value={record.moisture}
                          compact
                        />
                        <MetricCard type="temp" value={record.temp} compact />
                        <MetricCard
                          type="humidity"
                          value={record.humidity}
                          compact
                        />
                      </div>
                    </div>
                    {/* Chevron */}
                    <div className="flex items-center pr-3">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M6 12L10 8L6 4"
                          stroke="#9CA3AF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center text-3xl">
              📋
            </div>
            <p className="font-display font-bold text-[17px] text-charcoal">
              No records found
            </p>
            <p className="text-[14px] text-muted">
              {records.length === 0
                ? "Your crop history has been cleared."
                : "No records match this filter."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
