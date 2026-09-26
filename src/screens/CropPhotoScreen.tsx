import { useRef, useState, type ChangeEvent } from "react"
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
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [photoError, setPhotoError] = useState("")

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
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageSelection}
          className="sr-only"
          aria-label="Take a crop photo with the device camera"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelection}
          className="sr-only"
          aria-label="Choose a crop photo from files"
        />

        <div className="relative flex min-h-[240px] flex-1 items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-4">
          {photoData ? (
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

        {photoData ? (
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
          <>
            <Button
              variant="primary"
              onClick={() => cameraInputRef.current?.click()}
              disabled={loading}
            >
              Take with camera
            </Button>
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              Choose from files
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
