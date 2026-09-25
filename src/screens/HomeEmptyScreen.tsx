import Button from "../components/Button"
import { getGreeting } from "../data/mockData"

interface HomeEmptyScreenProps {
  navigate: (screen: string) => void
}

export default function HomeEmptyScreen({ navigate }: HomeEmptyScreenProps) {
  const greeting = getGreeting()

  return (
    <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden">
      <div className="px-5 pt-12 pb-2">
        <p className="text-[13px] font-medium text-muted uppercase tracking-widest mb-1">
          {greeting}
        </p>
        <h1 className="font-display font-bold text-[26px] text-charcoal leading-tight">
          Your crop overview
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center px-8 pt-12 pb-28 text-center gap-8">
        {/* Illustration */}
        <div className="w-24 h-24 rounded-3xl bg-brand-pale flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 42V24"
              stroke="#2C5F2E"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M24 24C24 24 12 20 10 8C10 8 22 6 28 14C32 19 30 24 24 24Z"
              fill="#2C5F2E"
              opacity="0.9"
            />
            <path
              d="M24 30C24 30 33 25 38 15C38 15 28 12 23 20C20 25 22 30 24 30Z"
              fill="#7A9E7E"
              opacity="0.8"
            />
          </svg>
        </div>

        <div className="space-y-3">
          <h2 className="font-display font-bold text-[22px] text-charcoal">
            No crop checks yet
          </h2>
          <p className="text-[15px] text-muted leading-relaxed">
            Your previous analyses will appear here after your first crop check.
          </p>
        </div>

        <div className="w-full space-y-3">
          <Button
            variant="primary"
            onClick={() => navigate("sensor-connecting")}
          >
            Check My Crop
          </Button>
          <p className="text-xs text-muted/70 font-medium">
            Takes about 2 minutes · Works completely offline
          </p>
        </div>
      </div>
    </div>
  )
}
