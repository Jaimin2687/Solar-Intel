<div align="center"><div align="center">



# ☀️ Solar Intel# ☀️ Solar Intel



### AI-Powered Solar Plant Monitoring & Predictive Maintenance Platform### AI-Powered Solar Plant Monitoring & Predictive Maintenance Platform



**Built for HACKaMINeD 2026****Built for HACKaMINeD 2026**



[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)

[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com)[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com)

[![FastAPI](https://img.shields.io/badge/FastAPI-ML_Service-009688?logo=fastapi)](https://fastapi.tiangolo.com)[![FastAPI](https://img.shields.io/badge/FastAPI-ML_Service-009688?logo=fastapi)](https://fastapi.tiangolo.com)

[![XGBoost](https://img.shields.io/badge/XGBoost-ML_Model-orange)](https://xgboost.readthedocs.io)[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-f55036)](https://groq.com)

[![SHAP](https://img.shields.io/badge/SHAP-Explainability-purple)](https://shap.readthedocs.io)[![Tests](https://img.shields.io/badge/Tests-20_passing-brightgreen)](.)

[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-f55036)](https://groq.com)[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](.)

[![Tests](https://img.shields.io/badge/Tests-20_passing-brightgreen)](.)[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](.)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)**[Live Demo →](https://solar-intel-six.vercel.app)**



**[🚀 Live Demo →](https://solar-intel-six.vercel.app)** | **[📖 Documentation](./docs/)**</div>



</div>---



---## 🌟 What is Solar Intel?



## 🌟 What is Solar Intel?Solar Intel is a **full-stack intelligent solar plant management platform** that provides complete visibility into multi-plant solar operations. It combines **ML-powered predictive maintenance** (95.3% accuracy), **RAG-grounded conversational AI**, **agentic autonomous workflows**, and **15-language internationalization** — all backed by real MongoDB data and a dedicated FastAPI ML microservice.



Solar Intel is a **full-stack intelligent solar plant management platform** that provides complete visibility into multi-plant solar operations. It combines **XGBoost ML-powered predictive maintenance** (95.3% accuracy), **SHAP explainability**, **RAG-grounded conversational AI**, **agentic autonomous workflows**, and **15-language internationalization** — all backed by real MongoDB data and a dedicated FastAPI ML microservice.**It doesn't just show data — it predicts failures before they happen, explains why in plain English, and auto-generates maintenance tickets.**



**It doesn't just show data — it predicts failures before they happen, explains why with SHAP feature contributions, and auto-generates maintenance tickets.**---



---## 🏆 Built for HACKaMINeD 2026



## 🏆 Built for HACKaMINeD 2026| Hackathon Pillar | How We Address It |

|-----------------|-------------------|

| Hackathon Pillar | How We Address It || 🔍 **Data Mining** | Real solar plant telemetry ingestion from CSV/Excel, 51-feature ML pipeline |

|-----------------|-------------------|| 🤖 **GenAI** | Groq Llama 3.3 70B generates operational narratives from ML predictions |

| 🔍 **Data Mining** | Real solar plant telemetry ingestion from CSV/Excel, 29-feature ML pipeline with lag/rolling features || 🧠 **RAG Pipeline** | Entity extraction → MongoDB context retrieval → grounded LLM Q&A with sources |

| 🤖 **GenAI** | Groq Llama 3.3 70B generates operational narratives from ML predictions || 🤖 **Agentic AI** | 4-step autonomous workflow: Data → Risk Assessment → Ticket Drafting → Summary |

| 🧠 **RAG Pipeline** | Entity extraction → MongoDB context retrieval → grounded LLM Q&A with source citations || 📊 **ML Model** | HistGradientBoosting classifier, SHAP explanations, FastAPI microservice |

| 🤖 **Agentic AI** | 4-step autonomous workflow: Data → Risk Assessment → Ticket Drafting → Summary || 🌍 **Global Accessibility** | 15-language real-time translation across every page |

| 📊 **ML Model** | XGBoost classifier with SHAP TreeExplainer for interpretable predictions || 🐳 **Production Ready** | Docker multi-container deployment, 20 unit tests, comprehensive docs |

| 🔬 **Explainability** | Top-5 SHAP feature contributions per prediction with impact percentages |

| 🌍 **Global Accessibility** | 15-language real-time translation across every page |---

| 🐳 **Production Ready** | Docker multi-container deployment, Vercel + Render hosting, comprehensive docs |

## ✨ Core Features

---

### 🏭 Plant-Based Architecture

## ✨ Core Features- **Multi-plant management** — 3 solar plants, each with dedicated inverter fleets

- **Plant overview** — aggregated metrics per plant (total power, health score, risk level)

### 🏭 Plant-Based Architecture- **Drill-down** — click any plant to see its inverter fleet

- **Multi-plant management** — 3 solar plants across India (Rajasthan, Gujarat, Karnataka)

- **29 inverters** — Fleet of utility-scale inverters with real-time monitoring### 📥 CSV/Excel Data Import

- **Plant overview** — aggregated metrics per plant (total power, health score, risk level)- **Drag-and-drop** file upload for plant and inverter data

- **Drill-down** — click any plant to see its inverter fleet with real-time status- **Auto-detection** — system identifies whether file contains plant or inverter data

- **Column normalization** — handles camelCase, spaces, special characters automatically

### 📥 CSV/Excel Data Import- **Bulk upsert** — imported data flows directly to MongoDB

- **Drag-and-drop** file upload for plant and inverter data

- **Auto-detection** — system identifies whether file contains plant or inverter data### 🤖 ML Predictive Maintenance

- **Column normalization** — handles camelCase, spaces, special characters automatically- **HistGradientBoosting** classifier trained on real solar data (95.3% accuracy, AUC-ROC 0.981)

- **Bulk upsert** — imported data flows directly to MongoDB- **51 feature engineering** — DC/AC power ratios, irradiation, temperature, module efficiency

- **SHAP explanations** — top-5 contributing factors for every prediction

### 🤖 ML Predictive Maintenance (XGBoost + SHAP)- **FastAPI microservice** — `/predict`, `/predict/batch`, `/health` endpoints

- **XGBoost Classifier** trained on real solar data (95.3% accuracy, AUC-ROC 0.981)

- **29-feature engineering** — time-series lag (1, 4, 8 steps), rolling mean/std (4, 16 windows), diff, ratios### 💬 RAG + Agentic AI Chat

- **SHAP TreeExplainer** — interpretable ML with feature contribution breakdown:- **RAG Pipeline** — entity extraction → MongoDB context → grounded LLM responses with source citations

  ```json- **Agent Mode** — autonomous 4-step workflow:

  {  1. 📊 Data Retrieval — pulls plant/inverter/telemetry context

    "feature": "inverter_temp",  2. ⚠️ Risk Assessment — ML-powered risk evaluation

    "label": "Inverter temperature",  3. 🎫 Ticket Drafting — auto-generates maintenance tickets

    "value": "64.5°C",  4. 📋 Executive Summary — synthesized report

    "contribution": 32.5,- **Conversational UI** — multi-turn chat with suggestion chips, agent action cards

    "direction": "positive",

    "impact": "high",### 📊 GenAI Narrative Intelligence

    "description": "Inverter temperature at 64.5°C (elevated) increases failure risk"- **Groq Llama 3.3 70B** generates plain-English operational reports

  }- **3-tier fallback** — ML+Groq → ML-only → rule-based (never fails)

  ```- Confidence scores, risk classifications, prioritized recommendations

- **FastAPI microservice** — `/predict/fleet`, `/predict/batch`, `/health` endpoints

- **2-tier fallback** — Fleet prediction (MongoDB) → Batch prediction (direct features)### 🏠 Dashboard & Analytics

- Real-time fleet KPIs with animated metric cards

### 💬 RAG + Agentic AI Chat- Risk matrix and status distribution

- **RAG Pipeline** — entity extraction → MongoDB context → grounded LLM responses with source citations- Performance trend charts (7-day, 30-day, 90-day)

- **Guardrails** — blocks off-topic, harmful, and competitor queries- Weather integration (Open-Meteo)

- **Agent Mode** — autonomous 4-step workflow:

  1. 📊 Data Retrieval — pulls plant/inverter/telemetry context### ⚡ Anomaly Detection & Forecast

  2. ⚠️ Risk Assessment — ML-powered risk evaluation- Real-time parameter deviation monitoring with severity scoring

  3. 🎫 Ticket Drafting — auto-generates maintenance tickets- 48-hour solar generation forecast (weather-aware)

  4. 📋 Executive Summary — synthesized report

- **Conversational UI** — multi-turn chat with suggestion chips, agent action cards### ♻️ Carbon Impact

- Daily CO₂ avoidance tracking, real-world equivalents (trees, cars, homes)

### 📊 GenAI Narrative Intelligence

- **Groq Llama 3.3 70B** generates plain-English operational reports### 🔧 Maintenance

- **3-tier fallback** — ML+Groq → ML-only → rule-based (never fails)- AI-prioritized task queue with status tracking

- Confidence scores, risk classifications, prioritized recommendations

### 🌐 15-Language Support

### 🏠 Dashboard & AnalyticsEvery page translates in real time — including dynamic AI-generated content:

- Real-time fleet KPIs with animated metric cards

- Smart power display (kW for small plants, MW for utility-scale)| Language | Code | Language | Code |

- Risk matrix and status distribution (healthy/warning/critical)|----------|------|----------|------|

- Performance trend charts (7-day, 30-day, 90-day)| English | `en` | Hindi | `hi` |

- Weather integration (Open-Meteo)| Spanish | `es` | French | `fr` |

- **Global search** — find inverters, plants, or features instantly| German | `de` | Japanese | `ja` |

| Chinese | `zh` | Arabic | `ar` |

### ⚡ DISCOM / Grid Page| Portuguese | `pt` | Russian | `ru` |

- Grid synchronization quality monitoring| Korean | `ko` | Italian | `it` |

- Frequency deviation tracking (49.5-50.5 Hz tolerance)| Dutch | `nl` | Turkish | `tr` |

- Power factor analysis| Polish | `pl` | | |

- Revenue impact from grid issues

---

### ⚡ Anomaly Detection & Forecast

- Real-time parameter deviation monitoring with severity scoring## 🏗️ Architecture

- 48-hour solar generation forecast (weather-aware)

```

### ♻️ Carbon Impact┌────────────────────────────────────────────────────────────┐

- Daily CO₂ avoidance tracking with real-world equivalents (trees, cars, homes)│  Frontend — Next.js 14 (React 18 + TailwindCSS)           │

│  ┌──────┐ ┌──────┐ ┌──────┐ ┌─────┐ ┌──────┐ ┌────────┐  │

### 🔧 Maintenance│  │Dash  │ │Plants│ │Invert│ │Chat │ │AI Adv│ │+6 more │  │

- AI-prioritized task queue with status tracking│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬──┘ └──┬───┘ └──┬─────┘  │

- Auto-generated tickets from agent workflow├─────┼────────┼────────┼────────┼───────┼────────┼─────────┤

│  API Routes (17 Next.js Route Handlers)                    │

### 🌐 15-Language Support├────────────────────────────────────────────────────────────┤

Every page translates in real time — including dynamic AI-generated content:│  Backend Services                                          │

│  ┌─────────┐ ┌──────┐ ┌───────┐ ┌──────┐ ┌────────────┐  │

| Language | Code | Language | Code |│  │Dashboard│ │Plants│ │ML Pred│ │RAG   │ │Agent (Auto)│  │

|----------|------|----------|------|│  └────┬────┘ └──┬───┘ └──┬────┘ └──┬───┘ └──┬─────────┘  │

| English | `en` | Hindi | `hi` |├───────┼─────────┼────────┼─────────┼────────┼─────────────┤

| Spanish | `es` | French | `fr` |│  ┌────┴─────┐ ┌─┴────────┴──┐ ┌───┴────┐ ┌─┴───────────┐│

| German | `de` | Japanese | `ja` |│  │FastAPI ML│ │MongoDB Atlas│ │Groq LLM│ │Open-Meteo   ││

| Chinese | `zh` | Arabic | `ar` |│  │:8000     │ │             │ │Llama3.3│ │Weather API  ││

| Portuguese | `pt` | Russian | `ru` |│  └──────────┘ └─────────────┘ └────────┘ └─────────────┘│

| Korean | `ko` | Italian | `it` |└────────────────────────────────────────────────────────────┘

| Dutch | `nl` | Turkish | `tr` |```

| Polish | `pl` | | |

---

---

## 🏗️ Tech Stack

## 🏗️ Architecture

| Layer | Technology |

```|-------|-----------|

┌────────────────────────────────────────────────────────────────┐| **Frontend** | Next.js 14 (App Router), React 18, TailwindCSS, Framer Motion, Tremor |

│  Frontend — Next.js 14 (React 18 + TailwindCSS + Tremor)      │| **Backend** | Next.js API Routes, Mongoose 9 |

│  ┌──────┐ ┌──────┐ ┌──────┐ ┌─────┐ ┌──────┐ ┌────────────┐  │| **Database** | MongoDB Atlas |

│  │Dash  │ │Plants│ │Invert│ │Chat │ │AI Adv│ │Grid/DISCOM │  │| **ML Model** | scikit-learn HistGradientBoostingClassifier + SHAP |

│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬──┘ └──┬───┘ └──┬─────────┘  │| **ML API** | FastAPI + Uvicorn (Python 3.12) |

├─────┼────────┼────────┼────────┼───────┼────────┼─────────────┤| **LLM** | Groq — Llama 3.3 70B Versatile |

│  API Routes (17 Next.js Route Handlers)                        │| **Auth** | NextAuth.js v4 (Google OAuth + Credentials) |

├────────────────────────────────────────────────────────────────┤| **i18n** | 15 languages (Google Translate free endpoint) |

│  Backend Services                                              │| **Import** | PapaParse (CSV) + SheetJS (Excel) |

│  ┌─────────┐ ┌──────┐ ┌───────┐ ┌──────┐ ┌────────────┐      │| **Testing** | Jest + ts-jest (20 tests, 3 suites) |

│  │Dashboard│ │Plants│ │ML Pred│ │RAG   │ │Agent (Auto)│      │| **Deployment** | Docker (multi-stage) + Vercel |

│  └────┬────┘ └──┬───┘ └──┬────┘ └──┬───┘ └──┬─────────┘      │

├───────┼─────────┼────────┼─────────┼────────┼─────────────────┤---

│  ┌────┴─────────┴────┐ ┌─┴────────┴──┐ ┌───┴────┐            │

│  │FastAPI ML Service │ │MongoDB Atlas│ │Groq LLM│            │## 📁 Project Structure

│  │(XGBoost + SHAP)   │ │             │ │Llama3.3│            │

│  │Render.com :8000   │ │             │ │  70B   │            │```

│  └───────────────────┘ └─────────────┘ └────────┘            │solar-intel/

└────────────────────────────────────────────────────────────────┘├── src/

```│   ├── app/                        # Next.js pages (11 routes)

│   │   ├── page.tsx                # Dashboard

---│   │   ├── plants/                 # Plant overview + import UI

│   │   ├── chat/                   # RAG + Agent chat interface

## 🏗️ Tech Stack│   │   ├── ai-insights/            # GenAI health narratives

│   │   ├── analytics/              # Energy analytics

| Layer | Technology |│   │   ├── anomalies/              # Anomaly detection

|-------|-----------|│   │   ├── forecast/               # Solar forecast

| **Frontend** | Next.js 14 (App Router), React 18, TailwindCSS, Framer Motion, Tremor |│   │   ├── carbon/                 # Carbon tracking

| **Backend** | Next.js API Routes, Mongoose 9 |│   │   ├── maintenance/            # Maintenance queue

| **Database** | MongoDB Atlas |│   │   ├── security/               # Grid security

| **ML Model** | XGBoost Classifier + SHAP TreeExplainer |│   │   ├── settings/               # Settings

| **ML Features** | 29 features: lag (1,4,8), rolling mean/std (4,16), diff, ratios |│   │   └── api/                    # 17 API route handlers

| **ML API** | FastAPI + Uvicorn (Python 3.12) — hosted on Render.com |│   │       ├── chat/               # RAG + Agent chat

| **LLM** | Groq — Llama 3.3 70B Versatile |│   │       ├── import/             # CSV/Excel import

| **Auth** | NextAuth.js v4 (Google OAuth + Credentials) |│   │       ├── plants/             # Plant CRUD

| **i18n** | 15 languages (Google Translate free endpoint) |│   │       ├── predict/            # ML prediction proxy

| **Import** | PapaParse (CSV) + SheetJS (Excel) |│   │       ├── ai-advisor/         # GenAI narrative

| **Testing** | Jest + ts-jest (20 tests, 3 suites) |│   │       └── ...                 # + 12 more

| **Deployment** | Vercel (Next.js) + Render (ML Service) + Docker |│   │

│   ├── backend/

---│   │   ├── models/                 # Mongoose schemas

│   │   │   ├── Plant.ts            # Plant model

## 📁 Project Structure│   │   │   ├── Inverter.ts         # Inverter model (with plantId)

│   │   │   ├── Telemetry.ts        # Time-series telemetry

```│   │   │   └── User.ts

solar-intel/│   │   └── services/               # Business logic

├── src/│   │       ├── rag.service.ts      # RAG pipeline

│   ├── app/                        # Next.js pages (12 routes)│   │       ├── agent.service.ts    # Agentic 4-step workflow

│   │   ├── page.tsx                # Dashboard│   │       ├── ml-prediction.service.ts  # 51-feature ML bridge

│   │   ├── plants/                 # Plant overview + import UI│   │       ├── ai-advisor.service.ts     # 3-tier GenAI narrative

│   │   ├── inverters/              # Inverter fleet monitoring│   │       └── ...

│   │   ├── chat/                   # RAG + Agent chat interface│   │

│   │   ├── ai-insights/            # GenAI health narratives│   ├── components/                 # React UI components

│   │   ├── analytics/              # Energy analytics│   ├── lib/                        # API client, auth, i18n, utilities

│   │   ├── anomalies/              # Anomaly detection│   ├── types/                      # TypeScript interfaces

│   │   ├── forecast/               # Solar forecast│   └── __tests__/                  # Jest unit tests (3 suites, 20 tests)

│   │   ├── carbon/                 # Carbon tracking│

│   │   ├── maintenance/            # Maintenance queue├── ml-service/                     # FastAPI ML microservice

│   │   ├── security/               # Grid security / DISCOM│   ├── main.py                     # /predict, /predict/batch, /health

│   │   ├── settings/               # Settings│   ├── predict.py                  # HistGradientBoosting + SHAP

│   │   └── api/                    # 17 API route handlers│   └── Dockerfile                  # Python 3.12 slim

│   │       ├── chat/               # RAG + Agent chat│

│   │       ├── import/             # CSV/Excel import├── docs/

│   │       ├── plants/             # Plant CRUD│   ├── ARCHITECTURE.md             # Mermaid diagrams + data flows

│   │       ├── predict/            # ML prediction proxy│   ├── PROMPT_DESIGN.md            # Prompt iteration history

│   │       ├── ai-advisor/         # GenAI narrative│   └── REPORT.md                   # 2-page technical report

│   │       ├── grid/               # DISCOM/Grid data│

│   │       └── ...                 # + 11 more├── scripts/seed-db.ts              # Database seeder (3 plants + 8 inverters)

│   │├── Dockerfile                      # Multi-stage Next.js build

│   ├── backend/├── docker-compose.yml              # Web + ML service

│   │   ├── models/                 # Mongoose schemas├── jest.config.js

│   │   │   ├── Plant.ts            # Plant model└── package.json

│   │   │   ├── Inverter.ts         # Inverter model (with plantId)```

│   │   │   ├── Telemetry.ts        # Time-series telemetry

│   │   │   └── User.ts---

│   │   └── services/               # Business logic

│   │       ├── rag.service.ts      # RAG pipeline with guardrails## 🚀 Getting Started

│   │       ├── agent.service.ts    # Agentic 4-step workflow

│   │       ├── ml-prediction.service.ts  # 2-tier ML fallback### Prerequisites

│   │       ├── ai-advisor.service.ts     # 3-tier GenAI narrative- **Node.js** 20+

│   │       ├── grid.service.ts     # DISCOM/Grid analytics- **Python** 3.11+

│   │       └── ...- **MongoDB** Atlas account

│   │- **Groq** API key ([free at console.groq.com](https://console.groq.com/keys))

│   ├── components/                 # React UI components

│   ├── lib/                        # API client, auth, i18n, utilities### 1. Clone & Install

│   ├── types/                      # TypeScript interfaces```bash

│   └── __tests__/                  # Jest unit tests (3 suites, 20 tests)git clone https://github.com/Jaimin2687/Solar-Intel.git

│cd Solar-Intel

├── ml-service/                     # FastAPI ML microservicenpm install

│   ├── main.py                     # /predict/fleet, /predict/batch, /health```

│   ├── predict.py                  # XGBoost + SHAP TreeExplainer

│   ├── requirements.txt            # xgboost, shap, pandas, numpy, pymongo### 2. Environment Variables

│   ├── solar_inverter_xgboost_model.pkl  # Trained model artifactCreate `.env.local`:

│   └── Dockerfile                  # Python 3.12 slim```env

│MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/solar-intel

├── docs/NEXTAUTH_SECRET=your_nextauth_secret

│   ├── ARCHITECTURE.md             # Mermaid diagrams + data flowsNEXTAUTH_URL=http://localhost:3000

│   ├── PROMPT_DESIGN.md            # Prompt iteration historyGOOGLE_CLIENT_ID=your_google_client_id

│   ├── RAG_SYSTEM.md               # RAG architecture documentationGOOGLE_CLIENT_SECRET=your_google_client_secret

│   └── REPORT.md                   # 2-page technical reportML_SERVICE_URL=http://localhost:8000/predict

│ML_TIMEOUT_MS=10000

├── scripts/GROQ_API_KEY=your_groq_api_key

│   ├── seed-db.ts                  # Database seederGROQ_MODEL=llama-3.3-70b-versatile

│   ├── seed-from-real-csv.mjs      # Seed from actual plant dataEMAIL_FROM=your@gmail.com

│   └── seed-realistic.mjs          # Generate realistic test dataEMAIL_APP_PASSWORD=your_gmail_app_password

│```

├── Dockerfile                      # Multi-stage Next.js build

├── docker-compose.yml              # Web + ML service### 3. Seed the Database

├── jest.config.js```bash

└── package.jsonnpm run seed

``````

Seeds 3 plants + 8 inverters + 3120 telemetry records.

---

### 4. Start ML Service

## 🚀 Getting Started```bash

cd ml-service

### Prerequisitespython3 -m venv venv && source venv/bin/activate

- **Node.js** 20+pip install -r requirements.txt

- **Python** 3.11+uvicorn main:app --host 0.0.0.0 --port 8000

- **MongoDB** Atlas account```

- **Groq** API key ([free at console.groq.com](https://console.groq.com/keys))

### 5. Start Web App

### 1. Clone & Install```bash

```bashnpm run dev

git clone https://github.com/Jaimin2687/Solar-Intel.git# → http://localhost:3000

cd Solar-Intel```

npm install

```### 6. Run Tests

```bash

### 2. Environment Variablesnpm test

Create `.env.local`:# → 3 suites, 20 tests — all passing ✅

```env```

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/solar-intel

NEXTAUTH_SECRET=your_nextauth_secret---

NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id## 🐳 Docker Deployment

GOOGLE_CLIENT_SECRET=your_google_client_secret

ML_SERVICE_URL=http://localhost:8000/predict```bash

ML_TIMEOUT_MS=30000docker-compose up --build

GROQ_API_KEY=your_groq_api_key# → Web:  http://localhost:3000

GROQ_MODEL=llama-3.3-70b-versatile# → ML:   http://localhost:8000

``````



### 3. Seed the Database---

```bash

npm run seed## 🔑 API Routes

```

Seeds 3 plants + 29 inverters + telemetry records with realistic utility-scale values.| Route | Method | Description |

|-------|--------|-------------|

### 4. Start ML Service| `/api/plants` | GET | All plants with aggregated metrics |

```bash| `/api/chat` | POST | RAG + Agent chat endpoint |

cd ml-service| `/api/import` | POST | CSV/Excel file import |

python3 -m venv venv && source venv/bin/activate| `/api/predict` | POST | ML prediction proxy |

pip install -r requirements.txt| `/api/ai-advisor` | GET | GenAI narrative generation |

uvicorn main:app --host 0.0.0.0 --port 8000| `/api/dashboard` | GET | Dashboard KPIs |

```| `/api/inverters` | GET/POST/PUT/DELETE | Inverter CRUD |

| `/api/telemetry` | GET/POST | Telemetry data |

### 5. Start Web App| `/api/analytics` | GET | Analytics aggregation |

```bash| `/api/live-energy` | GET | Real-time energy feed |

npm run dev| `/api/weather` | GET | Weather data |

# → http://localhost:3000| `/api/grid` | GET | Grid sync metrics |

```| `/api/translate` | POST | Batch translation |

| `/api/email` | POST | Email notifications |

### 6. Run Tests| `/api/health` | GET | System health check |

```bash| `/api/auth/[...nextauth]` | * | Authentication |

npm test

# → 3 suites, 20 tests — all passing ✅---

```

## 🧪 Testing

---

| Suite | Tests | Coverage |

## 🐳 Docker Deployment|-------|-------|----------|

| ML Prediction | 4 | Feature mapping, defaults, normalization, 51-feature output |

```bash| RAG Entity Extraction | 7 | Plant/inverter ID, keywords, case-insensitive, dedup |

docker-compose up --build| Import Normalization | 9 | camelCase→snake_case, column detection, type inference |

# → Web:  http://localhost:3000| **Total** | **20** | **All passing ✅** |

# → ML:   http://localhost:8000

```---



---## 📚 Documentation



## 🌐 Production Deployment| Document | Description |

|----------|-------------|

| Service | Platform | URL || [Architecture](./docs/ARCHITECTURE.md) | Mermaid system diagrams, data flows, component table |

|---------|----------|-----|| [Prompt Design](./docs/PROMPT_DESIGN.md) | 2+ prompt iterations per capability with before/after |

| **Next.js App** | Vercel | [solar-intel-six.vercel.app](https://solar-intel-six.vercel.app) || [Technical Report](./docs/REPORT.md) | Model rationale, GenAI choices, limitations |

| **ML Service** | Render | solar-intel-ml.onrender.com |

| **Database** | MongoDB Atlas | Cloud-hosted |---



---## 📸 Pages



## 🔑 API Routes| Page | Route | Description |

|------|-------|-------------|

| Route | Method | Description || Dashboard | `/` | Fleet KPIs, risk matrix, trend charts |

|-------|--------|-------------|| Plants | `/plants` | Plant overview + CSV/Excel import |

| `/api/plants` | GET | All plants with aggregated metrics || Chat | `/chat` | RAG conversational AI + agent mode |

| `/api/chat` | POST | RAG + Agent chat endpoint || Inverters | `/inverters` | Inverter fleet monitoring |

| `/api/import` | POST | CSV/Excel file import || AI Insights | `/ai-insights` | GenAI health narratives |

| `/api/predict` | POST | ML prediction proxy || Analytics | `/analytics` | Energy production analytics |

| `/api/ai-advisor` | GET | GenAI narrative generation || Anomalies | `/anomalies` | Deviation alerts and log |

| `/api/dashboard` | GET | Dashboard KPIs || Forecast | `/forecast` | 48-hour solar forecast |

| `/api/inverters` | GET/POST/PUT/DELETE | Inverter CRUD || Carbon | `/carbon` | CO₂ avoidance tracking |

| `/api/telemetry` | GET/POST | Telemetry data || Maintenance | `/maintenance` | AI-prioritized task queue |

| `/api/analytics` | GET | Analytics aggregation || Security | `/security` | Grid sync quality |

| `/api/live-energy` | GET | Real-time energy feed || Settings | `/settings` | Profile and preferences |

| `/api/grid` | GET | DISCOM/Grid sync metrics |

| `/api/weather` | GET | Weather data |---

| `/api/translate` | POST | Batch translation |

| `/api/email` | POST | Email notifications |## 🛠️ Scripts

| `/api/health` | GET | System health check |

| `/api/auth/[...nextauth]` | * | Authentication |```bash

npm run dev        # Development server

---npm run build      # Production build

npm start          # Production server

## 🧪 Testingnpm run lint       # ESLint

npm test           # Jest (20 tests)

| Suite | Tests | Coverage |npm run seed       # Seed database

|-------|-------|----------|```

| ML Prediction | 4 | Feature mapping, defaults, normalization, 29-feature output |

| RAG Entity Extraction | 7 | Plant/inverter ID, keywords, case-insensitive, dedup |---

| Import Normalization | 9 | camelCase→snake_case, column detection, type inference |

| **Total** | **20** | **All passing ✅** |## 👨‍💻 Author



---**Jaimin Parmar** — Built with ❤️ for **HACKaMINeD 2026** 🏆



## 📚 Documentation---



| Document | Description |<div align="center">

|----------|-------------|  <strong>☀️ Solar Intel — Predict failures before they happen. One watt at a time.</strong>

| [Architecture](./docs/ARCHITECTURE.md) | Mermaid system diagrams, data flows, component table |</div>

| [RAG System](./docs/RAG_SYSTEM.md) | RAG pipeline, guardrails, entity extraction, prompt design |
| [Prompt Design](./docs/PROMPT_DESIGN.md) | 2+ prompt iterations per capability with before/after |
| [Technical Report](./docs/REPORT.md) | Model rationale, GenAI choices, limitations |

---

## 📸 Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Fleet KPIs, risk matrix, trend charts |
| Plants | `/plants` | Plant overview + CSV/Excel import |
| Inverters | `/inverters` | Inverter fleet monitoring with ML predictions |
| Chat | `/chat` | RAG conversational AI + agent mode |
| AI Insights | `/ai-insights` | GenAI health narratives |
| Analytics | `/analytics` | Energy production analytics |
| Anomalies | `/anomalies` | Deviation alerts and log |
| Forecast | `/forecast` | 48-hour solar forecast |
| Carbon | `/carbon` | CO₂ avoidance tracking |
| Maintenance | `/maintenance` | AI-prioritized task queue |
| DISCOM / Grid | `/security` | Grid sync quality monitoring |
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

## 🔬 ML Model Details

### XGBoost Classifier
- **Algorithm**: XGBoost with calibrated probabilities
- **Accuracy**: 95.3%
- **AUC-ROC**: 0.981
- **Features**: 29 engineered features from raw telemetry

### Feature Engineering Pipeline
1. **Log transforms** on skewed features (current, power, kWh)
2. **Per-inverter z-score normalization**
3. **Lag features** (1, 4, 8 timesteps = 15min, 1hr, 2hr)
4. **Rolling statistics** (mean/std over 4, 16 windows)
5. **Diff features** (rate of change)
6. **Engineered ratios** (PV balance, efficiency)

### SHAP Explainability
- **TreeExplainer** for XGBoost model
- **Top 5 features** per prediction
- **Contribution %** normalized from SHAP values
- **Impact levels**: High (≥25%), Medium (10-25%), Low (<10%)

---

## 👨‍💻 Author

**Jaimin Parmar** — Built with ❤️ for **HACKaMINeD 2026** 🏆

---

<div align="center">
  <strong>☀️ Solar Intel — Predict failures before they happen. One watt at a time.</strong>
</div>
