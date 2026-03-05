/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: AI Advisor Service
 * ─────────────────────────────────────────────────────────
 * Generates insights, anomalies, forecast, maintenance, risk.
 *
 * Uses Groq (Llama 3.3 70B) for intelligent, context-aware
 * health summaries + recommendations. Falls back to
 * rule-based analysis when the API key is absent.
 * ─────────────────────────────────────────────────────────
 */

import { connectDB } from "@/backend/config";
import { env } from "@/backend/config/env";
import { Inverter as InverterModel } from "@/backend/models";
import logger from "@/backend/utils/logger";
import type {
  AIAdvisorData, Anomaly, AIInsight, SolarForecast,
  MaintenanceItem, RiskTimelinePoint,
} from "@/types";

/* ═══════════════════════════════════════════════════════════
   GROQ LLM INTEGRATION
   ═══════════════════════════════════════════════════════════ */

const SYSTEM_PROMPT = `You are Solar Intel AI — an expert solar energy systems analyst embedded in the Solar Intel platform.

ROLE: You analyze real inverter telemetry data and produce actionable health assessments for solar fleet operators.

RULES:
- You ONLY discuss solar energy, inverters, photovoltaic systems, and grid operations.
- You NEVER answer questions outside your domain. If asked, respond: "I can only assist with solar fleet analysis."
- You ALWAYS base your analysis on the provided telemetry data — never fabricate readings.
- You are precise, technical, and concise.
- You speak in the third person about inverters (e.g., "INV-004 shows..." not "You show...").
- You include specific numbers from the data in your reasoning.
- You prioritize safety-critical issues first.

OUTPUT FORMAT (JSON — no markdown, no code blocks):
{
  "insights": [
    {
      "inverterId": "INV-XXX",
      "inverterName": "...",
      "riskLevel": "critical|high|medium|low",
      "summary": "One-sentence executive summary of the issue",
      "reasoning": "2-3 sentence technical analysis referencing specific data points",
      "recommendations": ["Action 1", "Action 2", "Action 3"],
      "confidence": 0.85
    }
  ],
  "maintenanceTasks": [
    {
      "inverterId": "INV-XXX",
      "inverterName": "...",
      "task": "Specific maintenance task name",
      "priority": "critical|high|medium|low",
      "estimatedDuration": "X hours",
      "notes": "Brief justification"
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

async function callGroq(inverterData: string): Promise<GroqResponse | null> {
  if (!env.GROQ_API_KEY) return null;

  // Return cached if fresh
  if (groqCache && Date.now() - groqCache.ts < CACHE_TTL) {
    logger.info("Groq cache hit");
    return groqCache.data;
  }

  try {
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
          {
            role: "user",
            content: `Analyze the following solar inverter fleet data and generate health insights + maintenance recommendations.\n\nINVERTER FLEET DATA:\n${inverterData}`,
          },
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

  // ── Anomaly Detection (always rule-based — fast + deterministic) ──
  const anomalies: Anomaly[] = [];
  for (const inv of dbInverters) {
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

  // ── AI Insights + Maintenance ──
  let insights: AIInsight[];
  let maintenance: MaintenanceItem[];

  // Build compact data string for Groq
  const inverterSummary = dbInverters.map((inv) =>
    `${inv.inverterId} "${inv.name}" | Status: ${inv.status} | PR: ${inv.performanceRatio}% | Temp: ${inv.temperature}°C | Power: ${inv.powerOutput}/${inv.capacity}kW | Efficiency: ${inv.efficiency}% | Risk: ${inv.riskScore}/100 | DC: ${inv.dcVoltage}V | AC: ${inv.acVoltage}V | Freq: ${inv.frequency}Hz | Uptime: ${inv.uptime}%`
  ).join("\n");

  const groqResult = await callGroq(inverterSummary);

  if (groqResult && groqResult.insights?.length > 0) {
    // ── Groq succeeded: use LLM insights ──
    insights = groqResult.insights.map((gi) => ({
      id: `insight-${gi.inverterId}`,
      inverterId: gi.inverterId,
      inverterName: gi.inverterName,
      riskLevel: gi.riskLevel,
      summary: gi.summary,
      reasoning: gi.reasoning,
      recommendations: gi.recommendations,
      confidence: gi.confidence,
      generatedAt: new Date().toISOString(),
    }));

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

    logger.info("Using Groq-powered AI insights", { count: insights.length });
  } else {
    // ── Fallback: rule-based ──
    const fallback = ruleBasedInsights(dbInverters);
    insights = fallback.insights;
    maintenance = fallback.maintenance;
    logger.info("Using rule-based fallback insights", { count: insights.length });
  }

  // ── 48hr Solar Forecast (deterministic — no LLM needed) ──
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

  // ── Risk Timeline ──
  const riskTimeline: RiskTimelinePoint[] = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 13 + i);
    return {
      date: d.toISOString().split("T")[0],
      riskScore: Math.round((25 + i * 3.5 + Math.sin(i * 0.5) * 8) * 10) / 10,
      events: i === 8 ? ["Temperature anomaly detected"] : i === 11 ? ["Capacitor ESR alert"] : [],
    };
  });

  const avgPR = dbInverters.reduce((s, i) => s + i.performanceRatio, 0) / dbInverters.length;
  const healthScore = Math.round(
    avgPR * 0.8 + (100 - anomalies.filter((a) => a.severity === "critical").length * 15) * 0.2
  );

  logger.info("AI Advisor data assembled", {
    anomalies: anomalies.length,
    insights: insights.length,
    source: groqResult ? "groq" : "rule-based",
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
