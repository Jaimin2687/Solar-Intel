/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: AI Advisor Service
 * ─────────────────────────────────────────────────────────
 * 3-Tier Intelligence Pipeline:
 *   1. XGBoost ML Model → risk_score, failure_predicted, top_factors
 *   2. Groq Llama 3.3 70B → human-readable insights using ML output
 *   3. Rule-based fallback → when both ML + Groq unavailable
 *
 * The ML model is the SINGLE SOURCE OF TRUTH for risk scores.
 * Groq explains the ML predictions in natural language.
 * ─────────────────────────────────────────────────────────
 */

import { connectDB } from "@/backend/config";
import { env } from "@/backend/config/env";
import { Inverter as InverterModel } from "@/backend/models";
import { getMLPredictions, type MLPrediction } from "@/backend/services/ml-prediction.service";
import logger from "@/backend/utils/logger";
import type {
  AIAdvisorData, Anomaly, AIInsight, SolarForecast,
  MaintenanceItem, RiskTimelinePoint,
} from "@/types";

/* ═══════════════════════════════════════════════════════════
   GROQ LLM INTEGRATION
   ═══════════════════════════════════════════════════════════ */

const SYSTEM_PROMPT = `You are Solar Intel AI — an expert solar energy systems analyst embedded in the Solar Intel platform.

ROLE: You explain ML model predictions to solar fleet operators. An XGBoost predictive maintenance model has already scored each inverter with a risk_score (0-1) and identified contributing factors. Your job is to translate those ML outputs into actionable, human-readable insights.

RULES:
- You ONLY discuss solar energy, inverters, photovoltaic systems, and grid operations.
- You NEVER answer questions outside your domain. If asked, respond: "I can only assist with solar fleet analysis."
- You ALWAYS reference the ML model's risk_score and top_factors in your reasoning.
- You are precise, technical, and concise.
- You prioritize safety-critical issues first (highest risk_score first).
- You include specific numbers from the data in your reasoning.

OUTPUT FORMAT (JSON — no markdown, no code blocks):
{
  "insights": [
    {
      "inverterId": "INV-XXX",
      "inverterName": "...",
      "riskLevel": "critical|high|medium|low",
      "summary": "One-sentence executive summary referencing the ML risk score",
      "reasoning": "2-3 sentence technical analysis referencing ML top_factors and telemetry data",
      "recommendations": ["Action 1", "Action 2", "Action 3"],
      "confidence": <use the ML risk_score as confidence>
    }
  ],
  "maintenanceTasks": [
    {
      "inverterId": "INV-XXX",
      "inverterName": "...",
      "task": "Specific maintenance task name",
      "priority": "critical|high|medium|low",
      "estimatedDuration": "X hours",
      "notes": "Brief justification referencing ML prediction"
    }
  ]
}`;

interface GroqInsight {
  inverterId: string;
  inverterName: string;
  riskLevel: "critical" | "high" | "medium" | "low";
  summary: string;
  reasoning: string;
  recommendations: string[];
  confidence: number;
}

interface GroqMaintenance {
  inverterId: string;
  inverterName: string;
  task: string;
  priority: "critical" | "high" | "medium" | "low";
  estimatedDuration: string;
  notes: string;
}

interface GroqResponse {
  insights: GroqInsight[];
  maintenanceTasks: GroqMaintenance[];
}

/** In-memory cache: avoids re-calling Groq for same data within 5 minutes */
let groqCache: { data: GroqResponse; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function callGroq(inverterData: string, mlContext: string): Promise<GroqResponse | null> {
  if (!env.GROQ_API_KEY) return null;

  // Return cached if fresh
  if (groqCache && Date.now() - groqCache.ts < CACHE_TTL) {
    logger.info("Groq cache hit");
    return groqCache.data;
  }

  try {
    const userMessage = mlContext
      ? `The XGBoost predictive maintenance model has analyzed the fleet. Here are the ML predictions:\n\n${mlContext}\n\nAnd here is the raw telemetry data:\n\n${inverterData}\n\nExplain the ML predictions and generate maintenance recommendations.`
      : `Analyze the following solar inverter fleet data and generate health insights + maintenance recommendations.\n\nINVERTER FLEET DATA:\n${inverterData}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 2048,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      logger.error("Groq API error", { status: res.status, body: await res.text() });
      return null;
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed: GroqResponse = JSON.parse(content);
    groqCache = { data: parsed, ts: Date.now() };
    logger.info("Groq insights generated", {
      insights: parsed.insights?.length ?? 0,
      tasks: parsed.maintenanceTasks?.length ?? 0,
      model: env.GROQ_MODEL,
      tokens: json.usage?.total_tokens ?? 0,
    });
    return parsed;
  } catch (err) {
    logger.error("Groq call failed", { error: (err as Error).message });
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════
   RULE-BASED FALLBACK (when Groq is unavailable)
   ═══════════════════════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ruleBasedInsights(dbInverters: any[]): { insights: AIInsight[]; maintenance: MaintenanceItem[] } {
  const insights: AIInsight[] = [];
  const maintenance: MaintenanceItem[] = [];

  for (const inv of dbInverters) {
    if (inv.status === "critical" || inv.status === "warning") {
      insights.push({
        id: `insight-${inv.inverterId}`,
        inverterId: inv.inverterId,
        inverterName: inv.name,
        riskLevel: inv.status === "critical" ? "critical" : "high",
        summary: inv.status === "critical"
          ? `Critical degradation — ${inv.performanceRatio}% PR, risk score ${inv.riskScore}/100.`
          : `Performance declining — ${inv.performanceRatio}% PR, monitoring required.`,
        reasoning: `Temperature: ${inv.temperature}°C, Efficiency: ${inv.efficiency}%, Power: ${inv.powerOutput}kW / ${inv.capacity}kW capacity.`,
        recommendations: [
          inv.temperature > 65 ? "Reduce load and inspect cooling system immediately." : "Continue temperature monitoring.",
          inv.efficiency < 85 ? "Schedule MPPT recalibration and efficiency diagnostic." : "Efficiency within tolerance.",
          `Risk score: ${inv.riskScore}/100 — ${inv.riskScore > 70 ? "emergency action required" : "schedule preventive check"}.`,
        ],
        confidence: inv.status === "critical" ? 0.92 : 0.78,
        generatedAt: new Date().toISOString(),
      });

      maintenance.push({
        id: `MT-${inv.inverterId}`,
        inverterId: inv.inverterId,
        inverterName: inv.name,
        task: inv.status === "critical"
          ? "Emergency Inspection & Component Replacement"
          : "Diagnostic Check & Preventive Maintenance",
        status: "scheduled",
        priority: inv.status === "critical" ? "critical" : "high",
        scheduledDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
        estimatedDuration: inv.status === "critical" ? "6 hours" : "3 hours",
        assignedTo: "Engineering Team",
        notes: `Auto-generated from rule-based analysis. Risk score: ${inv.riskScore}.`,
      });
    }
  }

  return { insights, maintenance };
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════ */

export async function getAIAdvisorData(): Promise<AIAdvisorData> {
  await connectDB();

  const dbInverters = await InverterModel.find({}).lean();

  if (dbInverters.length === 0) {
    const { fetchAIAdvisor } = await import("@/lib/mock-data");
    return fetchAIAdvisor();
  }

  // ═══════════════════════════════════════════════════════
  // STEP 1: Call ML Model (PRIMARY risk source)
  // ═══════════════════════════════════════════════════════
  const mlPredictions = await getMLPredictions(dbInverters);
  const mlMap = new Map<string, MLPrediction>();
  if (mlPredictions) {
    for (const p of mlPredictions) mlMap.set(p.inverter_id, p);
  }

  logger.info("ML predictions", {
    available: !!mlPredictions,
    count: mlPredictions?.length ?? 0,
  });

  // ═══════════════════════════════════════════════════════
  // STEP 2: Anomaly Detection (ML-driven when available)
  // ═══════════════════════════════════════════════════════
  const anomalies: Anomaly[] = [];
  for (const inv of dbInverters) {
    const mlPred = mlMap.get(inv.inverterId);

    // ML-driven anomalies
    if (mlPred && mlPred.failure_predicted) {
      anomalies.push({
        id: `AN-${inv.inverterId}-ml`,
        inverterId: inv.inverterId,
        inverterName: inv.name,
        timestamp: new Date().toISOString(),
        severity: mlPred.risk_level === "critical" ? "critical" : mlPred.risk_level === "high" ? "critical" : "warning",
        parameter: "ML Failure Prediction",
        expectedValue: 0,
        actualValue: Math.round(mlPred.risk_score * 100),
        unit: "% risk",
        description: `ML model predicts ${Math.round(mlPred.risk_score * 100)}% failure probability. ${mlPred.top_factors[0] || ""}`,
        isResolved: false,
      });
    }

    // Keep deterministic checks for specific parameters
    if (inv.temperature > 60) {
      anomalies.push({
        id: `AN-${inv.inverterId}-temp`,
        inverterId: inv.inverterId,
        inverterName: inv.name,
        timestamp: new Date().toISOString(),
        severity: inv.temperature > 70 ? "critical" : "warning",
        parameter: "Junction Temperature",
        expectedValue: 55,
        actualValue: inv.temperature,
        unit: "°C",
        description: `Temperature ${Math.round(((inv.temperature - 55) / 55) * 100)}% above safe operating limit`,
        isResolved: false,
      });
    }

    if (inv.efficiency < 90) {
      anomalies.push({
        id: `AN-${inv.inverterId}-eff`,
        inverterId: inv.inverterId,
        inverterName: inv.name,
        timestamp: new Date().toISOString(),
        severity: inv.efficiency < 80 ? "critical" : "warning",
        parameter: "Conversion Efficiency",
        expectedValue: 97,
        actualValue: inv.efficiency,
        unit: "%",
        description: `Efficiency ${Math.round(97 - inv.efficiency)}% below expected baseline`,
        isResolved: false,
      });
    }

    if (inv.performanceRatio < 75) {
      anomalies.push({
        id: `AN-${inv.inverterId}-pr`,
        inverterId: inv.inverterId,
        inverterName: inv.name,
        timestamp: new Date().toISOString(),
        severity: inv.performanceRatio < 50 ? "critical" : "warning",
        parameter: "Performance Ratio",
        expectedValue: 90,
        actualValue: inv.performanceRatio,
        unit: "%",
        description: `Performance ratio ${Math.round(90 - inv.performanceRatio)}% below fleet average`,
        isResolved: false,
      });
    }

    if (inv.frequency < 49.85 || inv.frequency > 50.15) {
      anomalies.push({
        id: `AN-${inv.inverterId}-freq`,
        inverterId: inv.inverterId,
        inverterName: inv.name,
        timestamp: new Date().toISOString(),
        severity: "warning",
        parameter: "Grid Frequency",
        expectedValue: 50.0,
        actualValue: inv.frequency,
        unit: "Hz",
        description: `Grid frequency deviation: ${inv.frequency}Hz (±0.15Hz tolerance)`,
        isResolved: false,
      });
    }
  }

  // ═══════════════════════════════════════════════════════
  // STEP 3: AI Insights (ML + Groq combined)
  // ═══════════════════════════════════════════════════════
  let insights: AIInsight[];
  let maintenance: MaintenanceItem[];

  // Build compact inverter telemetry string for Groq
  const inverterSummary = dbInverters.map((inv) =>
    `${inv.inverterId} "${inv.name}" | Status: ${inv.status} | PR: ${inv.performanceRatio}% | Temp: ${inv.temperature}°C | Power: ${inv.powerOutput}/${inv.capacity}kW | Efficiency: ${inv.efficiency}% | Risk: ${inv.riskScore}/100 | DC: ${inv.dcVoltage}V | AC: ${inv.acVoltage}V | Freq: ${inv.frequency}Hz | Uptime: ${inv.uptime}%`
  ).join("\n");

  // Build ML context string for Groq to explain
  const mlContextStr = mlPredictions
    ? mlPredictions.map((p) =>
        `${p.inverter_id} | ML Risk: ${Math.round(p.risk_score * 100)}% (${p.risk_level}) | Failure: ${p.failure_predicted ? "YES" : "NO"} | Factors: ${p.top_factors.join("; ")} | Action: ${p.recommended_action}`
      ).join("\n")
    : "";

  const groqResult = await callGroq(inverterSummary, mlContextStr);

  if (groqResult && groqResult.insights?.length > 0) {
    // Groq succeeded — use LLM insights but override confidence with ML risk_score
    insights = groqResult.insights.map((gi) => {
      const mlPred = mlMap.get(gi.inverterId);
      return {
        id: `insight-${gi.inverterId}`,
        inverterId: gi.inverterId,
        inverterName: gi.inverterName,
        riskLevel: mlPred
          ? (mlPred.risk_level as "critical" | "high" | "medium" | "low")
          : gi.riskLevel,
        summary: gi.summary,
        reasoning: gi.reasoning,
        recommendations: gi.recommendations,
        confidence: mlPred ? mlPred.risk_score : gi.confidence,
        generatedAt: new Date().toISOString(),
      };
    });

    maintenance = (groqResult.maintenanceTasks || []).map((mt, idx) => ({
      id: `MT-${mt.inverterId}-${idx}`,
      inverterId: mt.inverterId,
      inverterName: mt.inverterName,
      task: mt.task,
      status: "scheduled" as const,
      priority: mt.priority,
      scheduledDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
      estimatedDuration: mt.estimatedDuration,
      assignedTo: "Engineering Team",
      notes: mt.notes,
    }));

    logger.info("Using ML + Groq pipeline", { insights: insights.length });
  } else if (mlPredictions && mlPredictions.length > 0) {
    // ML available but Groq failed — use ML predictions directly as insights
    insights = mlPredictions
      .filter((p) => p.risk_score > 0.25) // Only show non-trivial risks
      .map((p) => {
        const inv = dbInverters.find((i) => i.inverterId === p.inverter_id);
        return {
          id: `insight-${p.inverter_id}`,
          inverterId: p.inverter_id,
          inverterName: inv?.name || p.inverter_id,
          riskLevel: p.risk_level as "critical" | "high" | "medium" | "low",
          summary: `${p.status} — ML model predicts ${Math.round(p.risk_score * 100)}% failure risk.`,
          reasoning: `Top contributing factors: ${p.top_factors.join(". ")}`,
          recommendations: [p.recommended_action, ...p.top_factors.slice(0, 2)],
          confidence: p.risk_score,
          generatedAt: new Date().toISOString(),
        };
      });

    maintenance = mlPredictions
      .filter((p) => p.risk_score > 0.5)
      .map((p, idx) => {
        const inv = dbInverters.find((i) => i.inverterId === p.inverter_id);
        return {
          id: `MT-${p.inverter_id}-${idx}`,
          inverterId: p.inverter_id,
          inverterName: inv?.name || p.inverter_id,
          task: p.risk_level === "critical"
            ? "Emergency Inspection — ML Predicted Failure"
            : "Preventive Maintenance — ML Risk Assessment",
          status: "scheduled" as const,
          priority: p.risk_level as "critical" | "high" | "medium" | "low",
          scheduledDate: new Date(Date.now() + (p.risk_level === "critical" ? 1 : 3) * 86400000).toISOString().split("T")[0],
          estimatedDuration: p.risk_level === "critical" ? "6 hours" : "3 hours",
          assignedTo: "Engineering Team",
          notes: `ML risk score: ${Math.round(p.risk_score * 100)}%. ${p.recommended_action}`,
        };
      });

    logger.info("Using ML-only insights (Groq unavailable)", { count: insights.length });
  } else {
    // Both ML + Groq unavailable — rule-based fallback
    const fallback = ruleBasedInsights(dbInverters);
    insights = fallback.insights;
    maintenance = fallback.maintenance;
    logger.info("Using rule-based fallback insights", { count: insights.length });
  }

  // ═══════════════════════════════════════════════════════
  // STEP 4: 48hr Solar Forecast (deterministic)
  // ═══════════════════════════════════════════════════════
  const forecast: SolarForecast[] = Array.from({ length: 48 }, (_, i) => {
    const d = new Date();
    d.setHours(d.getHours() + i);
    const hour = d.getHours();
    const dayOffset = Math.floor(i / 24);
    const isSunny = hour >= 6 && hour <= 18;
    const weatherOptions: ("sunny" | "partly-cloudy" | "cloudy" | "rainy")[] = ["sunny", "partly-cloudy", "cloudy", "rainy"];
    const weatherIdx = dayOffset === 0 ? (hour < 14 ? 0 : 1) : (hour < 10 ? 0 : hour < 15 ? 1 : 2);
    return {
      date: d.toISOString().split("T")[0],
      hour,
      predicted: isSunny ? Math.round(Math.sin(((hour - 6) / 12) * Math.PI) * 14 * (1 - dayOffset * 0.15) * 100) / 100 : 0,
      confidence: isSunny ? Math.round((0.92 - dayOffset * 0.08 - Math.abs(hour - 12) * 0.01) * 100) / 100 : 0.99,
      weather: weatherOptions[Math.min(weatherIdx, 3)],
      irradiance: isSunny ? Math.round(Math.sin(((hour - 6) / 12) * Math.PI) * 950 * (1 - dayOffset * 0.1)) : 0,
      temperature: Math.round((28 + Math.sin(((hour - 6) / 24) * Math.PI * 2) * 8) * 10) / 10,
    };
  });

  // ── Risk Timeline (ML-grounded when available) ──
  const avgMLRisk = mlPredictions && mlPredictions.length > 0
    ? mlPredictions.reduce((s, p) => s + p.risk_score, 0) / mlPredictions.length
    : null;

  const riskTimeline: RiskTimelinePoint[] = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 13 + i);
    // Use ML average risk as the "today" anchor, decay backwards with noise
    const baseRisk = avgMLRisk != null
      ? avgMLRisk * 100 * (0.6 + 0.4 * (i / 13)) + Math.sin(i * 0.7) * 5
      : 25 + i * 3.5 + Math.sin(i * 0.5) * 8;
    return {
      date: d.toISOString().split("T")[0],
      riskScore: Math.round(Math.max(0, Math.min(100, baseRisk)) * 10) / 10,
      events: i === 13 && mlPredictions
        ? mlPredictions.filter((p) => p.failure_predicted).map((p) => `ML alert: ${p.inverter_id}`)
        : [],
    };
  });

  // Health score: ML risk-adjusted when available
  const avgPR = dbInverters.reduce((s, i) => s + i.performanceRatio, 0) / dbInverters.length;
  const criticalCount = anomalies.filter((a) => a.severity === "critical").length;
  const mlHealthPenalty = avgMLRisk != null ? avgMLRisk * 30 : 0; // ML risk drags health down
  const healthScore = Math.round(
    avgPR * 0.6
    + (100 - criticalCount * 15) * 0.2
    + (100 - mlHealthPenalty) * 0.2
  );

  logger.info("AI Advisor data assembled", {
    anomalies: anomalies.length,
    insights: insights.length,
    source: mlPredictions ? (groqResult ? "ml+groq" : "ml-only") : (groqResult ? "groq" : "rule-based"),
  });

  return {
    insights,
    anomalies,
    forecast,
    maintenanceSchedule: maintenance,
    riskTimeline,
    healthScore: Math.max(0, Math.min(100, healthScore)),
    alertCount: {
      critical: anomalies.filter((a) => a.severity === "critical").length,
      warning: anomalies.filter((a) => a.severity === "warning").length,
      info: anomalies.filter((a) => a.severity === "info").length,
    },
  };
}
