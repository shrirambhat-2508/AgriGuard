import { useState } from "react"
import Button from "../components/Button"
import TopBar from "../components/TopBar"

interface CropPhotoScreenProps {
  navigate: (screen: string) => void
}

export default function CropPhotoScreen({ navigate }: CropPhotoScreenProps) {
  const [captured, setCaptured] = useState(false)

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar
        title={captured ? "Review photo" : "Take a crop photo"}
        onBack={
          captured
            ? () => setCaptured(false)
            : () => navigate("sensor-connected")
        }
      />

      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden flex flex-col px-5 pb-8 gap-5">
        {/* Camera / Preview area */}
        <div
          className="rounded-3xl overflow-hidden flex-shrink-0"
          style={{ aspectRatio: "4/3" }}
        >
          {captured ? (
            /* Simulated captured photo */
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #4a7c59 0%, #2d5a27 40%, #6b9e5e 70%, #3d7a3a 100%)",
              }}
            >
              <div className="text-center space-y-2">
                <div className="text-6xl">🌿</div>
                <p className="text-white/70 text-xs font-medium">
                  Crop photo captured
                </p>
              </div>
            </div>
          ) : (
            /* Camera viewfinder */
            <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center gap-4">
              {/* Corner guides */}
              <div className="relative w-48 h-36">
                {[
                  "top-0 left-0",
                  "top-0 right-0",
                  "bottom-0 left-0",
                  "bottom-0 right-0",
                ].map((pos, i) => (
                  <div
                    key={i}
                    className={`absolute ${pos} w-8 h-8`}
                    style={{
                      borderColor: "rgba(255,255,255,0.6)",
                      borderStyle: "solid",
                      borderWidth: 0,
                      ...(i === 0
                        ? { borderTopWidth: 2, borderLeftWidth: 2 }
                        : {}),
                      ...(i === 1
                        ? { borderTopWidth: 2, borderRightWidth: 2 }
                        : {}),
                      ...(i === 2
                        ? { borderBottomWidth: 2, borderLeftWidth: 2 }
                        : {}),
                      ...(i === 3
                        ? { borderBottomWidth: 2, borderRightWidth: 2 }
                        : {}),
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/40 text-xs text-center font-medium leading-relaxed">
                    Position the leaf here
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-dot" />
                <p className="text-white/50 text-xs font-medium">
                  Camera ready
                </p>
              </div>
            </div>
          )}
        </div>

        {captured ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCaptured(false)}
              fullWidth
            >
              Retake
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("ai-analysis")}
              fullWidth
            >
              Use Photo
            </Button>
          </div>
        ) : (
          <>
            {/* Instructions */}
            <div className="card p-4 space-y-3">
              <p className="text-[13px] font-semibold text-charcoal">
                For best results:
              </p>
              {[
                ["🍃", "Keep the leaf or crop clearly visible"],
                ["☀️", "Use good natural lighting"],
                ["📷", "Hold steady to avoid blur"],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-start gap-2.5">
                  <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
                  <p className="text-[14px] text-muted leading-snug">{text}</p>
                </div>
              ))}
            </div>

            <Button variant="primary" onClick={() => setCaptured(true)}>
              Take Photo
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
