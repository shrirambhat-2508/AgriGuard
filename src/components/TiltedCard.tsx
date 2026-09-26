import { useRef, type PointerEvent, type ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"
import "./TiltedCard.css"

const springValues = { damping: 30, stiffness: 100, mass: 2 }

interface TiltedCardProps {
  imageSrc?: string
  altText?: string
  captionText?: string
  containerHeight?: string
  containerWidth?: string
  imageHeight?: string
  imageWidth?: string
  scaleOnHover?: number
  rotateAmplitude?: number
  showMobileWarning?: boolean
  showTooltip?: boolean
  displayOverlayContent?: boolean
  overlayContent?: ReactNode
  children?: ReactNode
  className?: string
}

export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  displayOverlayContent = false,
  overlayContent = null,
  children,
  className = "",
}: TiltedCardProps) {
  const figureRef = useRef<HTMLElement>(null)
  const lastY = useRef(0)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(0, springValues)
  const rotateY = useSpring(0, springValues)
  const scale = useSpring(1, springValues)
  const opacity = useSpring(0)
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  })
  const contentMode = !imageSrc

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return
    const figure = figureRef.current
    if (!figure) return

    const rect = figure.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - rect.width / 2
    const offsetY = event.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude)
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude)
    x.set(event.clientX - rect.left)
    y.set(event.clientY - rect.top)
    rotateFigcaption.set(-(offsetY - lastY.current) * 0.6)
    lastY.current = offsetY
  }

  function handlePointerEnter(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return
    scale.set(scaleOnHover)
    opacity.set(1)
  }

  function handlePointerLeave() {
    opacity.set(0)
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
    rotateFigcaption.set(0)
    lastY.current = 0
  }

  return (
    <figure
      ref={figureRef}
      className={`tilted-card-figure${contentMode ? " tilted-card-figure--content" : ""} ${className}`.trim()}
      style={{ height: contentMode ? "auto" : containerHeight, width: containerWidth }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {showMobileWarning && (
        <div className="tilted-card-mobile-alert">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className={`tilted-card-inner${contentMode ? " tilted-card-inner--content" : ""}`}
        style={{
          width: contentMode ? "100%" : imageWidth,
          height: contentMode ? "auto" : imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        {imageSrc ? (
          <motion.img
            src={imageSrc}
            alt={altText}
            className="tilted-card-img"
            style={{ width: imageWidth, height: imageHeight }}
          />
        ) : (
          children
        )}

        {displayOverlayContent && overlayContent && (
          <motion.div className="tilted-card-overlay">{overlayContent}</motion.div>
        )}
      </motion.div>

      {showTooltip && captionText && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{ x, y, opacity, rotate: rotateFigcaption }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  )
}