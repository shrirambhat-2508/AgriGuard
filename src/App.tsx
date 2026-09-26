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
  const [selectedHistoryId, setSelectedHistoryId] =
    useState<string | undefined>()
  const [prevKey, setPrevKey] = useState(0)
  const [records, setRecords] = useState<CropRecord[]>(MOCK_HISTORY)
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
    const timer = setTimeout(() => {
      setScreen(records.length > 0 ? "home" : "home-empty")
    }, 3200)
    return () => clearTimeout(timer)
  }, [])

  const navigate = useCallback(
    (target: string, id?: string) => {
      if (target === "history-detail" && id) setSelectedHistoryId(id)
      if (target === "metric-detail" && id) {
        setSelectedMetric(id as "moisture" | "temp" | "humidity")
      }
      if (target === "manage-crops") {
        // track which screen opened manage-crops so we can return there
        setCropReturnTo(screen === "settings" ? "settings" : "home")
      }
      setPrevKey((k) => k + 1)
      setScreen(target as Screen)
    },
    [screen],
  )

  const handleNavTab = useCallback(
    (tab: NavTab) => {
      if (tab === "home") {
        setScreen(records.length > 0 ? "home" : "home-empty")
      } else if (tab === "insights") {
        if (records.length === 0) setScreen("insights-empty")
        else if (records.length < 3) setScreen("insights-insufficient")
        else setScreen("insights")
      } else {
        setScreen(NAV_SCREENS[tab])
      }
      setPrevKey((k) => k + 1)
    },
    [records.length],
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
        return <SensorScreen navigate={navigate} subState="connecting" />
      case "sensor-connected":
        return <SensorScreen navigate={navigate} subState="connected" />
      case "sensor-disconnected":
        return <SensorScreen navigate={navigate} subState="disconnected" />
      case "crop-photo":
        return <CropPhotoScreen navigate={navigate} />
      case "ai-analysis":
        return <AIAnalysisScreen navigate={navigate} />
      case "crop-result":
        return <CropResultScreen navigate={navigate} />
      case "saved-report":
        return <SavedReportScreen navigate={navigate} />
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
