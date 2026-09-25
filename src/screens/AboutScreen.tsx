import React from "react"
import TopBar from "../components/TopBar"

interface AboutScreenProps {
  navigate: (screen: string) => void
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="card p-5 space-y-3">
      <p className="text-[12px] font-semibold text-muted uppercase tracking-wider">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-[14px] text-muted font-medium flex-shrink-0">
        {label}
      </span>
      <span className="text-[14px] text-charcoal font-medium text-right">
        {value}
      </span>
    </div>
  )
}

export default function AboutScreen({ navigate }: AboutScreenProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TopBar title="About" onBack={() => navigate("settings")} />

      <div className="flex-1 min-h-0 overflow-y-auto scroll-hidden px-5 pb-28 space-y-5">
        {/* App identity */}
        <div className="flex flex-col items-center py-6 gap-4">
          <div className="w-20 h-20 rounded-[28px] bg-brand-pale flex items-center justify-center">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path
                d="M22 40V22"
                stroke="#2C5F2E"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M22 22C22 22 10 18 8 6C8 6 20 4 26 12C30 17 28 22 22 22Z"
                fill="#2C5F2E"
                opacity="0.9"
              />
              <path
                d="M22 28C22 28 31 23 36 13C36 13 26 10 21 18C18 23 20 28 22 28Z"
                fill="#7A9E7E"
                opacity="0.8"
              />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="font-display font-bold text-[22px] text-charcoal">
              AgriGuard
            </h2>
            <p className="text-[14px] text-muted font-medium mt-1">
              Offline Crop Health &amp; Advisory System
            </p>
            <p className="text-[12px] text-muted/60 font-medium mt-0.5">
              Version 1.0
            </p>
          </div>
        </div>

        <Section title="AI">
          <InfoRow label="Model" value="Plant Health Classifier v1.0" />
          <InfoRow label="Type" value="Pretrained image classification" />
          <InfoRow label="Runtime" value="ONNX Runtime Web" />
          <InfoRow label="License" value="MIT" />
          <InfoRow label="Runs on" value="Your device (offline)" />
        </Section>

        <Section title="Software">
          <InfoRow label="ONNX Runtime" value="Web inference" />
          <InfoRow label="Framework" value="React + Vite" />
          <InfoRow label="Storage" value="Device local storage" />
        </Section>

        <Section title="Hardware">
          <InfoRow label="Field sensor" value="Raspberry Pi Pico W" />
          <InfoRow label="Soil sensor" value="Capacitive moisture sensor" />
          <InfoRow label="Temp/Humidity" value="DHT22" />
          <InfoRow label="Communication" value="Local Wi-Fi (no internet)" />
        </Section>

        {/* Disclaimer */}
        <div className="bg-[#FFFBF0] rounded-2xl p-5 border border-amber/20 space-y-2">
          <p className="text-[12px] font-semibold text-amber uppercase tracking-wider">
            Disclaimer
          </p>
          <p className="text-[13px] text-[#78610A] leading-relaxed">
            AI results are indications and should not be treated as confirmed
            agricultural diagnosis. Always inspect the crop in person and use
            appropriate agricultural guidance when necessary.
          </p>
          <p className="text-[13px] text-[#78610A] leading-relaxed">
            This application operates completely offline. No crop data, photos,
            or personal information are transmitted to any external server.
          </p>
        </div>
      </div>
    </div>
  )
}
