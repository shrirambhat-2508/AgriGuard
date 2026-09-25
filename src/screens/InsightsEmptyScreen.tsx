import Button from "../components/Button"
import TopBar from "../components/TopBar"

interface Props {
  navigate: (screen: string) => void
}

export default function InsightsEmptyScreen({ navigate }: Props) {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar title="Crop Insights" />
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-8 pb-16 text-center gap-6">
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
        <div className="space-y-2">
          <h2 className="font-display font-bold text-[22px] text-charcoal">
            Your crop story starts here
          </h2>
          <p className="text-[15px] text-muted leading-relaxed">
            Complete your first crop check to start building your crop history
            and seeing trends over time.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate("sensor-connecting")}>
          Check My Crop
        </Button>
      </div>
    </div>
  )
}
