import Button from "../components/Button"
import TopBar from "../components/TopBar"

interface Props {
  navigate: (screen: string) => void
}

export default function InsightsInsufficientScreen({ navigate }: Props) {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar title="Crop Insights" />
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-8 pb-16 text-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-[#F3F4F6] flex items-center justify-center text-4xl">
          📊
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-bold text-[22px] text-charcoal">
            Not enough history yet
          </h2>
          <p className="text-[15px] text-muted leading-relaxed">
            Complete a few more crop checks to see meaningful trends over time.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate("sensor-connecting")}>
          Check My Crop
        </Button>
      </div>
    </div>
  )
}
