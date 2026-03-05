/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: Analytics Service
 * ─────────────────────────────────────────────────────────
 */

import { connectDB } from "@/backend/config";
import { Inverter as InverterModel, TelemetryRecord } from "@/backend/models";
import logger from "@/backend/utils/logger";
import type { AnalyticsData } from "@/types";

export async function getAnalyticsData(): Promise<AnalyticsData> {
  await connectDB();

  const dbInverters = await InverterModel.find({}).lean();

  if (dbInverters.length === 0) {
    const { fetchAnalytics } = await import("@/lib/mock-data");
    return fetchAnalytics();
  }

  // ── Ranking from DB ──
  const inverterRanking = dbInverters
    .map((inv) => ({
      id: inv.inverterId,
      name: inv.name,
      performance: inv.performanceRatio,
      yield: inv.dailyYield,
      rank: 0,
    }))
    .sort((a, b) => b.performance - a.performance)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  // ── Daily generation from telemetry ──
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const telemetry = await TelemetryRecord.find({ timestamp: { $gte: thirtyDaysAgo } })
    .sort({ timestamp: 1 })
    .lean();

  let dailyGeneration;
  if (telemetry.length > 30) {
    const byDate = new Map<string, number[]>();
    for (const t of telemetry) {
      const dk = t.timestamp.toISOString().split("T")[0];
      if (!byDate.has(dk)) byDate.set(dk, []);
      byDate.get(dk)!.push(t.powerOutput);
    }
    dailyGeneration = Array.from(byDate.entries()).map(([date, powers]) => {
      const gen = Math.round((powers.reduce((a, b) => a + b, 0) / powers.length) * 10) / 10;
      const cons = Math.round(gen * 0.53 * 10) / 10;
      return {
        date,
        generated: gen,
        consumed: cons,
        exported: Math.round((gen - cons) * 0.7 * 10) / 10,
        imported: Math.round(Math.max(0, cons - gen * 0.5) * 10) / 10,
      };
    });
  } else {
    dailyGeneration = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 29 + i);
      const gen = 85 + Math.sin(i * 0.3) * 20 + (Math.random() - 0.5) * 10;
      const cons = 45 + Math.sin(i * 0.2) * 8 + (Math.random() - 0.5) * 5;
      return {
        date: d.toISOString().split("T")[0],
        generated: Math.round(gen * 10) / 10,
        consumed: Math.round(cons * 10) / 10,
        exported: Math.round((gen - cons) * 0.7 * 10) / 10,
        imported: Math.round(Math.max(0, cons - gen * 0.5) * 10) / 10,
      };
    });
  }

  // ── Synthetic data for demo ──
  const monthlyComparison = [
    { month: "Sep", thisYear: 2840, lastYear: 2650, target: 2800 },
    { month: "Oct", thisYear: 2920, lastYear: 2780, target: 2900 },
    { month: "Nov", thisYear: 2650, lastYear: 2520, target: 2700 },
    { month: "Dec", thisYear: 2380, lastYear: 2210, target: 2400 },
    { month: "Jan", thisYear: 2510, lastYear: 2340, target: 2500 },
    { month: "Feb", thisYear: 2780, lastYear: 2600, target: 2750 },
    { month: "Mar", thisYear: 1420, lastYear: 2850, target: 2900 },
  ];

  const degradationAnalysis = Array.from({ length: 12 }, (_, i) => {
    const d = new Date("2025-04-01");
    d.setMonth(d.getMonth() + i);
    const expected = 92 - i * 0.05;
    return {
      month: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      actual: Math.round((expected - i * 0.08 - (Math.random() - 0.5) * 0.5) * 100) / 100,
      expected: Math.round(expected * 100) / 100,
      degradation: Math.round(i * 0.08 * 100) / 100,
    };
  });

  const heatmapData = Array.from({ length: 7 * 24 }, (_, i) => {
    const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][Math.floor(i / 24)];
    const hour = i % 24;
    const isSunny = hour >= 6 && hour <= 18;
    return {
      hour,
      day,
      value: isSunny
        ? Math.round((Math.sin(((hour - 6) / 12) * Math.PI) * 85 + (Math.random() - 0.5) * 15) * 10) / 10
        : 0,
    };
  });

  const energyMix = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 13 + i);
    return {
      date: d.toISOString().split("T")[0],
      solar: Math.round((65 + (Math.random() - 0.5) * 15) * 10) / 10,
      grid: Math.round((20 + (Math.random() - 0.5) * 10) * 10) / 10,
      battery: Math.round((15 + (Math.random() - 0.5) * 8) * 10) / 10,
    };
  });

  logger.info("Analytics data assembled", { inverters: dbInverters.length });

  return { dailyGeneration, monthlyComparison, inverterRanking, degradationAnalysis, heatmapData, energyMix };
}
