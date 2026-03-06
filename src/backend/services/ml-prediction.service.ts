/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: ML Prediction Service
 * ─────────────────────────────────────────────────────────
 * Calls the Python ML microservice (FastAPI) to get real
 * XGBoost failure predictions for each inverter.
 *
 * Maps MongoDB inverter docs → ML input format → returns
 * per-inverter risk scores + factors + recommendations.
 * ─────────────────────────────────────────────────────────
 */

import { env } from "@/backend/config/env";
import logger from "@/backend/utils/logger";

export interface MLPrediction {
  inverter_id: string;
  plant_id: string;
  risk_score: number;       // 0.0 – 1.0
  risk_level: string;       // "low" | "medium" | "high" | "critical"
  failure_predicted: boolean;
  status: string;
  top_factors: string[];
  recommended_action: string;
}

interface MLBatchResponse {
  predictions: MLPrediction[];
  timestamp: string;
  model_version: string;
}

/**
 * Map a MongoDB inverter document to the ML model's input schema.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function inverterToMLInput(inv: any) {
  const hour = new Date().getHours();
  return {
    plant_id: "Plant_1",
    inverter_id: inv.inverterId,
    mean_power: inv.powerOutput * 1000,        // kW → Watts (model trained on Watts)
    std_power: inv.powerOutput * 1000 * 0.08,  // ~8% std dev estimate
    max_power: inv.powerOutput * 1000 * 1.15,
    min_power: inv.powerOutput * 1000 * 0.85,
    mean_temp: inv.temperature,
    max_temp: inv.temperature + 5,
    mean_voltage: inv.dcVoltage || 600,
    mean_current: inv.currentOutput || 10,
    ambient_temp: Math.max(inv.temperature - 15, 25),
    alarm_count: inv.riskScore > 70 ? 1 : 0,
    hour,
    grid_freq: inv.frequency || 50.0,
    power_factor: 0.98,
    kwh_today: inv.dailyYield || 0,
    kwh_total: inv.lifetimeYield * 1000 || 500000,  // MWh → kWh
    op_state: inv.powerOutput > 0 ? 5120 : 0,
    n_strings: (inv.strings || []).length || 9,
    current_imbalance: 0.05,
    voltage_imbalance: 0.01,
    power_ramp: 0,
  };
}

/**
 * Call the ML microservice for batch predictions.
 * Returns predictions for all inverters, or null if service is unavailable.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMLPredictions(dbInverters: any[]): Promise<MLPrediction[] | null> {
  const mlUrl = env.ML_SERVICE_URL.replace("/predict", "");

  try {
    const inputs = dbInverters.map(inverterToMLInput);

    const res = await fetch(`${mlUrl}/predict/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inverters: inputs }),
      signal: AbortSignal.timeout(env.ML_TIMEOUT_MS),
    });

    if (!res.ok) {
      logger.error("ML service error", { status: res.status, body: await res.text() });
      return null;
    }

    const data: MLBatchResponse = await res.json();
    logger.info("ML predictions received", {
      count: data.predictions.length,
      model: data.model_version,
      timestamp: data.timestamp,
    });

    return data.predictions;
  } catch (err) {
    logger.warn("ML service unavailable — using fallback", {
      error: (err as Error).message,
      url: mlUrl,
    });
    return null;
  }
}

/**
 * Get a single inverter prediction.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMLPredictionSingle(inv: any): Promise<MLPrediction | null> {
  const mlUrl = env.ML_SERVICE_URL.replace("/predict", "");

  try {
    const input = inverterToMLInput(inv);

    const res = await fetch(`${mlUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(env.ML_TIMEOUT_MS),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
