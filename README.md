## Demo

[![Watch Demo](https://img.youtube.com/vi/DtgI_douClg/maxresdefault.jpg)](https://www.youtube.com/shorts/DtgI_douClg)

# Death Clock AI Clone

A viral mobile app that predicts a user's lifespan based on lifestyle data and presents the result in a dramatic, ominous reveal experience. Built with React Native/Expo, featuring a plague doctor theme, live countdown timer, and swipeable result cards.

## 🎯 Project Overview

**Death Clock** is a full production-ready MVP that follows a three-phase psychological UX flow:

1. **Investment** — Users answer 30 lifestyle questions across 9 categories
2. **Suspense** — Dramatic calculation sequence with animated messages
3. **Reveal** — Predicted death date emerges with live countdown and longevity score
4. **Dashboard** — Swipeable photo cards, actionable health tips, and improved lifestyle projections

---

## 🏗️ Architecture

### Tech Stack

**Mobile:**
- React Native 0.81.5
- Expo SDK 54.0.33
- React 19.1.0
- TypeScript
- React Navigation v7 (native stack)
- Reanimated 4.1.1 (animations)
- Expo AV (background music)

**Backend (Optional):**
- Node.js / Express
- PostgreSQL
- Python Flask (prediction microservice)

**Deployment:**
- Expo EAS cloud builds (no Mac required)
- Render or Railway for backend

---

## 📁 Project Structure

```
deathClock/
├── app/
│   ├── assets/
│   │   ├── background-music.wav          # Looping ambient music (user uploads real file)
│   │   ├── plague-doctor.png             # Plague doctor image (user uploads)
│   │   └── [icon, splash, etc]
│   ├── src/
│   │   ├── screens/
│   │   │   ├── SplashScreen.tsx          # Spinning hourglass with particle effects
│   │   │   ├── LandingScreen.tsx         # CTA + feature highlights
│   │   │   ├── QuestionnaireScreen.tsx   # 30 auto-advancing questions + pendulum
│   │   │   ├── CalculationScreen.tsx     # Suspense animation (7 messages)
│   │   │   ├── RevealScreen.tsx          # Timed death date reveal
│   │   │   ├── DashboardScreen.tsx       # Swipeable cards + all health tips
│   │   │   ├── InsightDetailScreen.tsx   # Deep content for each tip
│   │   │   └── ShareScreen.tsx           # Shareable results
│   │   ├── components/
│   │   │   ├── ProgressBar.tsx           # Animated progress indicator
│   │   │   ├── MicroReward.tsx           # Toast messages during questions
│   │   │   ├── CountdownTimer.tsx        # Live Y:D:H:M:S countdown
│   │   │   └── ShareCard.tsx             # Result visualization
│   │   ├── navigation/
│   │   │   └── AppNavigator.tsx          # Stack navigator (Splash → Landing → ...)
│   │   ├── services/
│   │   │   └── api.ts                    # Prediction engine + insights generation
│   │   ├── data/
│   │   │   ├── questions.ts              # 30 lifestyle questions
│   │   │   └── insightDetails.ts         # Deep content for all 8 tips
│   │   ├── theme/
│   │   │   └── index.ts                  # Dark theme with neon blue accent
│   │   └── types/
│   │       └── index.ts                  # TypeScript interfaces
│   ├── App.tsx                           # Root with audio management
│   ├── app.json                          # Expo config
│   ├── package.json
│   └── tsconfig.json
├── backend/                              # Express API (optional)
├── prediction-service/                   # Python Flask service (optional)
├── CLAUDE.md                             # Original project brief
└── README.md                             # This file
```

---

## 🎮 User Flow

```
Splash (3.5s)
  ↓
Landing (CTA button)
  ↓
Questionnaire (30 questions, auto-advance)
  - Category badges (Demographics, Exercise, Diet, Sleep, Habits, etc.)
  - Single choice, slider, number, or date input types
  - Fake poll percentages ("Based on other users' responses")
  - Swinging hourglass pendulum at bottom (gravity-physics animation)
  - Back button to review previous answers
  ↓
Calculation (11.3s, suspense animations)
  - 7 dramatic messages with icons
  - Spinning ring + pulsing orb
  - Progress bar
  ↓
Reveal (timed sequence)
  - "Based on your lifestyle..."
  - "Your predicted death date is"
  - Scaled date appearance with glow
  - Days remaining + longevity score badge
  ↓
Dashboard (main content)
  - Live countdown (years:days:hrs:min:sec)
  - 4 swipeable photo cards
    • Memento Mori: Current death date & age
    • Memento Vivere: Projected death date if lifestyle improves
    • Stats: Days/weeks/months/years remaining
    • Score: Longevity score out of 100
  - All 8 health tips (both "needs improvement" + "well done")
  - Tap any tip to open detailed content
  - Action buttons: "Share Your Fate" & "Reevaluate your fate.."
  ↓
Share (optional)
  - Copy/share result text + formatted date
  ↓
InsightDetail (deep dive on each tip)
  - 3 detailed content sections with bullet points
  - Quick action callout
  - Back navigation
```

---

## 🧬 Core Features

### 1. Prediction Engine (`src/services/api.ts`)

**Local calculation** (no server dependency):
- Base life expectancy: 76 years (male) / 81 years (female)
- Lifestyle impact scores: ±3 to ±8 years per response
- BMI adjustment: ±2 to ±5 years (underweight, healthy, overweight, obese)
- **Formula:** `predictedLifespan = BASE + lifestyle_impact + bmi_adjustment` (clamped 40–110 years)
- Death date: `birthDate + predictedLifespan` (with sanity checks)
- Longevity score: 0–100 based on deviation from 78-year average

**Robust date parsing:**
- Accepts YYYY-MM-DD, MM-DD-YYYY, or raw 8 digits
- Validates year (1900–2025), month (1–12), day (1–31)
- Prevents garbage dates like year 297

### 2. Questionnaire (`src/screens/QuestionnaireScreen.tsx`)

**Auto-advance system** (no Next button):
- **Single choice:** Tap → highlight → 600ms delay → auto-advance
- **Slider:** Tap value → 800ms delay → auto-advance
- **Number:** Valid input → dismiss keyboard → 1.2s delay → advance
- **Date (MM-DD-YYYY):** Auto-formatted with dashes → 8 digits valid → advance

**Visual feedback:**
- Category badges on first question of each section (with icon + description)
- Question number pill (Q1, Q2, etc.)
- Fake poll percentages after answering ("Based on other users' responses")
- Back button with reverse animation (removes response from history)

**Pendulum animation:**
- Swinging hourglass at bottom of screen
- Gravity-physics motion using sine-wave interpolation
- 21-point interpolation range: slowest at peaks (±28°), fastest at center
- Seamless loop (no abrupt resets)

### 3. Calculation (`src/screens/CalculationScreen.tsx`)

**Suspense sequence:**
1. Analyzing your lifestyle data
2. Comparing with population datasets
3. Evaluating genetic factors
4. Processing health indicators
5. Running actuarial models
6. Estimating life expectancy
7. Calculating your death date

Each message appears for ~1.5s with step indicators. Total: ~11.3s before transition to Reveal.

### 4. Dashboard (`src/screens/DashboardScreen.tsx`)

**Plague doctor theme:**
- Dark colors: #050508 background, #AA3333 accent red
- Plague doctor image in header, on photo cards, and beside tips section
- Ornate card designs with skull motifs (☠)
- Roman numerals for "prescription" numbering (I, II, III, etc.)

**Swipeable photo cards:**
- Horizontal scroll with dot indicators
- 4 cards:
  1. **Memento Mori** (red) — Current projected death date
  2. **Memento Vivere** (green) — Projected date if lifestyle improves (+18y 2m 3d)
  3. **Your Remaining Time** (blue) — Days/weeks/months/years left
  4. **The Doctor's Verdict** (color-based on score) — Longevity score 0–100

**Health tips (ALL 8 shown):**
- **Negative impact tips:** Roman numeral, ominous phrasing ("Read the prescription →")
- **Positive impact tips:** Green checkmark, "WELL DONE" badge, celebratory phrasing ("Learn why this matters →")
- Tap any tip to open detailed content with deep explanations

### 5. Insights (`src/data/insightDetails.ts`)

Eight comprehensive guides:
1. **Quit Smoking** — Damages, timeline, strategies
2. **Move More** — Benefits, targets, best exercises
3. **Optimize Sleep** — Why sleep matters, sleep stages, habits
4. **Eat Better** — Foods to eat/avoid, caloric guidelines
5. **Manage Stress** — Damage, techniques, resilience building
6. **Build Connections** — Why relationships matter, types, how to strengthen
7. **Moderate Alcohol** — Risks, harm reduction, benefits of cutting back
8. **Stay Hydrated** — Why water matters, intake guidelines, tips

Each includes:
- Icon + headline
- Intro paragraph
- 3 detailed sections with bullet points
- "Quick Action" callout

### 6. Background Music (`App.tsx`)

**Crossfade loop system:**
- Plays looping ambient music (audio file starts silent, plays, fades out 2.5s before end)
- **Fade-in:** On app launch, volume 0 → 0.4 over 2 seconds (20 steps × 100ms)
- **Fade-out:** Last 2.5s of track, volume 0.4 → 0 over 2 seconds
- **Seamless restart:** When track finishes, position resets to 0, volume resets to 0, fades back in
- Volume adjustable via `TARGET_VOLUME` constant
- Fade duration adjustable via `FADE_DURATION` constant

**Audio lifecycle:**
- Initializes on app mount
- Plays continuously across all screens
- Unloads on app unmount
- Gracefully fails on web/unsupported platforms

---

## 📊 Data Flow

### Questionnaire → Calculation → Reveal

```
30 Question Responses (UserResponse[])
  └─ questionId: string
  └─ answer: string
  └─ impact: number (±3 to ±8)
     ↓
[CalculationScreen calls calculateLocalPrediction()]
     ↓
Prediction Engine computes:
  - Birth date (robust parsing from MM-DD-YYYY)
  - Sex-based base expectancy (76 or 81)
  - Sum of lifestyle impacts
  - BMI adjustment from height + weight
  - Death date = birthDate + predictedLifespan
  - Longevity score = 50 + (deviation × 3)
  - Generate ALL 8 insights (negative + positive)
     ↓
PredictionResult {
  userId: 'local'
  predictedLifespan: number
  deathDate: 'YYYY-MM-DD'
  daysRemaining: number
  longevityScore: 0–100
  insights: LongevityInsight[]
}
     ↓
[Pass to Reveal, Dashboard, Share screens]
```

### Question Categories & Impact

| Category | Icon | Questions | Impact Range |
|----------|------|-----------|--------------|
| Demographics | 👤 | Age, sex, height, weight | -2 to +2 |
| Exercise | 🏃 | Frequency, type, steps, sitting | -3 to +3 |
| Diet | 🥗 | Quality, fruits, water, processed, sugar | -3 to +2 |
| Sleep | 😴 | Hours, quality, consistency | -2 to +2 |
| Habits | ⚡ | Smoking, alcohol, drugs, sunscreen, seatbelt | -8 to +1 |
| Mental Health | 🧠 | Stress, happiness, mindfulness, purpose | -3 to +2 |
| Social | 🤝 | Relationships, marital status, pets | -3 to +3 |
| Medical | 🏥 | Family longevity, chronic conditions | -5 to +3 |

---

## 🎨 Theme & Styling

**Dark theme** (`src/theme/index.ts`):
- Background: `#000000`
- Surface: `#0A0A0F`
- Primary (accent): `#00D4FF` (neon blue)
- Secondary: `#7B2FBE` (purple)
- Text: `#FFFFFF`
- Danger (for negative tips): `#FF4444`
- Success (for positive tips): `#00FF88`

**Plague doctor accents:**
- Blood red: `#AA3333`
- Dark reds: `#331111`, `#1A1118`

**Spacing scale:**
- xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ & npm
- Expo CLI: `npm install -g expo-cli`
- No Mac required (Expo EAS handles iOS builds in cloud)

### Installation

```bash
cd app
npm install
```

### Running the App

**Expo Go (instant preview):**
```bash
npm run start
# Scan QR code with Expo Go app (iOS/Android)
```

**Web preview:**
```bash
npm run web
# Opens http://localhost:19000 in browser
```

**Development mode (tunnel):**
```bash
npm run dev
# Works over internet with Expo tunnel
```

### Customization

**Replace placeholder assets:**
1. **Background music:** Overwrite `app/assets/background-music.wav` with your audio file
2. **Plague doctor image:** Overwrite `app/assets/plague-doctor.png` with your image
   - If using `.jpg`, update `require()` in `DashboardScreen.tsx` line ~20

**Tweak audio crossfade:**
In `App.tsx`, adjust these constants:
```typescript
const TARGET_VOLUME = 0.4;      // Normal playback volume
const FADE_DURATION = 2000;     // Fade in/out duration (ms)
const FADE_OUT_BUFFER = 2500;   // Start fade-out this many ms before end
```

**Adjust prediction model:**
In `src/services/api.ts`:
```typescript
const BASE_EXPECTANCY = sex === 'female' ? 81 : 76; // Change base years
const predictedLifespan = Math.max(40, Math.min(110, rawLifespan)); // Clamp range
```

---

## 🔧 Development

### TypeScript Types

All types in `src/types/index.ts`:
- `Question` — Questionnaire question definition
- `UserResponse` — Answer + impact score
- `PredictionResult` — Full prediction output
- `LongevityInsight` — Health tip with category
- `RootStackParamList` — Navigation stack routes

### Key Animations

**Pendulum gravity motion:**
```typescript
// 21-point sine-wave interpolation (slowest at peaks, fastest at center)
rotate: pendulumAnim.interpolate({
  inputRange: [0, 0.05, 0.1, ..., 1],
  outputRange: ['0deg', '9.3deg', '17.6deg', ..., '0deg'],
})
```

**Audio crossfade:**
```typescript
// Smooth fade across 20 steps over 2 seconds
fadeVolume(from: number, to: number, onComplete?: () => void)
// Called on startup, near loop end, and at loop restart
```

---

## 📱 Tested On

- **iOS:** Expo Go app (no physical Apple device needed)
- **Android:** Expo Go + Android Emulator
- **Web:** Chrome/Safari (limited audio support)

---

## ⚠️ Disclaimers

The app includes prominent disclaimers:
> "This app is for entertainment purposes only and is not medical advice. Results are based on statistical averages and should not replace professional health guidance."

Users should understand:
- Predictions are **entertainment only**
- Based on simplified lifestyle model, not actual medical science
- Does not replace doctor consultation or professional health advice

---

## 📝 License

This is a commercial MVP. All code and assets are proprietary.

---

## 🎬 Next Steps

- Deploy via EAS: `eas build -p ios` / `eas build -p android`
- Set up backend API (optional, not required for MVP)
- Add blood test data integration
- Implement user accounts + cloud save
- Analytics + crash reporting
- App store submission

---

## 📧 Support

For questions about the codebase, refer to `CLAUDE.md` for the original project brief.
