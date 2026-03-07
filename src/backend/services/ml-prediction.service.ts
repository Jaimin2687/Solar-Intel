/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: ML Prediction Service (v4)
 * ─────────────────────────────────────────────────────────
 * Calls the Python ML microservice's /predict/fleet endpoint.
 *
 * v4: The Python service now pulls telemetry history from
 * MongoDB directly and runs the FULL training pipeline
 * (log transforms, per-inverter z-score normalisation,
 * proper lag/rolling features). This produces real varied
 * predictions instead of the uniform ~0.97 from snapshot data.
 *
 * All we need to send is a list of inverter IDs.
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
 * Call the ML microservice's /predict/fleet endpoint.
 * v4: Just send inverter IDs — Python pulls telemetry from MongoDB
 * and runs the full training-pipeline preprocessing.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMLPredictions(dbInverters: any[]): Promise<MLPrediction[] | null> {
  const mlUrl = env.ML_SERVICE_URL.replace("/predict", "");

  try {
    const inverterIds = dbInverters.map((inv: any) => inv.inverterId).filter(Boolean);

    if (inverterIds.length === 0) {
      logger.warn("No inverter IDs to send to ML service");
      return null;
    }

    const res = await fetch(`${mlUrl}/predict/fleet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inverter_ids: inverterIds }),
      signal: AbortSignal.timeout(env.ML_TIMEOUT_MS),
    });

    if (!res.ok) {
      logger.error("ML fleet service error", { status: res.status, body: await res.text() });
      return null;
    }

    const data: MLBatchResponse = await res.json();
    logger.info("ML fleet predictions received", {
      count: data.predictions.length,
      model: data.model_version,
      timestamp: data.timestamp,
      riskRange: data.predictions.length > 0
        ? `${Math.min(...data.predictions.map(p => p.risk_score)).toFixed(4)}–${Math.max(...data.predictions.map(p => p.risk_score)).toFixed(4)}`
        : "N/A",
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
 * Get a single inverter prediction using fleet endpoint.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMLPredictionSingle(inv: any): Promise<MLPrediction | null> {
  const preds = await getMLPredictions([inv]);
  return preds && preds.length > 0 ? preds[0] : null;
}
