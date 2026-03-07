<div align="center">

# ☀️ Solar Intel

### AI-Powered Solar Plant Monitoring & Predictive Maintenance Platform

**Built for HACKaMINeD 2026**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-ML_Service-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-f55036)](https://groq.com)
[![Tests](https://img.shields.io/badge/Tests-20_passing-brightgreen)](.)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](.)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**[Live Demo →](https://solar-intel-six.vercel.app)**

</div>

---

## 🌟 What is Solar Intel?

Solar Intel is a **full-stack intelligent solar plant management platform** that provides complete visibility into multi-plant solar operations. It combines **ML-powered predictive maintenance** (95.3% accuracy), **RAG-grounded conversational AI**, **agentic autonomous workflows**, and **15-language internationalization** — all backed by real MongoDB data and a dedicated FastAPI ML microservice.

**It doesn't just show data — it predicts failures before they happen, explains why in plain English, and auto-generates maintenance tickets.**

---

## 🏆 Built for HACKaMINeD 2026

| Hackathon Pillar | How We Address It |
|-----------------|-------------------|
| 🔍 **Data Mining** | Real solar plant telemetry ingestion from CSV/Excel, 51-feature ML pipeline |
| 🤖 **GenAI** | Groq Llama 3.3 70B generates operational narratives from ML predictions |
| 🧠 **RAG Pipeline** | Entity extraction → MongoDB context retrieval → grounded LLM Q&A with sources |
| 🤖 **Agentic AI** | 4-step autonomous workflow: Data → Risk Assessment → Ticket Drafting → Summary |
| 📊 **ML Model** | HistGradientBoosting classifier, SHAP explanations, FastAPI microservice |
| 🌍 **Global Accessibility** | 15-language real-time translation across every page |
| 🐳 **Production Ready** | Docker multi-container deployment, 20 unit tests, comprehensive docs |

---

## ✨ Core Features

### 🏭 Plant-Based Architecture
- **Multi-plant management** — 3 solar plants, each with dedicated inverter fleets
- **Plant overview** — aggregated metrics per plant (total power, health score, risk level)
- **Drill-down** — click any plant to see its inverter fleet

### 📥 CSV/Excel Data Import
- **Drag-and-drop** file upload for plant and inverter data
- **Auto-detection** — system identifies whether file contains plant or inverter data
- **Column normalization** — handles camelCase, spaces, special characters automatically
- **Bulk upsert** — imported data flows directly to MongoDB

### 🤖 ML Predictive Maintenance
- **HistGradientBoosting** classifier trained on real solar data (95.3% accuracy, AUC-ROC 0.981)
- **51 feature engineering** — DC/AC power ratios, irradiation, temperature, module efficiency
- **SHAP explanations** — top-5 contributing factors for every prediction
- **FastAPI microservice** — `/predict`, `/predict/batch`, `/health` endpoints

### 💬 RAG + Agentic AI Chat
- **RAG Pipeline** — entity extraction → MongoDB context → grounded LLM responses with source citations
- **Agent Mode** — autonomous 4-step workflow:
  1. 📊 Data Retrieval — pulls plant/inverter/telemetry context
  2. ⚠️ Risk Assessment — ML-powered risk evaluation
  3. 🎫 Ticket Drafting — auto-generates maintenance tickets
  4. 📋 Executive Summary — synthesized report
- **Conversational UI** — multi-turn chat with suggestion chips, agent action cards

### 📊 GenAI Narrative Intelligence
- **Groq Llama 3.3 70B** generates plain-English operational reports
- **3-tier fallback** — ML+Groq → ML-only → rule-based (never fails)
- Confidence scores, risk classifications, prioritized recommendations

### 🏠 Dashboard & Analytics
- Real-time fleet KPIs with animated metric cards
- Risk matrix and status distribution
- Performance trend charts (7-day, 30-day, 90-day)
- Weather integration (Open-Meteo)

### ⚡ Anomaly Detection & Forecast
- Real-time parameter deviation monitoring with severity scoring
- 48-hour solar generation forecast (weather-aware)

### ♻️ Carbon Impact
- Daily CO₂ avoidance tracking, real-world equivalents (trees, cars, homes)

### 🔧 Maintenance
- AI-prioritized task queue with status tracking

### 🌐 15-Language Support
Every page translates in real time — including dynamic AI-generated content:

| Language | Code | Language | Code |
|----------|------|----------|------|
| English | `en` | Hindi | `hi` |
| Spanish | `es` | French | `fr` |
| German | `de` | Japanese | `ja` |
| Chinese | `zh` | Arabic | `ar` |
| Portuguese | `pt` | Russian | `ru` |
| Korean | `ko` | Italian | `it` |
| Dutch | `nl` | Turkish | `tr` |
| Polish | `pl` | | |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│  Frontend — Next.js 14 (React 18 + TailwindCSS)           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌─────┐ ┌──────┐ ┌────────┐  │
│  │Dash  │ │Plants│ │Invert│ │Chat │ │AI Adv│ │+6 more │  │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬──┘ └──┬───┘ └──┬─────┘  │
├─────┼────────┼────────┼────────┼───────┼────────┼─────────┤
│  API Routes (17 Next.js Route Handlers)                    │
├────────────────────────────────────────────────────────────┤
│  Backend Services                                          │
│  ┌─────────┐ ┌──────┐ ┌───────┐ ┌──────┐ ┌────────────┐  │
│  │Dashboard│ │Plants│ │ML Pred│ │RAG   │ │Agent (Auto)│  │
│  └────┬────┘ └──┬───┘ └──┬────┘ └──┬───┘ └──┬─────────┘  │
├───────┼─────────┼────────┼─────────┼────────┼─────────────┤
│  ┌────┴─────┐ ┌─┴────────┴──┐ ┌───┴────┐ ┌─┴───────────┐│
│  │FastAPI ML│ │MongoDB Atlas│ │Groq LLM│ │Open-Meteo   ││
│  │:8000     │ │             │ │Llama3.3│ │Weather API  ││
│  └──────────┘ └─────────────┘ └────────┘ └─────────────┘│
└────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TailwindCSS, Framer Motion, Tremor |
| **Backend** | Next.js API Routes, Mongoose 9 |
| **Database** | MongoDB Atlas |
| **ML Model** | scikit-learn HistGradientBoostingClassifier + SHAP |
| **ML API** | FastAPI + Uvicorn (Python 3.12) |
| **LLM** | Groq — Llama 3.3 70B Versatile |
| **Auth** | NextAuth.js v4 (Google OAuth + Credentials) |
| **i18n** | 15 languages (Google Translate free endpoint) |
| **Import** | PapaParse (CSV) + SheetJS (Excel) |
| **Testing** | Jest + ts-jest (20 tests, 3 suites) |
| **Deployment** | Docker (multi-stage) + Vercel |

---

## 📁 Project Structure

```
solar-intel/
├── src/
│   ├── app/                        # Next.js pages (11 routes)
│   │   ├── page.tsx                # Dashboard
│   │   ├── plants/                 # Plant overview + import UI
│   │   ├── chat/                   # RAG + Agent chat interface
│   │   ├── ai-insights/            # GenAI health narratives
│   │   ├── analytics/              # Energy analytics
│   │   ├── anomalies/              # Anomaly detection
│   │   ├── forecast/               # Solar forecast
│   │   ├── carbon/                 # Carbon tracking
│   │   ├── maintenance/            # Maintenance queue
│   │   ├── security/               # Grid security
│   │   ├── settings/               # Settings
│   │   └── api/                    # 17 API route handlers
│   │       ├── chat/               # RAG + Agent chat
│   │       ├── import/             # CSV/Excel import
│   │       ├── plants/             # Plant CRUD
│   │       ├── predict/            # ML prediction proxy
│   │       ├── ai-advisor/         # GenAI narrative
│   │       └── ...                 # + 12 more
│   │
│   ├── backend/
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── Plant.ts            # Plant model
│   │   │   ├── Inverter.ts         # Inverter model (with plantId)
│   │   │   ├── Telemetry.ts        # Time-series telemetry
│   │   │   └── User.ts
│   │   └── services/               # Business logic
│   │       ├── rag.service.ts      # RAG pipeline
│   │       ├── agent.service.ts    # Agentic 4-step workflow
│   │       ├── ml-prediction.service.ts  # 51-feature ML bridge
│   │       ├── ai-advisor.service.ts     # 3-tier GenAI narrative
│   │       └── ...
│   │
│   ├── components/                 # React UI components
│   ├── lib/                        # API client, auth, i18n, utilities
│   ├── types/                      # TypeScript interfaces
│   └── __tests__/                  # Jest unit tests (3 suites, 20 tests)
│
├── ml-service/                     # FastAPI ML microservice
│   ├── main.py                     # /predict, /predict/batch, /health
│   ├── predict.py                  # HistGradientBoosting + SHAP
│   └── Dockerfile                  # Python 3.12 slim
│
├── docs/
│   ├── ARCHITECTURE.md             # Mermaid diagrams + data flows
│   ├── PROMPT_DESIGN.md            # Prompt iteration history
│   └── REPORT.md                   # 2-page technical report
│
├── scripts/seed-db.ts              # Database seeder (3 plants + 8 inverters)
├── Dockerfile                      # Multi-stage Next.js build
├── docker-compose.yml              # Web + ML service
├── jest.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+
- **Python** 3.11+
- **MongoDB** Atlas account
- **Groq** API key ([free at console.groq.com](https://console.groq.com/keys))

### 1. Clone & Install
```bash
git clone https://github.com/Jaimin2687/Solar-Intel.git
cd Solar-Intel
npm install
```

### 2. Environment Variables
Create `.env.local`:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/solar-intel
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ML_SERVICE_URL=http://localhost:8000/predict
ML_TIMEOUT_MS=10000
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
EMAIL_FROM=your@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
```

### 3. Seed the Database
```bash
npm run seed
```
Seeds 3 plants + 8 inverters + 3120 telemetry records.

### 4. Start ML Service
```bash
cd ml-service
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 5. Start Web App
```bash
npm run dev
# → http://localhost:3000
```

### 6. Run Tests
```bash
npm test
# → 3 suites, 20 tests — all passing ✅
```

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
# → Web:  http://localhost:3000
# → ML:   http://localhost:8000
```

---

## 🔑 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/plants` | GET | All plants with aggregated metrics |
| `/api/chat` | POST | RAG + Agent chat endpoint |
| `/api/import` | POST | CSV/Excel file import |
| `/api/predict` | POST | ML prediction proxy |
| `/api/ai-advisor` | GET | GenAI narrative generation |
| `/api/dashboard` | GET | Dashboard KPIs |
| `/api/inverters` | GET/POST/PUT/DELETE | Inverter CRUD |
| `/api/telemetry` | GET/POST | Telemetry data |
| `/api/analytics` | GET | Analytics aggregation |
| `/api/live-energy` | GET | Real-time energy feed |
| `/api/weather` | GET | Weather data |
| `/api/grid` | GET | Grid sync metrics |
| `/api/translate` | POST | Batch translation |
| `/api/email` | POST | Email notifications |
| `/api/health` | GET | System health check |
| `/api/auth/[...nextauth]` | * | Authentication |

---

## 🧪 Testing

| Suite | Tests | Coverage |
|-------|-------|----------|
| ML Prediction | 4 | Feature mapping, defaults, normalization, 51-feature output |
| RAG Entity Extraction | 7 | Plant/inverter ID, keywords, case-insensitive, dedup |
| Import Normalization | 9 | camelCase→snake_case, column detection, type inference |
| **Total** | **20** | **All passing ✅** |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture](./docs/ARCHITECTURE.md) | Mermaid system diagrams, data flows, component table |
| [Prompt Design](./docs/PROMPT_DESIGN.md) | 2+ prompt iterations per capability with before/after |
| [Technical Report](./docs/REPORT.md) | Model rationale, GenAI choices, limitations |

---

## 📸 Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Fleet KPIs, risk matrix, trend charts |
| Plants | `/plants` | Plant overview + CSV/Excel import |
| Chat | `/chat` | RAG conversational AI + agent mode |
| Inverters | `/inverters` | Inverter fleet monitoring |
| AI Insights | `/ai-insights` | GenAI health narratives |
| Analytics | `/analytics` | Energy production analytics |
| Anomalies | `/anomalies` | Deviation alerts and log |
| Forecast | `/forecast` | 48-hour solar forecast |
| Carbon | `/carbon` | CO₂ avoidance tracking |
| Maintenance | `/maintenance` | AI-prioritized task queue |
| Security | `/security` | Grid sync quality |
| Settings | `/settings` | Profile and preferences |

---

## 🛠️ Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm start          # Production server
npm run lint       # ESLint
npm test           # Jest (20 tests)
npm run seed       # Seed database
```

---

## 👨‍💻 Author

**Jaimin Parmar** — Built with ❤️ for **HACKaMINeD 2026** 🏆

---

<div align="center">
  <strong>☀️ Solar Intel — Predict failures before they happen. One watt at a time.</strong>
</div>
