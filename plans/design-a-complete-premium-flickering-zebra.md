# Smart Crop Guardian — Implementation Plan

## Context

Build a complete, premium, mobile-first UI/UX system for Smart Crop Guardian, an agricultural crop health monitoring app targeting Android smartphones (390×844px primary frame). The app covers 18 distinct screens across 5 navigation sections. The implementation is a self-contained React prototype with internal state navigation — no backend, no routing library needed.

---

## Aesthetic Stance

**Warm** — inspired by Aesop/Le Labo/boutique agricultural brands. Premium quality through spacing, hierarchy, and restraint — not effects.

- **Ground**: Warm off-white `#F7F4EF`
- **Primary**: Deep botanical green `#2C5F2E`
- **Primary light**: Sage `#7A9E7E`
- **Card**: White `#FFFFFF`
- **Text**: Deep charcoal `#1C1C1E`
- **Muted text**: `#6B7280`
- **Blue (sensor)**: `#2563EB`
- **Amber (attention)**: `#D97706`
- **Red (warning)**: `#DC2626`
- **Green (healthy)**: `#16A34A`
- **Border**: `#E5E0D8`

**Typography** (locally bundled — no CDN, no runtime network requests):
- **Outfit** — headings, page titles, large values (warm, modern humanist) — downloaded `.woff2` files bundled in `src/assets/fonts/`
- **Inter** — body text, labels, metadata (highly readable) — downloaded `.woff2` files bundled in `src/assets/fonts/`

---

## Offline-First Architecture (Core Requirement)

The application must function entirely without internet after installation. Every asset, font, library, and data operation is local.

| Concern | Solution |
|---|---|
| Fonts | `.woff2` files bundled in `src/assets/fonts/`, `@font-face` in CSS |
| Crop history | `localStorage` (key: `scg_history`) — JSON array of analysis records |
| Trends & insights | Calculated in-memory from `localStorage` records at render time |
| AI inference | Prototype uses mock results; production would use ONNX Runtime Web with a bundled `.onnx` model file |
| Sensor data | Raspberry Pi Pico W communicates over local Wi-Fi (`fetch('http://192.168.x.x/data')`); no internet required |
| Images | Crop photos stored as base64 data URLs in `localStorage` |
| No CDN deps | All npm packages bundled by Vite into the output; zero runtime CDN calls |
| Offline indicator | `navigator.onLine` used only to show "Offline ready" badge; app never degrades when `false` |

**Never add online fallbacks.** If a feature cannot work offline, redesign it offline-first.

## Architecture

### Navigation Model
Single-page app with a React state machine. `App.tsx` holds a `currentScreen` string and `appState` object. No `react-router`. Transitions are instant with a subtle CSS fade.

### State Shape
```ts
type Screen =
  | 'splash' | 'home' | 'home-empty'
  | 'sensor-connecting' | 'sensor-connected' | 'sensor-disconnected'
  | 'crop-photo' | 'ai-analysis'
  | 'crop-result' | 'saved-report'
  | 'history' | 'history-detail'
  | 'insights' | 'insights-insufficient' | 'insights-empty'
  | 'overall-analysis'
  | 'settings' | 'about'
  | 'error-camera' | 'error-blurry' | 'error-analysis-failed'

type AppState = {
  currentScreen: Screen
  selectedHistoryId: string | null
  hasHistory: boolean
  activeNav: 'home' | 'check' | 'insights' | 'history' | 'settings'
}
```

### File Structure
```
src/
  index.css              ← Google Font imports + Tailwind + CSS theme tokens
  main.tsx               ← unchanged
  App.tsx                ← state machine + screen router
  data/
    mockData.ts          ← realistic mock history records, sensor readings
  screens/
    SplashScreen.tsx
    HomeScreen.tsx
    HomeEmptyScreen.tsx
    SensorScreen.tsx
    CropPhotoScreen.tsx
    AIAnalysisScreen.tsx
    CropResultScreen.tsx
    SavedReportScreen.tsx
    HistoryScreen.tsx
    HistoryDetailScreen.tsx
    InsightsScreen.tsx
    InsightsInsufficient.tsx
    InsightsEmpty.tsx
    OverallAnalysisScreen.tsx
    SettingsScreen.tsx
    AboutScreen.tsx
    ErrorScreen.tsx
  components/
    BottomNav.tsx
    TopBar.tsx
    StatusBadge.tsx
    MetricCard.tsx
    CropStatusCard.tsx
    AIResultCard.tsx
    HistoryItem.tsx
    InsightChart.tsx
    Button.tsx
    ProgressStep.tsx
    SectionHeader.tsx
    EmptyState.tsx
```

---

## Key Implementation Details

### Font Bundling Strategy

**No CDN. No runtime network requests for fonts.**

Download the required `.woff2` subsets (latin) at build time and commit them to `src/assets/fonts/`. Wire via `@font-face` in `src/index.css` using `url('/src/assets/fonts/...')` relative paths. Vite resolves these at build time and bundles them into the output.

Files needed (download once, commit):
- `src/assets/fonts/Outfit-Regular.woff2`
- `src/assets/fonts/Outfit-Medium.woff2`
- `src/assets/fonts/Outfit-SemiBold.woff2`
- `src/assets/fonts/Outfit-Bold.woff2`
- `src/assets/fonts/Outfit-ExtraBold.woff2`
- `src/assets/fonts/Inter-Regular.woff2`
- `src/assets/fonts/Inter-Medium.woff2`
- `src/assets/fonts/Inter-SemiBold.woff2`

**Fallback**: If font files are not yet downloaded, use system-font stack: `'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`. The UI renders correctly with system fonts and improves progressively once custom fonts are bundled.

### `src/index.css`
```css
/* Locally bundled fonts — no CDN */
@font-face {
  font-family: 'Outfit';
  src: url('/src/assets/fonts/Outfit-Regular.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Outfit';
  src: url('/src/assets/fonts/Outfit-Medium.woff2') format('woff2');
  font-weight: 500; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Outfit';
  src: url('/src/assets/fonts/Outfit-Bold.woff2') format('woff2');
  font-weight: 700; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/src/assets/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/src/assets/fonts/Inter-Medium.woff2') format('woff2');
  font-weight: 500; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/src/assets/fonts/Inter-SemiBold.woff2') format('woff2');
  font-weight: 600; font-style: normal; font-display: swap;
}

@import 'tailwindcss';

@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Outfit', system-ui, sans-serif;
  --color-brand: #2C5F2E;
  --color-brand-light: #7A9E7E;
  --color-ground: #F7F4EF;
  --color-card: #FFFFFF;
  --color-charcoal: #1C1C1E;
  --color-muted: #6B7280;
  --color-border: #E5E0D8;
  --color-sensor: #2563EB;
  --color-amber: #D97706;
  --color-danger: #DC2626;
  --color-healthy: #16A34A;
}

html, body, #root {
  height: 100%;
  background-color: #F7F4EF;
}

/* Mobile-first container */
.app-frame {
  max-width: 390px;
  min-height: 100dvh;
  margin: 0 auto;
  background: #F7F4EF;
  position: relative;
  overflow: hidden;
}
```

### `src/App.tsx`
Renders `<SplashScreen>` for 2s then transitions to `<HomeScreen>` or `<HomeEmptyScreen>` based on `hasHistory`. Wraps all post-splash screens in a layout with `<BottomNav>` anchored at the bottom. Passes `navigate(screen)` down as prop.

### Component: `Button.tsx`
Variants: `primary` (brand green, full-width, 56px height, Outfit semibold), `secondary` (white bg, brand border), `outline` (transparent), `destructive` (red), `disabled` (muted). All have 48px+ touch targets.

### Component: `MetricCard.tsx`
Shows icon + large value (Outfit 700, 32px) + label (Inter, muted). Three variants: moisture (blue icon), temperature (amber icon), humidity (blue icon). Used in sensor screen, home, result, history detail.

### Component: `InsightChart.tsx`
Pure SVG line chart (no external library). Accepts `data: number[]`, `color: string`, `label: string`. Draws a smooth polyline on a minimal grid. Simple and readable — not a full charting library.

### Component: `StatusBadge.tsx`
Pill badge. States: `healthy` (green bg), `attention` (amber bg), `warning` (red bg), `connected` (green dot), `disconnected` (red dot), `loading` (gray animated).

### Component: `ProgressStep.tsx`
Four states: done (green check), active (animated spinner dot), pending (empty circle). Used in SensorScreen and AIAnalysisScreen.

### Screen: `SplashScreen`
- Full-height warm ground
- Center: SVG leaf/seedling motif (drawn in JSX)
- Outfit 700 "Smart Crop Guardian", Inter "Offline Crop Health Assistant"
- Subtle fade-in animation via CSS
- Auto-advances after 2000ms

### Screen: `HomeScreen`
- TopBar: "Good evening" + greeting
- `CropStatusCard`: status badge + "Last checked" timestamp
- Large primary Button: "CHECK MY CROP"
- "Field Conditions" section: 3× `MetricCard` in a row
- "Latest Observation" card: result + timestamp
- Insight teaser: text + "View Insights" link

### Screen: `HomeEmptyScreen`
- Centered empty state with seedling icon
- "No crop checks yet" + explanation
- Large "CHECK MY CROP" CTA

### Screen: `SensorScreen`
- Three sub-states: `connecting` (animated steps), `connected` (readings + CONTINUE), `disconnected` (error + TRY AGAIN)
- `ProgressStep` list for connecting flow
- MetricCards shown once connected

### Screen: `CropPhotoScreen`
- Rounded camera viewfinder rectangle (dark bg placeholder)
- Instruction list (3 items)
- "TAKE PHOTO" → simulates capture → shows preview + RETAKE / USE PHOTO

### Screen: `AIAnalysisScreen`
- Minimal centered layout
- `ProgressStep` list with gentle entrance animation
- Steps auto-advance every 800ms

### Screen: `CropResultScreen`
- `AIResultCard` (prominent — amber for attention, red for warning, green for healthy)
- Confidence shown as "86% confidence" in muted Inter below condition name
- AI disclaimer note in muted text
- Field Conditions (3× MetricCard compact)
- "What this means" + "Recommended Next Step" sections
- Primary: "SAVE & VIEW REPORT", Secondary: "CHECK AGAIN"

### Screen: `SavedReportScreen`
- Polished card layout
- Photo thumbnail (rounded)
- All readings
- Recommendation
- "Added to crop history" success badge
- Back button to Home

### Screen: `HistoryScreen`
- Grouped by month
- `HistoryItem` rows: date + badge + 3 readings compact
- Filter chips: All / Healthy / Attention / Warning
- Each item navigates to HistoryDetailScreen

### Screen: `HistoryDetailScreen`
- Large photo (rounded, 16:9)
- AI observation + confidence
- MetricCards
- Recommendation
- Back chevron

### Screen: `InsightsScreen`
- Overall status card (amber/green)
- 3× section: label + trend arrow + `InsightChart`
- "View Overall Analysis" CTA

### Screen: `OverallAnalysisScreen`
- "Your crop needs attention" headline
- Explanation paragraph (cautious language)
- "What changed?" bullet list
- "What to monitor" paragraph

### Screen: `InsightsInsufficient`
- Chart icon + "Not enough history yet"
- "Complete a few more crop checks..."

### Screen: `InsightsEmpty`
- Seedling icon + "Your crop story starts here"
- "CHECK MY CROP" CTA

### Screen: `SettingsScreen`
- Section list: Field Sensor, Crop, Data, App, About
- Each section has rounded card with rows separated by thin dividers
- Rows: label + right chevron or toggle

### Screen: `AboutScreen`
- App name + version
- AI, Software, Hardware sections
- Disclaimer block (muted text, slightly smaller)

### Screen: `ErrorScreen`
- Props: `type`, title, message, action label
- Centered icon (red/amber) + headline + message + CTA

---

## Mock Data (`src/data/mockData.ts`)

```ts
export const historyRecords = [
  { id: '1', date: '2026-09-24', result: 'attention', condition: 'Possible Early Blight',
    confidence: 86, moisture: 41, temp: 28.7, humidity: 64,
    recommendation: 'Inspect affected leaves and continue monitoring.' },
  { id: '2', date: '2026-09-21', result: 'healthy', condition: 'Healthy',
    confidence: 94, moisture: 47, temp: 27.9, humidity: 61,
    recommendation: 'Crop appears healthy. Continue regular monitoring.' },
  { id: '3', date: '2026-09-18', result: 'healthy', condition: 'Healthy',
    confidence: 91, moisture: 53, temp: 27.2, humidity: 57,
    recommendation: 'Crop appears healthy. Continue regular monitoring.' },
  { id: '4', date: '2026-09-14', result: 'healthy', condition: 'Healthy',
    confidence: 89, moisture: 58, temp: 26.8, humidity: 55,
    recommendation: 'Crop appears healthy. Continue regular monitoring.' },
]
```

---

## Verification

After implementation:
1. Load the app in the preview panel — confirm splash auto-advances to Home
2. Navigate through all 5 bottom nav tabs
3. Run the full crop check flow: Home → Sensor → Photo → Analysis → Result → Saved
4. Open a history item and verify the detail screen
5. Toggle the `hasHistory` flag to test empty states
6. Verify all touch targets feel comfortable at 390px width
7. Check typography hierarchy: Outfit for headings/values, Inter for body
8. Confirm no `@import` CSS ordering violations (Google Fonts first)
