import { useState, useMemo } from "react"
import TopBar from "../components/TopBar"
import Button from "../components/Button"
import {
  DEFAULT_CROPS,
  CROP_CATEGORIES,
  CATEGORY_EMOJI_BG,
  searchCrops,
  type Crop,
  type CategoryId,
} from "../data/crops"

interface ManageCropsScreenProps {
  navigate: (screen: string) => void
  activeCropId: string
  myCropIds: string[]
  userCrops: Crop[]
  onSelectCrop: (id: string) => void
  onAddCropToList: (id: string) => void
  onRemoveCropFromList: (id: string) => void
  onAddCustomCrop: (crop: Crop) => void
  returnTo?: string
}

export default function ManageCropsScreen({
  navigate,
  activeCropId,
  myCropIds,
  userCrops,
  onSelectCrop,
  onAddCropToList,
  onRemoveCropFromList,
  onAddCustomCrop,
  returnTo = "home",
}: ManageCropsScreenProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<CategoryId>("all")
  const [showCropCatalog, setShowCropCatalog] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [customName, setCustomName] = useState("")
  const [customEmoji, setCustomEmoji] = useState("🌱")

  const allCrops = useMemo(() => {
    const ids = new Set(DEFAULT_CROPS.map((c) => c.id))
    const extras = userCrops.filter((c) => !ids.has(c.id))
    return [...DEFAULT_CROPS, ...extras]
  }, [userCrops])

  const filtered = useMemo(() => {
    let list = allCrops
    if (category !== "all") list = list.filter((c) => c.category === category)
    list = searchCrops(list, query)
    return list
  }, [allCrops, category, query])

  const activeCrops = myCropIds
    .map((id) => allCrops.find((crop) => crop.id === id))
    .filter((crop): crop is Crop => Boolean(crop))

  function handleSelect(crop: Crop) {
    onSelectCrop(crop.id)
    navigate("home")
  }

  function handleAddCrop(crop: Crop) {
    onAddCropToList(crop.id)
    setShowCropCatalog(false)
    setQuery("")
    setCategory("all")
  }

  function handleAddCustom() {
    const trimmed = customName.trim()
    if (!trimmed) return
    const id = `custom-${Date.now()}`
    onAddCustomCrop({
      id,
      name: trimmed,
      emoji: customEmoji,
      category: "vegetables",
      custom: true,
    })
    onAddCropToList(id)
    setCustomName("")
    setCustomEmoji("🌱")
    setShowAddModal(false)
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar
        title={showCropCatalog ? "Add a Crop" : "Manage Crops"}
        onBack={() =>
          showCropCatalog
            ? setShowCropCatalog(false)
            : navigate(returnTo)
        }
      />

      {!showCropCatalog ? (
        <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-32">
          <div className="flex items-end justify-between gap-3 pt-2 pb-4">
            <div>
              <h2
                className="font-display text-[20px] font-bold"
                style={{ color: "var(--color-charcoal)" }}
              >
                Your Crops
              </h2>
              <p className="mt-1 text-[13px]" style={{ color: "var(--color-muted)" }}>
                {activeCrops.length} active {activeCrops.length === 1 ? "crop" : "crops"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {activeCrops.map((crop) => {
              const isActive = crop.id === activeCropId
              const canRemove = activeCrops.length > 1
              return (
                <div
                  key={crop.id}
                  className="flex items-center gap-3 rounded-2xl p-3"
                  style={{
                    background: isActive ? "var(--color-brand-pale)" : "var(--color-card)",
                    border: isActive
                      ? "1.5px solid #2C5F2E"
                      : "1.5px solid var(--color-border)",
                  }}
                >
                  <button
                    onClick={() => handleSelect(crop)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    aria-label={`Select ${crop.name}${isActive ? ", currently active" : ""}`}
                  >
                    <span
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl"
                      style={{ background: CATEGORY_EMOJI_BG[crop.category] ?? "#F3F4F6" }}
                    >
                      {crop.emoji}
                    </span>
                    <span className="min-w-0">
                      <span
                        className="block truncate text-[15px] font-semibold"
                        style={{ color: "var(--color-charcoal)" }}
                      >
                        {crop.name}
                      </span>
                      <span className="mt-0.5 block text-[12px]" style={{ color: "var(--color-muted)" }}>
                        {isActive ? "Currently selected" : "Tap to select"}
                      </span>
                    </span>
                  </button>
                  {isActive && (
                    <span
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand text-white"
                      aria-label="Currently selected"
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                        <path d="M2.5 6.5L5.2 9L10.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                  {canRemove && (
                    <button
                      onClick={() => onRemoveCropFromList(crop.id)}
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ color: "var(--color-muted)" }}
                      aria-label={`Remove ${crop.name}`}
                    >
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
                        <path d="M3.5 5H13.5M6.5 5V3.5H10.5V5M5 5.5L5.6 13.5H11.4L12 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="md"
            className="mt-4"
            onClick={() => setShowCropCatalog(true)}
          >
            <span className="mr-2 text-lg leading-none" aria-hidden="true">+</span>
            Add a crop
          </Button>
        </div>
      ) : (
        <>
      {/* Search */}
      <div className="px-5 pb-3 flex-shrink-0">
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{
            background: "var(--color-ground)",
            border: "1.5px solid var(--color-border)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            style={{ color: "var(--color-muted)", flexShrink: 0 }}
          >
            <circle
              cx="8"
              cy="8"
              r="5.5"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M12.5 12.5L16 16"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tomato, wheat, rice…"
            className="flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:font-normal"
            style={{ color: "var(--color-charcoal)" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ color: "var(--color-muted)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4L12 12M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex-shrink-0 overflow-x-auto scroll-hidden">
        <div className="flex gap-2 px-5 pb-4" style={{ width: "max-content" }}>
          {CROP_CATEGORIES.map((cat) => {
            const active = category === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id as CategoryId)}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all active:scale-95"
                style={{
                  background: active ? cat.color : "var(--color-ground)",
                  color: active ? "#fff" : "var(--color-muted)",
                  border: active
                    ? `1.5px solid ${cat.color}`
                    : "1.5px solid var(--color-border)",
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Crop catalog */}
      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-32">
        {/* Add Custom tile */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full card p-4 mb-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "var(--color-brand-pale)" }}
          >
            ＋
          </div>
          <div className="text-left">
            <p
              className="text-[15px] font-semibold"
              style={{ color: "var(--color-charcoal)" }}
            >
              Add a custom crop
            </p>
            <p
              className="text-[12px] mt-0.5"
              style={{ color: "var(--color-muted)" }}
            >
              Don't see your crop? Add it manually
            </p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="ml-auto flex-shrink-0"
            style={{ color: "var(--color-muted)" }}
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="text-5xl">🔍</span>
            <p
              className="text-[15px] font-semibold"
              style={{ color: "var(--color-charcoal)" }}
            >
              No crops found
            </p>
            <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>
              Try a different name or add it as a custom crop
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {filtered.map((crop, i) => {
              const isAdded = myCropIds.includes(crop.id)
              const emojiBg = CATEGORY_EMOJI_BG[crop.category] ?? "#F3F4F6"
              return (
                <button
                  key={crop.id}
                  onClick={() => handleAddCrop(crop)}
                  disabled={isAdded}
                  className="relative rounded-2xl p-3.5 flex flex-col items-center gap-2 active:scale-[0.95] transition-all"
                  style={{
                    animationDelay: `${i * 25}ms`,
                    background: isAdded
                      ? "var(--color-brand-pale)"
                      : "var(--color-card)",
                    border: isAdded
                      ? "2px solid #2C5F2E"
                      : "1.5px solid var(--color-border)",
                    boxShadow: isAdded
                      ? "0 2px 8px rgba(44,95,46,0.18)"
                      : "0 1px 3px rgba(44,95,46,0.06)",
                    cursor: isAdded ? "default" : "pointer",
                  }}
                >
                  {isAdded && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5L4 7L8 3"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: isAdded ? "#C8DFC9" : emojiBg }}
                  >
                    {crop.emoji}
                  </div>
                  <p
                    className="text-[11px] font-semibold text-center leading-tight"
                    style={{
                      color: isAdded ? "#1E5C22" : "var(--color-charcoal)",
                    }}
                  >
                    {crop.name}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>
        </>
      )}

      {/* Add custom crop bottom sheet */}
      {showAddModal && (
        <div
          className="absolute inset-0 z-50 flex flex-col justify-end"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="rounded-t-3xl px-5 pt-6 pb-10 space-y-5"
            style={{ background: "var(--color-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-10 h-1 rounded-full mx-auto"
              style={{ background: "var(--color-border)" }}
            />
            <h3
              className="font-display font-bold text-[20px]"
              style={{ color: "var(--color-charcoal)" }}
            >
              Add Custom Crop
            </h3>

            {/* Emoji picker row */}
            <div>
              <p
                className="text-[12px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--color-muted)" }}
              >
                Choose an icon
              </p>
              <div className="flex gap-2 flex-wrap">
                {[
                  "🌱",
                  "🌿",
                  "🍀",
                  "🎋",
                  "🌾",
                  "🍃",
                  "🌲",
                  "🍄",
                  "🪴",
                  "🌵",
                ].map((e) => (
                  <button
                    key={e}
                    onClick={() => setCustomEmoji(e)}
                    className="w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition-all active:scale-90"
                    style={{
                      background:
                        customEmoji === e
                          ? "var(--color-brand-pale)"
                          : "var(--color-ground)",
                      border:
                        customEmoji === e
                          ? "2px solid #2C5F2E"
                          : "1.5px solid var(--color-border)",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Name input */}
            <div>
              <p
                className="text-[12px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--color-muted)" }}
              >
                Crop name
              </p>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Dragon Fruit, Moringa…"
                className="w-full rounded-2xl px-4 py-3.5 text-[16px] font-medium outline-none"
                style={{
                  background: "var(--color-ground)",
                  border: "1.5px solid var(--color-border)",
                  color: "var(--color-charcoal)",
                }}
                autoFocus
              />
            </div>

            <Button variant="primary" onClick={handleAddCustom}>
              {customEmoji} Add {customName.trim() || "Crop"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
