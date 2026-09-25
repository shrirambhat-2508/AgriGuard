import Button from "../components/Button"
import TopBar from "../components/TopBar"

type ErrorType = "sensor-disconnected" | "camera-denied" | "blurry-photo" | "analysis-failed" | "save-failed" | "no-sensor-reading"

interface ErrorScreenProps {
  type: ErrorType
  navigate: (screen: string) => void
  onBack?: () => void
}

const ERROR_CONFIG: Record<ErrorType, {
  icon: string
  title: string
  message: string
  primary: string
  primaryNav: string
  secondary?: string
}> = {
  "sensor-disconnected": {
    icon: "📡",
    title: "Couldn't reach the field sensor",
    message:
      "Make sure the sensor unit is powered on and within range, then try again.",
    primary: "Try Again",
    primaryNav: "sensor-connecting",
    secondary: "Cancel",
  },
  "camera-denied": {
    icon: "📷",
    title: "Camera access needed",
    message:
      "AgriGuard needs access to your camera to take a crop photo. Please allow camera access in your device settings.",
    primary: "Open Settings",
    primaryNav: "crop-photo",
    secondary: "Go Back",
  },
  "blurry-photo": {
    icon: "🔍",
    title: "Photo is not clear enough",
    message:
      "The crop photo is too blurry for analysis. Please take another photo in good lighting, holding the camera steady.",
    primary: "Retake Photo",
    primaryNav: "crop-photo",
  },
  "analysis-failed": {
    icon: "⚠️",
    title: "Analysis could not complete",
    message:
      "The crop analysis did not complete successfully. This sometimes happens with unusual lighting or angles. Try again with a clear, well-lit photo.",
    primary: "Try Again",
    primaryNav: "crop-photo",
    secondary: "Cancel",
  },
  "save-failed": {
    icon: "💾",
    title: "Unable to save the analysis",
    message:
      "The crop record could not be saved. Your device storage may be full. Free up some space and try again.",
    primary: "Try Again",
    primaryNav: "crop-result",
    secondary: "Discard",
  },
  "no-sensor-reading": {
    icon: "📶",
    title: "No sensor reading received",
    message:
      "The field sensor connected but did not return a reading. Make sure all sensors are properly attached and try again.",
    primary: "Try Again",
    primaryNav: "sensor-connecting",
    secondary: "Cancel",
  },
}

export default function ErrorScreen({
  type,
  navigate,
  onBack,
}: ErrorScreenProps) {
  const config = ERROR_CONFIG[type]

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar
        title="Something went wrong"
        onBack={onBack ?? (() => navigate("home"))}
      />
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-8 pb-16 text-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-danger-pale flex items-center justify-center text-4xl">
          {config.icon}
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-bold text-[22px] text-charcoal leading-tight">
            {config.title}
          </h2>
          <p className="text-[15px] text-muted leading-relaxed">
            {config.message}
          </p>
        </div>
        <div className="w-full space-y-3">
          <Button variant="primary" onClick={() => navigate(config.primaryNav)}>
            {config.primary}
          </Button>
          {config.secondary && (
            <Button variant="outline" onClick={() => navigate("home")}>
              {config.secondary}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
