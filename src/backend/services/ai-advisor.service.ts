/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: AI Advisor Service
 * ─────────────────────────────────────────────────────────
 * Generates insights, anomalies, forecast, maintenance, risk.
 */

import { connectDB } from "@/backend/config";
import { Inverter as InverterModel } from "@/backend/models";
import logger from "@/backend/utils/logger";
import type { AIAdvisorData, Anomaly, AIInsight, SolarForecast, MaintenanceItem, RiskTimelinePoint } from "@/types";

export async function getAIAdvisorData(): Promise<AIAdvisorData> {
  await connectDB();

  const dbInverters = await InverterModel.find({}).lean();

  if (dbInverters.length === 0) {
    const { fetchAIAdvisor } = await import("@/lib/mock-data");
    return fetchAIAdvisor();
  }

  const anomalies: Anomaly[] = [];
  const insights: AIInsight[] = [];
  const maintenance: MaintenanceItem[] = [];

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
          inv.efficiency < 85 ? "Schedule MPPT recalibration and efficiency diagnostic." : "Efficiency acceptable.",
          `Risk score: ${inv.riskScore}/100.`,
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
        notes: `Auto-generated from AI analysis. Risk score: ${inv.riskScore}.`,
      });
    }
  }

  // ── 48hr Solar Forecast ──
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

  logger.info("AI Advisor data assembled", { anomalies: anomalies.length, insights: insights.length });

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
