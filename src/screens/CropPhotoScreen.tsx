import { useEffect, useRef, useState } from "react"
import Button from "../components/Button"
import TopBar from "../components/TopBar"

interface CropPhotoScreenProps {
  navigate: (screen: string) => void
  stream: MediaStream | null
  onRequestCamera: () => void
  onSavePhoto: (photoData: string) => void
}

interface ZoomRange {
  min: number
  max: number
  step?: number
}

interface CameraCapabilities extends MediaTrackCapabilities {
  zoom?: ZoomRange
  torch?: boolean
}

interface CameraSettings extends MediaTrackSettings {
  zoom?: number
}

interface CameraConstraintSet extends MediaTrackConstraintSet {
  zoom?: number
  torch?: boolean
}

interface CameraTrack extends MediaStreamTrack {
  getCapabilities: () => CameraCapabilities
  getSettings: () => CameraSettings
}

export default function CropPhotoScreen({
  navigate,
  stream,
  onRequestCamera,
  onSavePhoto,
}: CropPhotoScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [captureError, setCaptureError] = useState(false)
  const [controlError, setControlError] = useState(false)
  const [nativeZoom, setNativeZoom] = useState<ZoomRange | null>(null)
  const [cameraZoom, setCameraZoom] = useState(1)
  const [torchAvailable, setTorchAvailable] = useState(false)
  const [torchOn, setTorchOn] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!stream || !video) return

    const track = stream.getVideoTracks()[0] as CameraTrack | undefined
    const capabilities = track?.getCapabilities?.()
    const zoom = capabilities?.zoom
    const supportsZoom = Boolean(zoom && zoom.max > zoom.min)

    setNativeZoom(supportsZoom ? zoom! : null)
    setCameraZoom(
      supportsZoom
        ? (track?.getSettings?.().zoom ?? zoom!.min)
        : 1,
    )
    setTorchAvailable(Boolean(capabilities?.torch))
    setTorchOn(false)

    video.srcObject = stream
    void video.play().catch(() => setCaptureError(true))

    return () => {
      video.srcObject = null
    }
  }, [stream])

  const updateZoom = async (requestedZoom: number) => {
    const min = nativeZoom?.min ?? 1
    const max = nativeZoom?.max ?? 3
    const zoom = Math.min(max, Math.max(min, requestedZoom))
    setCameraZoom(zoom)

    if (!nativeZoom || !stream) return
    const track = stream.getVideoTracks()[0] as CameraTrack | undefined
    if (!track) return

    try {
      await track.applyConstraints({
        advanced: [{ zoom } as CameraConstraintSet],
      })
    } catch {
      setNativeZoom(null)
      setControlError(true)
    }
  }

  const toggleTorch = async () => {
    const track = stream?.getVideoTracks()[0] as CameraTrack | undefined
    if (!track) return

    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchOn } as CameraConstraintSet],
      })
      setTorchOn((current) => !current)
      setControlError(false)
    } catch {
      setControlError(true)
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) {
      setCaptureError(true)
      return
    }

    const cropZoom = nativeZoom ? 1 : cameraZoom
    const sourceWidth = video.videoWidth / cropZoom
    const sourceHeight = video.videoHeight / cropZoom
    const sourceX = (video.videoWidth - sourceWidth) / 2
    const sourceY = (video.videoHeight - sourceHeight) / 2
    const scale = Math.min(1, 1280 / Math.max(sourceWidth, sourceHeight))
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(sourceWidth * scale)
    canvas.height = Math.round(sourceHeight * scale)
    const context = canvas.getContext("2d")
    if (!context) {
      setCaptureError(true)
      return
    }

    context.drawImage(
      video,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    )
    setPhotoData(canvas.toDataURL("image/jpeg", 0.84))
    setCaptureError(false)
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar
        title={photoData ? "Review photo" : "Take a crop photo"}
        onBack={() => photoData ? setPhotoData(null) : navigate("sensor-connected")}
      />

      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden flex flex-col px-5 pb-8 gap-5">
        <div
          className="relative flex-1 min-h-[280px] overflow-hidden rounded-3xl bg-[#101712] shadow-lg"
          style={{ flexBasis: 320 }}
        >
          {stream && (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onCanPlay={() => setCameraReady(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity ${photoData ? "opacity-0" : "opacity-100"}`}
              style={{ transform: nativeZoom ? undefined : `scale(${cameraZoom})` }}
              aria-label="Live crop camera preview"
            />
          )}
          {photoData && (
            <img
              src={photoData}
              alt="Captured crop preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {!stream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center text-white">
              <span className="text-5xl" aria-hidden="true">📷</span>
              <p className="font-display text-lg font-semibold">Camera is paused</p>
              <p className="text-sm text-white/65">Allow camera access to frame your crop.</p>
            </div>
          )}
          {stream && !photoData && (
            <>
              <div className="pointer-events-none absolute inset-8 rounded-2xl border border-white/20" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse-dot" />
                LIVE CAMERA
              </div>
              {!cameraReady && (
                <p className="absolute inset-x-4 bottom-5 text-center text-sm text-white/75">
                  Starting camera preview…
                </p>
              )}
            </>
          )}
        </div>

        {stream && !photoData && (
          <div className="card space-y-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold text-charcoal">Zoom</p>
                <p className="text-[11px] text-muted">
                  {nativeZoom ? "Camera lens control" : "Digital crop from live camera"}
                </p>
              </div>
              <span className="font-display text-[16px] font-bold text-brand">
                {cameraZoom.toFixed(1)}×
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void updateZoom(cameraZoom - (nativeZoom?.step ?? 0.1))}
                disabled={cameraZoom <= (nativeZoom?.min ?? 1)}
                aria-label="Zoom out"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border text-lg font-semibold text-charcoal disabled:opacity-40"
              >
                −
              </button>
              <input
                type="range"
                min={nativeZoom?.min ?? 1}
                max={nativeZoom?.max ?? 3}
                step={nativeZoom?.step ?? 0.1}
                value={cameraZoom}
                onChange={(event) => void updateZoom(Number(event.currentTarget.value))}
                aria-label="Camera zoom"
                className="min-w-0 flex-1 accent-[#2C5F2E]"
              />
              <button
                type="button"
                onClick={() => void updateZoom(cameraZoom + (nativeZoom?.step ?? 0.1))}
                disabled={cameraZoom >= (nativeZoom?.max ?? 3)}
                aria-label="Zoom in"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border text-lg font-semibold text-charcoal disabled:opacity-40"
              >
                +
              </button>
              {torchAvailable && (
                <button
                  type="button"
                  onClick={() => void toggleTorch()}
                  aria-label={torchOn ? "Turn flash off" : "Turn flash on"}
                  aria-pressed={torchOn}
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border ${torchOn ? "bg-amber-pale" : "bg-card"}`}
                >
                  <span aria-hidden="true">⚡</span>
                </button>
              )}
            </div>
          </div>
        )}

        {captureError && (
          <p role="alert" className="text-sm font-medium text-danger">
            The camera is not ready yet. Please wait for the preview and try again.
          </p>
        )}
        {controlError && (
          <p role="status" className="text-sm font-medium text-muted">
            This camera could not apply that control. Digital zoom remains available.
          </p>
        )}

        {photoData ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setPhotoData(null)}
              fullWidth
            >
              Retake
            </Button>
            <Button
              variant="primary"
              onClick={() => onSavePhoto(photoData)}
              fullWidth
            >
              Save &amp; Analyze
            </Button>
          </div>
        ) : (
          <>
            <div className="card flex items-start gap-3 p-4">
              <span className="text-xl" aria-hidden="true">🌿</span>
              <div>
                <p className="text-[13px] font-semibold text-charcoal">Frame one clear leaf</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  Use natural light and hold steady while capturing.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={stream ? capturePhoto : onRequestCamera}
              disabled={stream ? !cameraReady : false}
            >
              {stream ? "Capture Photo" : "Enable Camera"}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
