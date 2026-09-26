import { useState, useEffect, useCallback } from "react"
import BottomNav from "./components/BottomNav"
import Sidebar from "./components/Sidebar"
import SplashScreen from "./screens/SplashScreen"
import HomeScreen from "./screens/HomeScreen"
import HomeEmptyScreen from "./screens/HomeEmptyScreen"
import SensorScreen from "./screens/SensorScreen"
import CropPhotoScreen from "./screens/CropPhotoScreen"
import AIAnalysisScreen from "./screens/AIAnalysisScreen"
import CropResultScreen from "./screens/CropResultScreen"
import SavedReportScreen from "./screens/SavedReportScreen"
import HistoryScreen from "./screens/HistoryScreen"
import HistoryDetailScreen from "./screens/HistoryDetailScreen"
import InsightsScreen from "./screens/InsightsScreen"
import InsightsInsufficientScreen from "./screens/InsightsInsufficientScreen"
import InsightsEmptyScreen from "./screens/InsightsEmptyScreen"
import OverallAnalysisScreen from "./screens/OverallAnalysisScreen"
import SettingsScreen from "./screens/SettingsScreen"
import AboutScreen from "./screens/AboutScreen"
import ErrorScreen from "./screens/ErrorScreen"
import ManageCropsScreen from "./screens/ManageCropsScreen"
import MetricDetailScreen from "./screens/MetricDetailScreen"
import { MOCK_HISTORY, type CropRecord } from "./data/mockData"
import { DEFAULT_CROPS, type Crop } from "./data/crops"

type Screen = "splash" | "home" | "home-empty" | "sensor-connecting" | "sensor-connected" | "sensor-disconnected" | "crop-photo" | "ai-analysis" | "crop-result" | "saved-report" | "history" | "history-detail" | "insights" | "insights-insufficient" | "insights-empty" | "overall-analysis" | "settings" | "about" | "manage-crops" | "metric-detail" | "error-sensor-disconnected" | "error-camera-denied" | "error-blurry-photo" | "error-analysis-failed" | "error-save-failed" | "error-no-sensor-reading"

type NavTab = "home" | "check" | "insights" | "history" | "settings"

type AppHistoryEntry = {
  app: "agriguard"
  screen: Screen
  selectedHistoryId?: string
  selectedMetric?: "moisture" | "temp" | "humidity"
  cropReturnTo?: string
}

const NAV_SCREENS: Record<NavTab, Screen> = {
  home: "home",
  check: "sensor-connecting",
  insights: "insights",
  history: "history",
  settings: "settings",
}

function getActiveNav(screen: Screen): NavTab {
  if (["home", "home-empty"].includes(screen)) return "home"
  if (
    [
      "sensor-connecting",
      "sensor-connected",
      "sensor-disconnected",
      "crop-photo",
      "ai-analysis",
      "crop-result",
      "saved-report",
    ].includes(screen)
  )
    return "check"
  if (
    [
      "insights",
      "insights-insufficient",
      "insights-empty",
      "overall-analysis",
      "metric-detail",
    ].includes(screen)
  )
    return "insights"
  if (["history", "history-detail"].includes(screen)) return "history"
  if (["settings", "about", "manage-crops"].includes(screen)) return "settings"
  return "home"
}

const DEFAULT_CROP_ID = "tomato"
const CROP_HISTORY_STORAGE_KEY = "agriguard.crop-history"

function loadCropHistory(): CropRecord[] {
  try {
    const storedHistory = localStorage.getItem(CROP_HISTORY_STORAGE_KEY)
    if (storedHistory === null) return MOCK_HISTORY

    const parsedHistory: unknown = JSON.parse(storedHistory)
    return Array.isArray(parsedHistory)
      ? (parsedHistory as CropRecord[])
      : MOCK_HISTORY
  } catch {
    return MOCK_HISTORY
  }
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return mobile
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash")
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraRequesting, setCameraRequesting] = useState(false)
  const [selectedHistoryId, setSelectedHistoryId] =
    useState<string | undefined>()
  const [prevKey, setPrevKey] = useState(0)
  const [records, setRecords] = useState<CropRecord[]>(loadCropHistory)
  const [pendingReport, setPendingReport] = useState<CropRecord | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [activeCropId, setActiveCropId] = useState<string>(DEFAULT_CROP_ID)
  const [userCrops, setUserCrops] = useState<Crop[]>([])
  const [myCropIds, setMyCropIds] = useState<string[]>(["tomato"])
  const [cropReturnTo, setCropReturnTo] = useState<string>("home")
  const [selectedMetric, setSelectedMetric] =
    useState<"moisture" | "temp" | "humidity">("moisture")

  const activeCrop =
    userCrops.find((c) => c.id === activeCropId) ??
    DEFAULT_CROPS.find((c) => c.id === activeCropId) ??
    DEFAULT_CROPS[0]

  const clearHistory = useCallback(() => setRecords([]), [])

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), [])

  const handleAddCustomCrop = useCallback((crop: Crop) => {
    setUserCrops((prev) => [...prev, crop])
  }, [])

  const handleAddCropToList = useCallback((id: string) => {
    setMyCropIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const handleRemoveCropFromList = useCallback(
    (id: string) => {
      setMyCropIds((prev) => {
        const next = prev.filter((cid) => cid !== id)
        if (id === activeCropId && next.length > 0) {
          setActiveCropId(next[0])
        }
        return next.length > 0 ? next : prev // prevent removing last crop
      })
    },
    [activeCropId],
  )

  useEffect(() => {
    try {
      localStorage.setItem(CROP_HISTORY_STORAGE_KEY, JSON.stringify(records))
    } catch {
      return
    }
  }, [records])

  useEffect(() => {
    const initialEntry: AppHistoryEntry = {
      app: "agriguard",
      screen: "splash",
      selectedMetric: "moisture",
      cropReturnTo: "home",
    }
    window.history.replaceState(initialEntry, "", window.location.href)

    const handlePopState = (event: PopStateEvent) => {
      const entry = event.state as AppHistoryEntry | null
      if (entry?.app !== "agriguard" || !entry.screen) return

      setScreen(entry.screen)
      setSelectedHistoryId(entry.selectedHistoryId)
      setSelectedMetric(entry.selectedMetric ?? "moisture")
      setCropReturnTo(entry.cropReturnTo ?? "home")
      setPrevKey((key) => key + 1)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const initialScreen = records.length > 0 ? "home" : "home-empty"
      setScreen(initialScreen)
      window.history.replaceState(
        { app: "agriguard", screen: initialScreen } satisfies AppHistoryEntry,
        "",
        window.location.href,
      )
    }, 3200)
    return () => clearTimeout(timer)
  }, [])

  const navigate = useCallback(
    (target: string, id?: string) => {
      const nextScreen = target as Screen
      if (
        nextScreen === screen &&
        (nextScreen !== "history-detail" || id === selectedHistoryId) &&
        (nextScreen !== "metric-detail" || id === selectedMetric)
      ) return

      const nextSelectedHistoryId =
        target === "history-detail" ? id : undefined
      const nextSelectedMetric =
        target === "metric-detail" && id
          ? (id as "moisture" | "temp" | "humidity")
          : selectedMetric
      setSelectedHistoryId(nextSelectedHistoryId)
      setSelectedMetric(nextSelectedMetric)

      let nextCropReturnTo = cropReturnTo
      if (target === "manage-crops") {
        nextCropReturnTo = screen === "settings" ? "settings" : "home"
        setCropReturnTo(nextCropReturnTo)
      }

      const entry: AppHistoryEntry = {
        app: "agriguard",
        screen: nextScreen,
        selectedHistoryId: nextSelectedHistoryId,
        selectedMetric: nextSelectedMetric,
        cropReturnTo: nextCropReturnTo,
      }
      window.history.pushState(entry, "", window.location.href)
      setPrevKey((k) => k + 1)
      setScreen(nextScreen)
    },
    [cropReturnTo, screen, selectedHistoryId, selectedMetric],
  )

  const requestCropCamera = useCallback(async () => {
    const currentEntry = window.history.state as AppHistoryEntry | null
    if (screen === "sensor-connecting" && currentEntry?.app === "agriguard") {
      window.history.replaceState(
        { ...currentEntry, screen: "sensor-connected" },
        "",
        window.location.href,
      )
    }

    setCameraRequesting(true)
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is unavailable in this browser")
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })
      setCameraStream(stream)
      navigate("crop-photo")
    } catch {
      navigate("error-camera-denied")
    } finally {
      setCameraRequesting(false)
    }
  }, [navigate, screen])

  const saveCropPhoto = useCallback(
    (photoData: string) => {
      const now = new Date()
      const report: CropRecord = {
        ...MOCK_HISTORY[0],
        id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
        date: now.toISOString().slice(0, 10),
        displayDate: new Intl.DateTimeFormat(undefined, {
          day: "numeric",
          month: "short",
        }).format(now),
        displayTime: new Intl.DateTimeFormat(undefined, {
          hour: "numeric",
          minute: "2-digit",
        }).format(now),
        month: new Intl.DateTimeFormat(undefined, {
          month: "long",
          year: "numeric",
        }).format(now),
        cropName: activeCrop.name,
        photoData,
      }
      setPendingReport(report)
      navigate("ai-analysis")
    },
    [activeCrop.name, navigate],
  )

  const saveCurrentReport = useCallback(() => {
    if (!pendingReport) {
      navigate("error-save-failed")
      return
    }

    const nextRecords = [
      pendingReport,
      ...records.filter((record) => record.id !== pendingReport.id),
    ]
    try {
      localStorage.setItem(CROP_HISTORY_STORAGE_KEY, JSON.stringify(nextRecords))
    } catch {
      navigate("error-save-failed")
      return
    }

    setRecords(nextRecords)
    navigate("saved-report")
  }, [navigate, pendingReport, records])

  useEffect(() => {
    if (screen === "crop-photo" || !cameraStream) return
    cameraStream.getTracks().forEach((track) => track.stop())
    setCameraStream(null)
  }, [cameraStream, screen])

  const handleNavTab = useCallback(
    (tab: NavTab) => {
      let target: Screen
      if (tab === "home") {
        target = records.length > 0 ? "home" : "home-empty"
      } else if (tab === "insights") {
        if (records.length === 0) target = "insights-empty"
        else if (records.length < 3) target = "insights-insufficient"
        else target = "insights"
      } else {
        target = NAV_SCREENS[tab]
      }
      navigate(target)
    },
    [navigate, records.length],
  )

  const isMobile = useIsMobile()
  const isSplash = screen === "splash"
  const activeNav = getActiveNav(screen)

  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return <SplashScreen />
      case "home":
        return (
          <HomeScreen
            navigate={navigate}
            records={records}
            activeCrop={activeCrop}
            darkMode={darkMode}
            onToggleDark={toggleDarkMode}
          />
        )
      case "home-empty":
        return <HomeEmptyScreen navigate={navigate} />
      case "sensor-connecting":
        return (
          <SensorScreen
            navigate={navigate}
            subState="connecting"
            onContinue={requestCropCamera}
            cameraRequesting={cameraRequesting}
          />
        )
      case "sensor-connected":
        return (
          <SensorScreen
            navigate={navigate}
            subState="connected"
            onContinue={requestCropCamera}
            cameraRequesting={cameraRequesting}
          />
        )
      case "sensor-disconnected":
        return <SensorScreen navigate={navigate} subState="disconnected" />
      case "crop-photo":
        return (
          <CropPhotoScreen
            navigate={navigate}
            stream={cameraStream}
            onRequestCamera={requestCropCamera}
            onSavePhoto={saveCropPhoto}
          />
        )
      case "ai-analysis":
        return <AIAnalysisScreen navigate={navigate} />
      case "crop-result":
        return (
          <CropResultScreen
            navigate={navigate}
            record={pendingReport ?? records[0] ?? MOCK_HISTORY[0]}
            onSaveReport={saveCurrentReport}
          />
        )
      case "saved-report":
        return (
          <SavedReportScreen
            navigate={navigate}
            record={pendingReport ?? records[0] ?? MOCK_HISTORY[0]}
          />
        )
      case "history":
        return <HistoryScreen navigate={navigate} records={records} />
      case "history-detail":
        return (
          <HistoryDetailScreen
            navigate={navigate}
            recordId={selectedHistoryId}
            records={records}
          />
        )
      case "insights":
        return <InsightsScreen navigate={navigate} records={records} />
      case "insights-insufficient":
        return <InsightsInsufficientScreen navigate={navigate} />
      case "insights-empty":
        return <InsightsEmptyScreen navigate={navigate} />
      case "overall-analysis":
        return <OverallAnalysisScreen navigate={navigate} records={records} />
      case "settings":
        return (
          <SettingsScreen
            navigate={navigate}
            recordCount={records.length}
            clearHistory={clearHistory}
            darkMode={darkMode}
            onToggleDark={toggleDarkMode}
            activeCrop={activeCrop}
          />
        )
      case "about":
        return <AboutScreen navigate={navigate} />
      case "metric-detail":
        return (
          <MetricDetailScreen
            navigate={navigate}
            metric={selectedMetric}
            records={records}
          />
        )
      case "manage-crops":
        return (
          <ManageCropsScreen
            navigate={navigate}
            activeCropId={activeCropId}
            myCropIds={myCropIds}
            userCrops={userCrops}
            onSelectCrop={setActiveCropId}
            onAddCropToList={handleAddCropToList}
            onRemoveCropFromList={handleRemoveCropFromList}
            onAddCustomCrop={handleAddCustomCrop}
            returnTo={cropReturnTo}
          />
        )
      case "error-sensor-disconnected":
        return <ErrorScreen type="sensor-disconnected" navigate={navigate} />
      case "error-camera-denied":
        return <ErrorScreen type="camera-denied" navigate={navigate} />
      case "error-blurry-photo":
        return <ErrorScreen type="blurry-photo" navigate={navigate} />
      case "error-analysis-failed":
        return <ErrorScreen type="analysis-failed" navigate={navigate} />
      case "error-save-failed":
        return <ErrorScreen type="save-failed" navigate={navigate} />
      case "error-no-sensor-reading":
        return <ErrorScreen type="no-sensor-reading" navigate={navigate} />
      default:
        return (
          <HomeScreen
            navigate={navigate}
            records={records}
            activeCrop={activeCrop}
            darkMode={darkMode}
            onToggleDark={toggleDarkMode}
          />
        )
    }
  }

  /* ── Mobile: full-screen app frame ── */
  if (isMobile) {
    return (
      <div className={`app-frame${darkMode ? " dark" : ""}`}>
        <div
          key={prevKey}
          className="flex-1 min-h-0 flex flex-col screen-enter"
        >
          {renderScreen()}
        </div>
        {!isSplash && (
          <BottomNav
            active={activeNav}
            onNavigate={handleNavTab}
            darkMode={darkMode}
          />
        )}
      </div>
    )
  }

  /* ── Desktop / tablet: full-screen webapp ── */
  return (
    <div className={`desktop-shell${darkMode ? " dark" : ""}`}>
      {!isSplash && (
        <Sidebar
          active={activeNav}
          onNavigate={handleNavTab}
          darkMode={darkMode}
          onToggleDark={toggleDarkMode}
          activeCrop={activeCrop}
        />
      )}
      <div className="desktop-content">
        <div key={prevKey} className="desktop-screen screen-enter">
          {renderScreen()}
        </div>
      </div>
    </div>
  )
}
