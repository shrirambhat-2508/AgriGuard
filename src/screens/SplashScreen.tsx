export default function SplashScreen() {
  return (
    <div
      className="flex-1 min-h-0 flex flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(170deg, #1A3A1C 0%, #0E1F10 55%, #0A1A0C 100%)",
      }}
    >
      {/* ── Ambient glow ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 340,
          height: 340,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(44,95,46,0.22) 0%, transparent 68%)",
          top: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          animation: "ambientPulse 3.2s ease-in-out infinite",
        }}
      />

      {/* ── Floating leaf particles ── */}
      {[
        { size: 9, left: "16%", delay: 0.4, dur: 3.0 },
        { size: 7, left: "78%", delay: 1.0, dur: 2.7 },
        { size: 11, left: "62%", delay: 0.2, dur: 3.5 },
        { size: 6, left: "32%", delay: 1.6, dur: 2.4 },
        { size: 8, left: "48%", delay: 2.1, dur: 3.2 },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: p.left,
            bottom: "36%",
            opacity: 0,
            animation: `particleFloat ${p.dur}s ease-out ${p.delay}s infinite`,
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 12 12" fill="none">
            <path
              d="M6 11V6C6 6 2 5 1 1C1 1 5 0.5 7 3C8.5 5 7.5 6 6 6Z"
              fill="rgba(122,158,126,0.55)"
            />
          </svg>
        </div>
      ))}

      {/* ══════════════════════════════════
          TOP — App name
      ══════════════════════════════════ */}
      <div
        className="flex-shrink-0 flex flex-col items-center pt-16"
        style={{ animation: "titleRise 0.5s ease-out 0.1s both" }}
      >
        <p
          className="text-[11px] font-bold uppercase tracking-[0.25em]"
          style={{ color: "rgba(122,158,126,0.75)" }}
        >
          Offline · Intelligent · Agricultural
        </p>
        <h1
          className="font-display font-bold text-[32px] mt-2 leading-tight text-center"
          style={{ color: "rgba(255,255,255,0.97)", letterSpacing: "-0.3px" }}
        >
          AgriGuard
        </h1>
      </div>

      {/* ══════════════════════════════════
          CENTER — Large Animated Logo
      ══════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Ripple rings */}
          {[
            { delay: "1.2s", size: 200 },
            { delay: "1.9s", size: 200 },
          ].map((r, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                width: r.size,
                height: r.size,
                borderRadius: "56px",
                border: `${i === 0 ? 1.5 : 1}px solid rgba(122,158,126,${
                  i === 0 ? 0.35 : 0.2
                })`,
                animation: `ringRipple 2.6s ease-out ${r.delay} infinite`,
              }}
            />
          ))}

          {/* Icon box — large */}
          <div
            style={{
              width: 172,
              height: 172,
              borderRadius: "52px",
              background:
                "linear-gradient(145deg, rgba(52,105,54,0.92) 0%, rgba(28,58,30,0.96) 100%)",
              border: "1px solid rgba(122,158,126,0.28)",
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.5), 0 4px 16px rgba(44,95,46,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation:
                "splashLogoIn 0.85s cubic-bezier(0.34,1.56,0.64,1) 0.3s both",
            }}
          >
            <svg width="96" height="96" viewBox="0 0 58 58" fill="none">
              {/* Stem */}
              <path
                d="M29 50V29"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeDasharray="32"
                strokeDashoffset="32"
                style={{ animation: "stemDraw 0.55s ease-out 1.05s both" }}
              />
              {/* Main leaf */}
              <path
                d="M29 29C29 29 15 25 12 10C12 10 25 8 33 17C37.5 23 35 29 29 29Z"
                fill="rgba(255,255,255,0.93)"
                style={{
                  animation:
                    "leafUnfurl 0.65s cubic-bezier(0.34,1.56,0.64,1) 1.1s both",
                }}
              />
              {/* Second leaf */}
              <path
                d="M29 35C29 35 40 30 45 17C45 17 33 14 27 23C24 29 26 35 29 35Z"
                fill="rgba(152,210,158,0.85)"
                style={{
                  animation:
                    "leaf2Unfurl 0.65s cubic-bezier(0.34,1.56,0.64,1) 1.3s both",
                }}
              />
              {/* Sprout */}
              <path
                d="M29 43C29 43 22 40 20 32C20 32 26 31 29 37C30.5 40 29.5 43 29 43Z"
                fill="rgba(255,255,255,0.42)"
                style={{ animation: "leafUnfurl 0.5s ease-out 1.5s both" }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          BOTTOM — Loading spinner + tagline
      ══════════════════════════════════ */}
      <div
        className="flex-shrink-0 flex flex-col items-center pb-14 px-10 gap-4"
        style={{ animation: "titleRise 0.5s ease-out 0.4s both" }}
      >
        <p
          className="text-[14px] font-medium"
          style={{ color: "rgba(152,207,156,0.72)" }}
        >
          Offline Crop Health Assistant
        </p>

        <div
          className="flex items-center gap-3"
          role="status"
          aria-label="Loading AgriGuard"
        >
          <div
            className="w-8 h-8 flex-shrink-0 rounded-full border-[3px] animate-spin-ring"
            aria-hidden="true"
            style={{
              borderColor: "rgba(255,255,255,0.16)",
              borderTopColor: "#98CF9C",
              filter: "drop-shadow(0 0 5px rgba(152,207,156,0.45))",
            }}
          />
          <span
            className="text-[11px] font-medium"
            style={{ color: "rgba(255,255,255,0.42)" }}
          >
            Loading…
          </span>
        </div>

        <p
          className="text-[11px] font-medium"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          v1.0 · All data stored locally
        </p>
      </div>

      <style>{`
        @keyframes ambientPulse {
          0%,100% { transform:translateX(-50%) scale(1);    opacity:1; }
          50%      { transform:translateX(-50%) scale(1.14); opacity:0.7; }
        }
      `}</style>
    </div>
  )
}
