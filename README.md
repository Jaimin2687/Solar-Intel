<div align="center">

# ☀️ Solar Intel

### AI-Powered Solar Fleet Monitoring & Analytics Platform

**Built for HackaMined Hackathon**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://mongooseatlas.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

</div>

---

## 🌟 What is Solar Intel?

Solar Intel is a **full-stack, real-time solar farm management platform** that gives operators complete visibility into their solar fleet. It combines live telemetry, AI-generated health predictions, carbon impact tracking, weather-aware forecasting, and anomaly detection — all in one unified dashboard.

Designed with a focus on **actionable intelligence**, it doesn't just show data — it tells you what's wrong, why it matters, and what to do next.

---

## 🏆 Built for HackaMined

This project was created as a submission for **HackaMined** — a hackathon focused on mining intelligence from real-world data to create impactful solutions. Solar Intel addresses the challenge of making renewable energy infrastructure smarter, more observable, and globally accessible.

**Key hackathon pillars addressed:**
- 🔍 **Data Mining** — Continuous telemetry ingestion and pattern analysis
- 🤖 **AI Integration** — GPT-powered anomaly classification and maintenance prioritization
- 🌍 **Global Accessibility** — 15-language real-time translation across every page
- ♻️ **Sustainability** — Carbon offset tracking and grid synchronization quality metrics

---

## ✨ Features

### 🏠 Dashboard
- Real-time fleet overview with animated metric cards
- Live inverter health ring gauges
- AI-generated risk scores for each inverter
- Performance trend charts (7-day, 30-day, 90-day)

### 📊 Analytics
- Deep-dive energy production tables per inverter
- Efficiency benchmarking and performance ratio tracking
- Capacity factor analysis and peak output comparisons
- Exportable time-series data views

### 🤖 AI Insights
- GPT-4 powered health summaries per inverter
- Natural language failure reasoning
- Prioritized maintenance recommendations
- Confidence scores and risk classifications (critical / high / medium / low)

### ⚡ Anomaly Detection
- Real-time parameter deviation monitoring
- Smart alert severity scoring
- Filterable anomaly log (by inverter, severity, date)
- Historical anomaly trend tracking

### 🌤️ Forecast
- 48-hour solar generation forecast
- Weather-aware output prediction (temperature, cloud cover, UV index)
- Hourly generation curves with confidence bands
- KPI projections for tomorrow and next 7 days

### ♻️ Carbon Impact
- Daily CO₂ avoidance tracking (30-day rolling)
- Real-world equivalents (trees planted, cars removed, homes powered)
- Monthly YoY carbon offset comparison
- Net metering earnings calculation

### 🔧 Maintenance
- AI-prioritized task queue
- Status tracking (pending → in-progress → completed)
- Priority badges (critical / high / medium / low)
- Estimated effort and notes per task

### 🔒 Security / Grid
- Grid synchronization quality gauges
- Frequency deviation and voltage stability metrics
- Reactive power monitoring
- Historical grid event log

### ⚙️ Settings
- User profile management
- Subscription tier and feature overview
- Notification preferences (email, push, anomaly alerts)
- Connected device management

### 🌐 Multi-Language Support (15 Languages)
Every page — including **dynamic AI-generated content** — translates in real time:

| Language | Code | Language | Code |
|----------|------|----------|------|
| English | `en` | Hindi | `hi` |
| Spanish | `es` | French | `fr` |
| German | `de` | Japanese | `ja` |
| Chinese (Simplified) | `zh` | Arabic | `ar` |
| Portuguese | `pt` | Russian | `ru` |
| Korean | `ko` | Italian | `it` |
| Dutch | `nl` | Turkish | `tr` |
| Polish | `pl` | | |

- Uses a **two-tier translation approach**: Cloud Translation v2 (if enabled) → free Google Translate endpoint fallback
- **Server-side caching** — translated strings are cached in memory, no redundant API calls
- **Client-side batching** — all `<TranslatedText>` instances on a page fire one single batch request with 60ms debounce
- **Instant English** — zero API calls when language is `en`

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS + Radix UI primitives |
| **Animations** | Framer Motion |
| **Charts** | Tremor |
| **Database** | MongoDB via Mongoose |
| **Auth** | NextAuth.js v4 |
| **Email** | Nodemailer |
| **AI** | OpenAI GPT-4 (ai-advisor service) |
| **Logging** | Winston |
| **Rate Limiting** | express-rate-limit |
| **HTTP Client** | Axios + fetch |
| **State / Fetching** | TanStack React Query v5 |

---

## 📁 Project Structure

```
solar-intel/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Dashboard (home)
│   │   ├── analytics/              # Energy analytics
│   │   ├── ai-insights/            # AI health insights
│   │   ├── anomalies/              # Anomaly detection
│   │   ├── forecast/               # 48-hour solar forecast
│   │   ├── carbon/                 # Carbon impact tracker
│   │   ├── maintenance/            # Maintenance task queue
│   │   ├── security/               # Grid security & sync
│   │   ├── settings/               # User settings
│   │   └── api/                    # API route handlers
│   │       ├── ai-advisor/         # GPT-4 health summaries
│   │       ├── analytics/          # Analytics aggregation
│   │       ├── auth/               # NextAuth endpoints
│   │       ├── dashboard/          # Dashboard metrics
│   │       ├── email/              # Email notifications
│   │       ├── grid/               # Grid sync data
│   │       ├── health/             # System health check
│   │       ├── inverters/          # Inverter CRUD
│   │       ├── live-energy/        # Real-time energy feed
│   │       ├── seed/               # DB seed trigger
│   │       ├── telemetry/          # Telemetry ingestion
│   │       ├── translate/          # Translation proxy
│   │       ├── user/               # User management
│   │       └── weather/            # Weather data
│   │
│   ├── backend/                    # Server-side services
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── Inverter.ts
│   │   │   ├── Telemetry.ts
│   │   │   └── User.ts
│   │   ├── services/               # Business logic layer
│   │   │   ├── ai-advisor.service.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── inverter.service.ts
│   │   │   ├── live-energy.service.ts
│   │   │   ├── telemetry.service.ts
│   │   │   ├── weather.service.ts
│   │   │   └── ...
│   │   ├── middleware/             # Auth + rate limiting
│   │   └── config/                 # DB + env configuration
│   │
│   ├── components/                 # React components
│   │   ├── AppShell.tsx            # Root layout shell
│   │   ├── DashboardGrid.tsx       # Main dashboard layout
│   │   ├── dashboard/              # Dashboard widgets
│   │   ├── layout/                 # Header + Sidebar
│   │   └── ui/                     # Reusable UI primitives
│   │
│   ├── lib/                        # Utilities & config
│   │   ├── auth.ts                 # NextAuth configuration
│   │   ├── mock-data.ts            # Seed/demo data
│   │   ├── utils.ts                # Shared helpers
│   │   └── i18n/                   # Internationalization
│   │       ├── context.tsx         # Language context provider
│   │       ├── locales.ts          # Supported locales list
│   │       ├── translate-api.ts    # Client-side batch translator
│   │       └── translations.ts     # Static translation keys
│   │
│   └── types/
│       └── index.ts                # Global TypeScript types
│
├── scripts/
│   └── seed-db.ts                  # Database seeder
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **MongoDB** Atlas account (or local MongoDB instance)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/Jaimin2687/Solar-Intel.git
cd Solar-Intel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# ── Database ──────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/solar-intel

# ── Authentication ─────────────────────────────────────────
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# ── Email (Nodemailer) ─────────────────────────────────────
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
EMAIL_FROM=Solar Intel <your@gmail.com>

# ── OpenAI (AI Insights) ───────────────────────────────────
OPENAI_API_KEY=sk-...

# ── Weather API ────────────────────────────────────────────
OPENWEATHER_API_KEY=your_openweather_key

# ── Translation (optional — free endpoint is used if omitted/disabled) ──
GOOGLE_TRANSLATE_API_KEY=your_google_translate_key
```

> **Note on Translation:** The app uses the free `translate.googleapis.com` endpoint by default — no API key or billing required. The `GOOGLE_TRANSLATE_API_KEY` is only used as a primary tier if the Cloud Translation API is enabled in your Google Cloud project; the free endpoint is always the fallback.

### 4. Seed the Database

```bash
npm run seed
```

This populates MongoDB with realistic inverter data, telemetry records, and user accounts for demo purposes.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Translation Architecture

Solar Intel supports **full-site translation** — both static UI labels and dynamic database content (AI summaries, inverter names, anomaly descriptions, maintenance notes) are translated on language switch.

```
User switches language
        │
        ▼
Language Context updates (React Context)
        │
        ▼
All <TranslatedText> components fire (60ms debounce batching)
        │
        ▼
Single POST /api/translate  ──→  Check server-side cache (Map)
        │                              │
        │                     (cache hit) ──→ return instantly
        │
        ▼
Free Google Translate endpoint
(translate.googleapis.com/translate_a/single)
        │
        ▼
Results cached server-side + returned to client
        │
        ▼
Client-side cache updated (translateCache Map)
        │
        ▼
UI re-renders with translated text
```

**Endpoints used:**
- Primary: `https://translation.googleapis.com/language/translate/v2` (if API key is active)  
- Fallback: `https://translate.googleapis.com/translate_a/single?client=gtx` (free, no key required)

---

## 🔑 API Routes Reference

| Route | Method | Description |
|-------|--------|-------------|
| `/api/dashboard` | GET | Aggregated dashboard metrics |
| `/api/inverters` | GET / POST / PUT / DELETE | Inverter CRUD |
| `/api/telemetry` | GET / POST | Telemetry data |
| `/api/analytics` | GET | Analytics aggregation |
| `/api/ai-advisor` | GET | GPT-4 health summaries |
| `/api/live-energy` | GET | Real-time energy readings |
| `/api/weather` | GET | Current weather data |
| `/api/grid` | GET | Grid synchronization metrics |
| `/api/translate` | POST | Batch translation proxy |
| `/api/email` | POST | Email notification trigger |
| `/api/health` | GET | System health check |
| `/api/seed` | POST | Trigger DB seed (dev only) |
| `/api/auth/[...nextauth]` | * | NextAuth.js auth endpoints |
| `/api/user` | GET / PUT | User profile management |

---

## 📸 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Live fleet overview, risk scores, trend charts |
| Analytics | `/analytics` | Detailed energy analytics per inverter |
| AI Insights | `/ai-insights` | GPT-4 health summaries and recommendations |
| Anomalies | `/anomalies` | Real-time deviation alerts and anomaly log |
| Forecast | `/forecast` | 48-hour weather-aware generation forecast |
| Carbon | `/carbon` | CO₂ avoidance and carbon offset tracking |
| Maintenance | `/maintenance` | AI-prioritized maintenance task queue |
| Security | `/security` | Grid sync quality and security events |
| Settings | `/settings` | Profile, notifications, connected devices |

---

## 🛠️ Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Seed the database with demo data
npm run seed
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Jaimin** — Built with ❤️ for **HackaMined**

---

<div align="center">
  <strong>☀️ Solar Intel — Making solar smarter, one watt at a time.</strong>
</div>


