/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: Live Energy Service
 * ─────────────────────────────────────────────────────────
 */

import { connectDB } from "@/backend/config";
import { Inverter as InverterModel } from "@/backend/models";
import logger from "@/backend/utils/logger";
import type { LiveEnergyData, WaveformPoint } from "@/types";

function generateWaveform(): WaveformPoint[] {
  const now = new Date();
  return Array.from({ length: 60 }, (_, i) => {
    const t = new Date(now.getTime() - (59 - i) * 10000);
    const hour = t.getHours() + t.getMinutes() / 60;
    const solarBase = hour >= 6 && hour <= 18 ? Math.sin(((hour - 6) / 12) * Math.PI) * 12 : 0;
    return {
      time: t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
      solar: Math.round((solarBase + (Math.random() - 0.5) * 0.8) * 100) / 100,
      load: Math.round((2.5 + Math.sin(i * 0.15) * 0.8 + (Math.random() - 0.5) * 0.3) * 100) / 100,
    };
  });
}

export async function getLiveEnergyData(): Promise<LiveEnergyData> {
  await connectDB();

  const dbInverters = await InverterModel.find({}).lean();

  if (dbInverters.length === 0) {
    const { fetchLiveEnergy } = await import("@/lib/mock-data");
    return fetchLiveEnergy();
  }

  const totalSolar = dbInverters.reduce((s, i) => s + i.powerOutput, 0);
  const avgVoltage = dbInverters.reduce((s, i) => s + i.acVoltage, 0) / dbInverters.length;
  const avgFreq = dbInverters.reduce((s, i) => s + i.frequency, 0) / dbInverters.length;
  const totalDaily = dbInverters.reduce((s, i) => s + i.dailyYield, 0);

  const solarKW = Math.round((totalSolar / 1000) * 100) / 100;
  const loadKW = Math.round(solarKW * 0.22 * 100) / 100;
  const exportKW = Math.round((solarKW - loadKW) * 100) / 100;

  logger.info("Live energy data assembled", { solarKW, loadKW });

  return {
    solarPower: solarKW,
    loadPower: loadKW,
    gridVoltage: Math.round(avgVoltage * 10) / 10,
    gridFrequency: Math.round(avgFreq * 100) / 100,
    batteryLevel: 87,
    batteryStatus: solarKW > loadKW ? "charging" : "discharging",
    batteryTimeRemaining: `~${Math.round((87 / Math.max(loadKW, 0.1)) * 10) / 10} hrs at current load`,
    isExporting: exportKW > 0,
    gridExport: Math.max(0, exportKW),
    gridImport: Math.max(0, -exportKW),
    timestamp: new Date().toISOString(),
    waveformData: generateWaveform(),
    todaySummary: {
      totalGenerated: Math.round((totalDaily / 1000) * 10) / 10,
      totalConsumed: Math.round((totalDaily / 1000) * 0.53 * 10) / 10,
      netGridPosition: Math.round((totalDaily / 1000) * 0.47 * 10) / 10,
      selfSufficiency: 100,
      peakSolarHour: "12:00",
      peakLoadHour: "18:00",
      co2Avoided: Math.round((totalDaily / 1000) * 0.8 * 10) / 10,
    },
  };
}
