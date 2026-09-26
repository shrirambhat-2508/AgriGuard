import React, { useState } from "react"
import TopBar from "../components/TopBar"
import Button from "../components/Button"
import { type Crop } from "../data/crops"

interface SettingsScreenProps {
  navigate: (screen: string) => void
  recordCount: number
  clearHistory: () => void
  darkMode?: boolean
  onToggleDark?: () => void
  activeCrop?: Crop
}

function SettingsRow({
  label,
  value,
  emoji,
  onPress,
  toggle,
  toggled,
  onToggle,
  destructive,
  staticRow,
}: {
  label: string
  value?: string
  emoji?: string
  onPress?: () => void
  toggle?: boolean
  toggled?: boolean
  onToggle?: () => void
  destructive?: boolean
  staticRow?: boolean
}) {
  const showChevron = !toggle && !destructive && !staticRow
  return (
    <button
      onClick={toggle ? onToggle : onPress}
      disabled={staticRow}
      aria-pressed={toggle ? Boolean(toggled) : undefined}
      className="w-full flex items-center justify-between py-3.5 px-4 text-left transition-all active:scale-[0.98]"
      style={{
        cursor: staticRow ? "default" : "pointer",
        background: "transparent",
      }}
    >
      <span
        className="text-[15px] font-medium flex items-center gap-2"
        style={{ color: destructive ? "#DC2626" : "var(--color-charcoal)" }}
      >
        {emoji && <span className="text-base">{emoji}</span>}
        {label}
      </span>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        {value && (
          <span
            className="text-[13px] font-medium"
            style={{ color: "var(--color-muted)" }}
          >
            {value}
          </span>
        )}
        {toggle ? (
          <div
            className="w-11 h-6 rounded-full transition-all flex-shrink-0"
            style={{ background: toggled ? "#2C5F2E" : "var(--color-border)" }}
          >
            <div
              className="w-5 h-5 rounded-full bg-white mt-0.5 shadow-sm transition-transform"
              style={{
                transform: toggled ? "translateX(22px)" : "translateX(2px)",
              }}
            />
          </div>
        ) : showChevron ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 12L10 8L6 4"
              stroke="var(--color-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </div>
    </button>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="tile-enter">
      <p
        className="text-[11px] font-bold uppercase tracking-widest px-1 mb-2"
        style={{ color: "var(--color-muted)" }}
      >
        {title}
      </p>
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 1px 4px rgba(44,95,46,0.08)",
          transition: "background 0.25s ease, border-color 0.25s ease",
        }}
      >
        <div
          style={{ borderColor: "var(--color-border)" }}
          className="divide-y divide-border"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-t-3xl px-5 pt-6 pb-10 space-y-4"
        style={{ background: "var(--color-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-10 h-1 rounded-full mx-auto -mt-1 mb-2"
          style={{ background: "var(--color-border)" }}
        />
        <h3
          className="font-display font-bold text-[20px]"
          style={{ color: "var(--color-charcoal)" }}
        >
          {title}
        </h3>
        {children}
      </div>
    </div>
  )
}

type ModalType = "clear-history" | "export-data" | "sensor-connection" | "credits" | "privacy" | "disclaimer" | "ai-model" | null

export default function SettingsScreen({
  navigate,
  recordCount,
  clearHistory,
  darkMode,
  onToggleDark,
  activeCrop,
}: SettingsScreenProps) {
  const [offlineMode, setOfflineMode] = useState(true)
  const [notifications, setNotifications] = useState(false)
  const [modal, setModal] = useState<ModalType>(null)
  const [exported, setExported] = useState(false)

  function handleClearConfirm() {
    clearHistory()
    setModal(null)
  }

  function handleExportConfirm() {
    setExported(true)
    setTimeout(() => setExported(false), 3000)
    setModal(null)
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col relative">
      <TopBar title="Settings" />

      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-28 space-y-4">
        {/* Export success toast */}
        {exported && (
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-2"
            style={{
              background: "var(--color-healthy-pale)",
              border: "1px solid #BBF7D0",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8L6.5 11.5L13 4.5"
                stroke="#16A34A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-[13px] font-semibold text-[#15803D]">
              Data exported successfully
            </p>
          </div>
        )}

        {/* ── Appearance ── */}
        <Section title="Appearance">
          <SettingsRow
            label="Dark Mode"
            emoji="🌙"
            value={darkMode ? "On" : "Off"}
            toggle
            toggled={darkMode}
            onToggle={onToggleDark}
          />
          <SettingsRow
            label="Offline Mode"
            emoji="📡"
            toggle
            toggled={offlineMode}
            onToggle={() => setOfflineMode(!offlineMode)}
          />
        </Section>

        {/* ── Crop ── */}
        <Section title="My Crop">
          <SettingsRow
            label="Manage Crops"
            emoji="🌿"
            value={activeCrop?.name ?? "Tomato"}
            onPress={() => navigate("manage-crops")}
          />
        </Section>

        {/* ── Sensor ── */}
        <Section title="Field Sensor">
          <SettingsRow
            label="Sensor Connection"
            emoji="🔌"
            value="Local Wi-Fi"
            onPress={() => setModal("sensor-connection")}
          />
          <SettingsRow
            label="Sensor Status"
            emoji="🟢"
            value="Connected"
            staticRow
          />
        </Section>

        {/* ── Data ── */}
        <Section title="Data">
          <SettingsRow
            label="Crop History"
            emoji="📋"
            value={`${recordCount} record${recordCount !== 1 ? "s" : ""}`}
            onPress={() => navigate("history")}
          />
          <SettingsRow
            emoji="📤"
            label="Export Data"
            onPress={() => setModal("export-data")}
          />
          <SettingsRow
            emoji="🗑️"
            label="Clear History"
            destructive
            onPress={() => setModal("clear-history")}
          />
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications">
          <SettingsRow
            label="Push Notifications"
            emoji="🔔"
            toggle
            toggled={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
        </Section>

        {/* ── About ── */}
        <Section title="About">
          <SettingsRow
            emoji="ℹ️"
            label="About AgriGuard"
            onPress={() => navigate("about")}
          />
          <SettingsRow
            emoji="🤖"
            label="AI Model"
            value="Plant Health v1.0"
            onPress={() => setModal("ai-model")}
          />
          <SettingsRow
            emoji="📦"
            label="Open-source Credits"
            onPress={() => setModal("credits")}
          />
          <SettingsRow
            emoji="🔒"
            label="Privacy"
            onPress={() => setModal("privacy")}
          />
          <SettingsRow
            emoji="⚠️"
            label="Disclaimer"
            onPress={() => setModal("disclaimer")}
          />
          <p
            className="px-4 py-3 text-[13px] leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            AgriGuard brings crop photos, field readings, and observations together to help you monitor crop health. Saved reports stay on this device.
          </p>
        </Section>

        <p
          className="text-center text-[11px] font-medium pb-2"
          style={{ color: "var(--color-muted)", opacity: 0.6 }}
        >
          AgriGuard · v1.0 · All data stored locally
        </p>
      </div>

      {/* ── Modals ── */}

      {modal === "clear-history" && (
        <Modal title="Clear crop history?" onClose={() => setModal(null)}>
          <p
            className="text-[15px] leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            This will permanently remove all {recordCount} saved crop records.
            This action cannot be undone.
          </p>
          <div className="space-y-2 pt-2">
            <Button variant="destructive" onClick={handleClearConfirm}>
              Clear All Records
            </Button>
            <Button variant="outline" onClick={() => setModal(null)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}

      {modal === "export-data" && (
        <Modal title="Export crop data" onClose={() => setModal(null)}>
          <p
            className="text-[15px] leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            Your {recordCount} crop records will be exported as a JSON file and
            saved to your device.
          </p>
          <div className="space-y-2 pt-2">
            <Button variant="primary" onClick={handleExportConfirm}>
              Export to Device
            </Button>
            <Button variant="outline" onClick={() => setModal(null)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}

      {modal === "sensor-connection" && (
        <Modal title="Field Sensor Connection" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div
              className="rounded-xl px-4 py-3 flex items-center gap-2"
              style={{
                background: "var(--color-healthy-pale)",
                border: "1px solid #BBF7D0",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-healthy flex-shrink-0" />
              <p className="text-[14px] font-semibold text-[#15803D]">
                Sensor connected
              </p>
            </div>
            <div className="space-y-2 text-[14px]">
              {[
                ["Network", "Local Wi-Fi"],
                ["Type", "Raspberry Pi Pico W"],
                ["Mode", "No internet required"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span style={{ color: "var(--color-muted)" }}>{k}</span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-charcoal)" }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" onClick={() => setModal(null)}>
            Close
          </Button>
        </Modal>
      )}

      {modal === "ai-model" && (
        <Modal title="AI Model" onClose={() => setModal(null)}>
          <div className="space-y-2 text-[14px]">
            {[
              ["Name", "Plant Health Classifier v1.0"],
              ["Runtime", "ONNX Runtime Web"],
              ["License", "MIT"],
              ["Runs on", "Your device"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span style={{ color: "var(--color-muted)" }}>{k}</span>
                <span
                  className="font-medium"
                  style={{ color: "var(--color-charcoal)" }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
          <p
            className="text-[12px] leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            The AI model runs entirely on your device. No images or data are
            sent to any server.
          </p>
          <Button variant="outline" onClick={() => setModal(null)}>
            Close
          </Button>
        </Modal>
      )}

      {modal === "credits" && (
        <Modal title="Open-source credits" onClose={() => setModal(null)}>
          <div className="space-y-3 text-[14px]">
            {[
              ["React", "MIT"],
              ["Vite", "MIT"],
              ["Tailwind CSS", "MIT"],
              ["ONNX Runtime Web", "MIT"],
              ["TypeScript", "Apache 2.0"],
            ].map(([name, lic]) => (
              <div key={name} className="flex justify-between">
                <span
                  className="font-medium"
                  style={{ color: "var(--color-charcoal)" }}
                >
                  {name}
                </span>
                <span style={{ color: "var(--color-muted)" }}>{lic}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => setModal(null)}>
            Close
          </Button>
        </Modal>
      )}

      {modal === "privacy" && (
        <Modal title="Privacy" onClose={() => setModal(null)}>
          <p
            className="text-[15px] leading-relaxed"
            style={{ color: "var(--color-charcoal)" }}
          >
            AgriGuard stores all data locally on your device. No crop
            photos, sensor readings, or personal information are transmitted to
            any external server.
          </p>
          <p
            className="text-[14px] leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            The application works entirely offline and does not require an
            internet connection.
          </p>
          <Button variant="outline" onClick={() => setModal(null)}>
            Close
          </Button>
        </Modal>
      )}

      {modal === "disclaimer" && (
        <Modal title="Disclaimer" onClose={() => setModal(null)}>
          <p
            className="text-[15px] leading-relaxed"
            style={{ color: "var(--color-charcoal)" }}
          >
            AI results are indications and should not be treated as confirmed
            agricultural diagnosis.
          </p>
          <p
            className="text-[14px] leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            Always inspect the crop in person and use appropriate agricultural
            guidance. AgriGuard is an advisory tool, not a replacement
            for professional advice.
          </p>
          <Button variant="outline" onClick={() => setModal(null)}>
            Close
          </Button>
        </Modal>
      )}
    </div>
  )
}
