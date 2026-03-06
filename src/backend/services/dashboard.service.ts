/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: Dashboard Service
 * ─────────────────────────────────────────────────────────
 * Aggregates inverter, telemetry, AI insights for dashboard.
 */

import { connectDB } from "@/backend/config";
import { Inverter as InverterModel, TelemetryRecord } from "@/backend/models";
import { mapToFrontend } from "./inverter.service";
import { getMLPredictions } from "./ml-prediction.service";
import logger from "@/backend/utils/logger";
import type { DashboardData, SystemHealth, PerformanceTrend, AIInsight } from "@/types";

export async function getDashboardData(): Promise<DashboardData> {
  await connectDB();

  const dbInverters = await InverterModel.find({}).lean();

  // Fall back to mock data when DB is empty
  if (dbInverters.length === 0) {
    const { fetchDashboardData } = await import("@/lib/mock-data");
    return fetchDashboardData();
  }

  const inverters = dbInverters.map(mapToFrontend);

  // ── System Health ──
  const healthyCount = inverters.filter((i) => i.status === "healthy").length;
  const warningCount = inverters.filter((i) => i.status === "warning").length;
  const criticalCount = inverters.filter((i) => i.status === "critical").length;

  const systemHealth: SystemHealth = {
    totalInverters: inverters.length,
    healthyCount,
    warningCount,
    criticalCount,
    avgPerformanceRatio:
      Math.round((inverters.reduce((s, i) => s + i.performanceRatio, 0) / inverters.length) * 10) / 10,
    totalPowerOutput:
      Math.round(inverters.reduce((s, i) => s + i.powerOutput, 0) / 100) / 10,
    systemUptime:
      Math.round((inverters.reduce((s, i) => s + i.uptime, 0) / inverters.length) * 10) / 10,
    predictedFailures: criticalCount,
  };

  // ── 30-day Performance Trends ──
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const telemetry = await TelemetryRecord.find({ timestamp: { $gte: thirtyDaysAgo } })
    .sort({ timestamp: 1 })
    .lean();

  let performanceTrends: PerformanceTrend[];
  if (telemetry.length > 0) {
    const byDate = new Map<string, { pr: number[]; power: number[] }>();
    for (const t of telemetry) {
      const dk = t.timestamp.toISOString().split("T")[0];
      if (!byDate.has(dk)) byDate.set(dk, { pr: [], power: [] });
      const bucket = byDate.get(dk)!;
      bucket.pr.push(t.performanceRatio);
      bucket.power.push(t.powerOutput);
    }

    performanceTrends = [];
    byDate.forEach((vals, date) => {
      const avgPR = Math.round((vals.pr.reduce((a, b) => a + b, 0) / vals.pr.length) * 10) / 10;
      const avgPower = Math.round((vals.power.reduce((a, b) => a + b, 0) / vals.power.length) * 100) / 100;
      performanceTrends.push({
        date,
        performanceRatio: avgPR,
        expectedRatio: Math.round((90 + Math.sin(performanceTrends.length * 0.2) * 2) * 10) / 10,
        powerOutput: avgPower,
      });
    });
  } else {
    performanceTrends = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 29 + i);
      const base = 88 + Math.sin(i * 0.3) * 4;
      return {
        date: d.toISOString().split("T")[0],
        performanceRatio: Math.round((base + (Math.random() - 0.5) * 3) * 10) / 10,
        expectedRatio: Math.round((90 + Math.sin(i * 0.2) * 2) * 10) / 10,
        powerOutput: Math.round((1.8 + Math.sin(i * 0.25) * 0.3) * 100) / 100,
      };
    });
  }

  // ── AI Insights (ML-powered when available) ──
  const mlPredictions = await getMLPredictions(dbInverters);

  let aiInsights: AIInsight[];
  if (mlPredictions && mlPredictions.length > 0) {
    // ML model provides risk scores — use them for insights
    aiInsights = mlPredictions
      .filter((p) => p.risk_score > 0.25) // Only non-trivial risks
      .map((p) => {
        const inv = inverters.find((i) => i.id === p.inverter_id);
        return {
          id: `insight-${p.inverter_id}`,
          inverterId: p.inverter_id,
          inverterName: inv?.name || p.inverter_id,
          riskLevel: p.risk_level as "critical" | "high" | "medium" | "low",
          summary: p.failure_predicted
            ? `ML model predicts ${Math.round(p.risk_score * 100)}% failure probability — ${p.status}`
            : `Risk assessment: ${Math.round(p.risk_score * 100)}% — ${p.status}`,
          reasoning: `Top contributing factors: ${p.top_factors.join(". ")}`,
          recommendations: [
            p.recommended_action,
            ...(inv && inv.temperature > 60 ? ["Inspect cooling system — elevated temperature detected."] : []),
            ...(inv && inv.efficiency < 85 ? ["Schedule MPPT recalibration."] : []),
          ],
          confidence: p.risk_score,
          generatedAt: new Date().toISOString(),
        };
      });

    // Update predictedFailures count with ML data
    systemHealth.predictedFailures = mlPredictions.filter((p) => p.failure_predicted).length;
  } else {
    // Fallback: rule-based insights
    aiInsights = inverters
      .filter((i) => i.status === "critical" || i.status === "warning")
      .map((inv) => ({
        id: `insight-${inv.id}`,
        inverterId: inv.id,
        inverterName: inv.name,
        riskLevel: inv.status === "critical" ? ("critical" as const) : ("high" as const),
        summary:
          inv.status === "critical"
            ? `Critical performance degradation — ${inv.performanceRatio}% PR with risk score ${inv.riskScore}.`
            : `Warning: performance ratio at ${inv.performanceRatio}% — monitoring for further decline.`,
        reasoning: `Temperature: ${inv.temperature}°C, Efficiency: ${inv.efficiency}%, Power: ${inv.powerOutput}kW / ${inv.capacity}kW capacity.`,
        recommendations: [
          inv.temperature > 65
            ? "Reduce load immediately and inspect cooling system."
            : "Monitor temperature trend over next 48 hours.",
          inv.efficiency < 85
            ? "Schedule efficiency diagnostic and MPPT recalibration."
            : "Efficiency within acceptable range.",
          `Current risk score: ${inv.riskScore}/100.`,
        ],
        confidence: inv.status === "critical" ? 0.92 : 0.78,
        generatedAt: new Date().toISOString(),
      }));
  }

  logger.info("Dashboard data assembled", {
    inverters: inverters.length,
    trends: performanceTrends.length,
    insightSource: mlPredictions ? "ml-model" : "rule-based",
  });

  return { systemHealth, inverters, performanceTrends, aiInsights };
}
