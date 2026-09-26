import { useEffect, useRef, useState, type ChangeEvent } from "react"
import Button from "../components/Button"
import TopBar from "../components/TopBar"

interface CropPhotoScreenProps {
  navigate: (screen: string) => void
  onSavePhoto: (photoData: string) => void
}

async function normalizeImage(file: File): Promise<string> {
  let source: CanvasImageSource
  let width: number
  let height: number
  let releaseSource = () => {}

  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file)
    source = bitmap
    width = bitmap.width
    height = bitmap.height
    releaseSource = () => bitmap.close()
  } else {
    const objectUrl = URL.createObjectURL(file)
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error("Image could not be opened"))
      element.src = objectUrl
    }).catch((error: unknown) => {
      URL.revokeObjectURL(objectUrl)
      throw error
    })
    source = image
    width = image.naturalWidth
    height = image.naturalHeight
    releaseSource = () => URL.revokeObjectURL(objectUrl)
  }

  try {
    const scale = Math.min(1, 1280 / Math.max(width, height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(width * scale)
    canvas.height = Math.round(height * scale)
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Image could not be processed")

    context.drawImage(source, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL("image/jpeg", 0.84)
  } finally {
    releaseSource()
  }
}

export default function CropPhotoScreen({
  navigate,
  onSavePhoto,
}: CropPhotoScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [loading, setLoading] = useState(false)
  const [photoError, setPhotoError] = useState("")

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = cameraStream
    return () => cameraStream?.getTracks().forEach((track) => track.stop())
  }, [cameraStream])

  const handleOpenCamera = async () => {
    setPhotoError("")
    if (!navigator.mediaDevices?.getUserMedia) {
      setPhotoError("Camera access is unavailable in this browser. Choose a photo from files instead.")
      return
    }

    try {
      setCameraStream(await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" } },
      }))
    } catch (error) {
      const denied = error instanceof DOMException &&
        (error.name === "NotAllowedError" || error.name === "SecurityError")
      setPhotoError(denied
        ? "Camera permission was denied. Allow camera access in your browser settings, or choose a photo from files."
        : "The camera could not be opened. Check that it is connected and available, or choose a photo from files.")
    }
  }

  const handleCapture = () => {
    const video = videoRef.current
    if (!video?.videoWidth || !video.videoHeight) {
      setPhotoError("The camera is not ready yet. Please wait a moment and try again.")
      return
    }

    const scale = Math.min(1, 1280 / Math.max(video.videoWidth, video.videoHeight))
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    const context = canvas.getContext("2d")
    if (!context) {
      setPhotoError("This photo could not be captured. Please try again.")
      return
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    setPhotoData(canvas.toDataURL("image/jpeg", 0.84))
    setCameraStream(null)
  }

  const handleImageSelection = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ""
    if (!file) return

    if (file.type && !file.type.startsWith("image/")) {
      setPhotoError("Choose an image file to continue.")
      return
    }

    setLoading(true)
    setPhotoError("")
    try {
      setPhotoData(await normalizeImage(file))
    } catch {
      setPhotoError("This image could not be opened. Try another photo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar
        title={photoData ? "Review photo" : "Take a crop photo"}
        onBack={() => photoData ? setPhotoData(null) : navigate("sensor-connected")}
      />

      <div className="camera-flow-scroll scroll-hidden flex flex-col px-5 gap-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelection}
          className="sr-only"
          aria-label="Choose a crop photo from files"
        />

        <div className="relative flex min-h-[240px] flex-1 items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-4">
          {cameraStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              aria-label="Live camera preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : photoData ? (
            <img
              src={photoData}
              alt="Selected crop photo"
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-pale text-3xl">
                📷
              </div>
              <p className="font-display text-lg font-semibold text-charcoal">
                {loading ? "Preparing photo…" : "No photo selected"}
              </p>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                Take a new crop photo or choose an existing image from your files.
              </p>
            </div>
          )}
        </div>

        {photoError && (
          <p role="alert" className="text-sm font-medium text-danger">
            {photoError}
          </p>
        )}

        {cameraStream ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCameraStream(null)}
              fullWidth
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCapture} fullWidth>
              Capture photo
            </Button>
          </div>
        ) : photoData ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setPhotoData(null)}
              fullWidth
            >
              Choose another
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
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleOpenCamera}
              disabled={loading}
              className="group flex min-h-[66px] w-full items-center gap-3 rounded-2xl bg-brand px-4 py-2.5 text-left text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/15">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M4 7.5h3l1.5-2h7l1.5 2h3A1.5 1.5 0 0 1 21.5 9v9A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V9A1.5 1.5 0 0 1 4 7.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <circle cx="12" cy="13" r="3.25" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">Take with camera</span>
                <span className="mt-0.5 block text-xs text-white/75">Open camera to capture your crop</span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-shrink-0 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="group flex min-h-[60px] w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2 text-left text-charcoal shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:bg-brand-pale/40 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-pale text-brand">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M12 15V4m0 0L8 8m4-4 4 4M5 14v4.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">Choose from files</span>
                <span className="mt-0.5 block text-xs text-muted">Select an image already on your device</span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
