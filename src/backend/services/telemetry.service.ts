/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: Telemetry Service
 * ─────────────────────────────────────────────────────────
 * Telemetry queries + bulk ingestion logic.
 */

import { connectDB } from "@/backend/config";
import { TelemetryRecord } from "@/backend/models";
import logger from "@/backend/utils/logger";

/** Get telemetry for an inverter (last N days) */
export async function getInverterTelemetry(
  inverterId: string,
  days: number
): Promise<{
  inverterId: string;
  period: string;
  count: number;
  records: Record<string, unknown>[];
}> {
  await connectDB();

  const clampedDays = Math.min(Math.max(days, 1), 90);
  const since = new Date();
  since.setDate(since.getDate() - clampedDays);

  const records = await TelemetryRecord.find({
    inverterId,
    timestamp: { $gte: since },
  })
    .sort({ timestamp: -1 })
    .limit(clampedDays * 24)
    .lean();

  const mapped = records.map((r) => ({
    timestamp: r.timestamp.toISOString(),
    dcVoltage: r.dcVoltage,
    acVoltage: r.acVoltage,
    current: r.current,
    temperature: r.temperature,
    frequency: r.frequency,
    powerOutput: r.powerOutput,
    efficiency: r.efficiency,
    performanceRatio: r.performanceRatio,
    irradiance: r.irradiance,
    ambientTemp: r.ambientTemp,
    dailyYield: r.dailyYield,
    stringVoltages: r.stringVoltages,
    stringCurrents: r.stringCurrents,
  }));

  logger.info("Telemetry fetched", { inverterId, records: mapped.length, days: clampedDays });

  return {
    inverterId,
    period: `${clampedDays} days`,
    count: mapped.length,
    records: mapped,
  };
}

/** Bulk ingest telemetry records */
export async function ingestTelemetry(
  records: Record<string, unknown>[]
): Promise<{ inserted: number }> {
  await connectDB();

  const docs = records.map((r) => ({
    inverterId: r.inverterId,
    timestamp: new Date(r.timestamp as string),
    dcVoltage: r.dcVoltage || 0,
    acVoltage: r.acVoltage || 0,
    current: r.current || 0,
    temperature: r.temperature || 0,
    frequency: r.frequency || 50,
    powerOutput: r.powerOutput || 0,
    efficiency: r.efficiency || 0,
    performanceRatio: r.performanceRatio || 0,
    irradiance: r.irradiance || 0,
    ambientTemp: r.ambientTemp || 0,
    dailyYield: r.dailyYield || 0,
    stringVoltages: r.stringVoltages || [],
    stringCurrents: r.stringCurrents || [],
  }));

  const result = await TelemetryRecord.insertMany(docs, { ordered: false });

  logger.info("Telemetry ingested", { inserted: result.length, total: docs.length });
  return { inserted: result.length };
}
