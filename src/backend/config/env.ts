/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: Environment Configuration
 * ─────────────────────────────────────────────────────────
 * Single source of truth for all backend env vars.
 */

export const env = {
  // Database
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/solar-intel",

  // Auth
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",

  // ML Service
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || "http://ml-service:8000/predict",
  ML_TIMEOUT_MS: parseInt(process.env.ML_TIMEOUT_MS || "10000", 10),

  // Email (Gmail SMTP)
  EMAIL_FROM: process.env.EMAIL_FROM || "noreply.garuda@gmail.com",
  EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD || "",

  // App
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  // Weather defaults (used when an inverter has no explicit coords)
  WEATHER_PROVIDER: process.env.WEATHER_PROVIDER || "open-meteo",
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || "",
  DEFAULT_LATITUDE: process.env.DEFAULT_LATITUDE || "37.7749",
  DEFAULT_LONGITUDE: process.env.DEFAULT_LONGITUDE || "-122.4194",
} as const;
