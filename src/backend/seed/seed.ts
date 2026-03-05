/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: Database Seed Script
 * ─────────────────────────────────────────────────────────
 * Populates MongoDB with the 8 demo inverters and
 * synthetic telemetry data. Called via GET /api/seed.
 */

import { connectDB } from "@/backend/config";
import { Inverter, TelemetryRecord } from "@/backend/models";
import logger from "@/backend/utils/logger";

const INVERTER_SEED_DATA = [
  {
    inverterId: "INV-001", name: "Aurora-7 Block A", location: "Rajasthan, Sector 12",
    status: "healthy", performanceRatio: 94.2, temperature: 42, powerOutput: 248.5,
    riskScore: 8, uptime: 99.7, inverterModel: "SolarEdge SE250K", capacity: 250,
    installDate: "2024-06-15", firmware: "v4.12.3", dcVoltage: 620, acVoltage: 233.8,
    frequency: 49.98, currentOutput: 362, dailyYield: 1842, lifetimeYield: 1245.6,
    efficiency: 98.1,
    strings: [
      { stringId: "S1", voltage: 620, current: 9.2, power: 5704, status: "healthy" },
      { stringId: "S2", voltage: 618, current: 9.1, power: 5624, status: "healthy" },
      { stringId: "S3", voltage: 622, current: 9.3, power: 5785, status: "healthy" },
    ],
  },
  {
    inverterId: "INV-002", name: "Aurora-7 Block B", location: "Rajasthan, Sector 12",
    status: "healthy", performanceRatio: 91.8, temperature: 44, powerOutput: 235.1,
    riskScore: 12, uptime: 99.2, inverterModel: "SolarEdge SE250K", capacity: 250,
    installDate: "2024-06-15", firmware: "v4.12.3", dcVoltage: 615, acVoltage: 233.5,
    frequency: 49.96, currentOutput: 345, dailyYield: 1756, lifetimeYield: 1198.3,
    efficiency: 97.6,
    strings: [
      { stringId: "S1", voltage: 616, current: 9.0, power: 5544, status: "healthy" },
      { stringId: "S2", voltage: 614, current: 8.9, power: 5465, status: "healthy" },
      { stringId: "S3", voltage: 615, current: 8.8, power: 5412, status: "warning" },
    ],
  },
  {
    inverterId: "INV-003", name: "Solaris-9 East Wing", location: "Gujarat, Zone 4",
    status: "warning", performanceRatio: 78.4, temperature: 58, powerOutput: 187.3,
    riskScore: 45, uptime: 96.1, inverterModel: "Huawei SUN2000-215", capacity: 215,
    installDate: "2024-03-22", firmware: "v3.8.1", dcVoltage: 580, acVoltage: 231.2,
    frequency: 49.92, currentOutput: 278, dailyYield: 1320, lifetimeYield: 945.7,
    efficiency: 91.4,
    strings: [
      { stringId: "S1", voltage: 582, current: 8.4, power: 4889, status: "healthy" },
      { stringId: "S2", voltage: 560, current: 7.2, power: 4032, status: "warning" },
      { stringId: "S3", voltage: 578, current: 8.1, power: 4682, status: "healthy" },
    ],
  },
  {
    inverterId: "INV-004", name: "Helios-3 Central", location: "Tamil Nadu, Grid 7",
    status: "critical", performanceRatio: 52.1, temperature: 72, powerOutput: 98.6,
    riskScore: 87, uptime: 88.4, inverterModel: "ABB PVS-175", capacity: 175,
    installDate: "2023-11-08", firmware: "v2.9.7", dcVoltage: 480, acVoltage: 228.1,
    frequency: 49.85, currentOutput: 148, dailyYield: 624, lifetimeYield: 712.3,
    efficiency: 78.2,
    strings: [
      { stringId: "S1", voltage: 485, current: 6.2, power: 3007, status: "warning" },
      { stringId: "S2", voltage: 440, current: 4.1, power: 1804, status: "critical" },
      { stringId: "S3", voltage: 478, current: 5.8, power: 2772, status: "warning" },
    ],
  },
  {
    inverterId: "INV-005", name: "Zenith-12 North", location: "Karnataka, Area 3",
    status: "healthy", performanceRatio: 96.7, temperature: 38, powerOutput: 262.4,
    riskScore: 5, uptime: 99.9, inverterModel: "SMA Sunny Tripower 250", capacity: 250,
    installDate: "2025-01-10", firmware: "v5.1.0", dcVoltage: 640, acVoltage: 234.2,
    frequency: 50.01, currentOutput: 380, dailyYield: 1920, lifetimeYield: 680.4,
    efficiency: 98.8,
    strings: [
      { stringId: "S1", voltage: 642, current: 9.5, power: 6099, status: "healthy" },
      { stringId: "S2", voltage: 638, current: 9.4, power: 5997, status: "healthy" },
      { stringId: "S3", voltage: 641, current: 9.5, power: 6090, status: "healthy" },
    ],
  },
  {
    inverterId: "INV-006", name: "Prism-4 Module C", location: "Maharashtra, Sector 8",
    status: "warning", performanceRatio: 74.2, temperature: 55, powerOutput: 172.8,
    riskScore: 52, uptime: 94.8, inverterModel: "Growatt MAX 200KTL3", capacity: 200,
    installDate: "2024-08-30", firmware: "v3.2.4", dcVoltage: 565, acVoltage: 230.8,
    frequency: 49.90, currentOutput: 252, dailyYield: 1180, lifetimeYield: 560.2,
    efficiency: 89.7,
    strings: [
      { stringId: "S1", voltage: 568, current: 7.8, power: 4430, status: "healthy" },
      { stringId: "S2", voltage: 545, current: 6.5, power: 3543, status: "warning" },
      { stringId: "S3", voltage: 562, current: 7.5, power: 4215, status: "healthy" },
    ],
  },
  {
    inverterId: "INV-007", name: "Nova-6 South Array", location: "Andhra Pradesh, Zone 2",
    status: "healthy", performanceRatio: 92.5, temperature: 41, powerOutput: 241.9,
    riskScore: 10, uptime: 99.5, inverterModel: "SolarEdge SE250K", capacity: 250,
    installDate: "2024-09-12", firmware: "v4.12.3", dcVoltage: 625, acVoltage: 234.0,
    frequency: 49.99, currentOutput: 352, dailyYield: 1798, lifetimeYield: 432.1,
    efficiency: 97.8,
    strings: [
      { stringId: "S1", voltage: 626, current: 9.1, power: 5697, status: "healthy" },
      { stringId: "S2", voltage: 624, current: 9.0, power: 5616, status: "healthy" },
      { stringId: "S3", voltage: 625, current: 9.1, power: 5688, status: "healthy" },
    ],
  },
  {
    inverterId: "INV-008", name: "Eclipse-2 West", location: "Madhya Pradesh, Grid 5",
    status: "critical", performanceRatio: 38.9, temperature: 78, powerOutput: 67.2,
    riskScore: 93, uptime: 82.1, inverterModel: "ABB PVS-175", capacity: 175,
    installDate: "2023-09-20", firmware: "v2.9.5", dcVoltage: 420, acVoltage: 226.4,
    frequency: 49.78, currentOutput: 102, dailyYield: 398, lifetimeYield: 834.6,
    efficiency: 68.5,
    strings: [
      { stringId: "S1", voltage: 425, current: 4.8, power: 2040, status: "critical" },
      { stringId: "S2", voltage: 410, current: 3.2, power: 1312, status: "critical" },
      { stringId: "S3", voltage: 418, current: 4.1, power: 1714, status: "critical" },
    ],
  },
];

/** Generate synthetic telemetry for an inverter */
function generateTelemetry(inverterId: string, baseTemp: number, baseEff: number, basePR: number, basePower: number) {
  const records = [];
  const now = new Date();

  for (let day = 29; day >= 0; day--) {
    for (let hour = 6; hour <= 18; hour++) {
      const ts = new Date(now);
      ts.setDate(ts.getDate() - day);
      ts.setHours(hour, 0, 0, 0);

      const solarFactor = Math.sin(((hour - 6) / 12) * Math.PI);
      records.push({
        inverterId,
        timestamp: ts,
        dcVoltage: 580 + Math.random() * 60,
        acVoltage: 228 + Math.random() * 8,
        current: basePower * solarFactor * 0.4 + (Math.random() - 0.5) * 20,
        temperature: baseTemp + (Math.random() - 0.5) * 6 + solarFactor * 5,
        frequency: 49.9 + Math.random() * 0.2,
        powerOutput: basePower * solarFactor + (Math.random() - 0.5) * 20,
        efficiency: baseEff + (Math.random() - 0.5) * 3,
        performanceRatio: basePR + (Math.random() - 0.5) * 4,
        irradiance: Math.round(solarFactor * 950 + (Math.random() - 0.5) * 50),
        ambientTemp: 28 + Math.sin(((hour - 6) / 24) * Math.PI * 2) * 8,
        dailyYield: basePower * solarFactor * 0.8,
        stringVoltages: [580 + Math.random() * 60, 578 + Math.random() * 60, 582 + Math.random() * 60],
        stringCurrents: [8 + Math.random() * 2, 7.5 + Math.random() * 2, 8.2 + Math.random() * 2],
      });
    }
  }
  return records;
}

export async function seedDatabase(): Promise<{ inverters: number; telemetry: number }> {
  await connectDB();

  // Check if already seeded
  const existing = await Inverter.countDocuments();
  if (existing > 0) {
    logger.info("Database already seeded, skipping", { existingInverters: existing });
    return { inverters: existing, telemetry: 0 };
  }

  // Seed inverters
  const inverterDocs = INVERTER_SEED_DATA.map((inv) => ({
    ...inv,
    installDate: new Date(inv.installDate),
    lastUpdated: new Date(),
  }));

  await Inverter.insertMany(inverterDocs);
  logger.info("Inverters seeded", { count: inverterDocs.length });

  // Seed telemetry (13 hours/day * 30 days * 8 inverters = ~3120 records)
  const allTelemetry: ReturnType<typeof generateTelemetry> = [];
  const baseParams: [string, number, number, number, number][] = [
    ["INV-001", 42, 98.1, 94.2, 248.5],
    ["INV-002", 44, 97.6, 91.8, 235.1],
    ["INV-003", 58, 91.4, 78.4, 187.3],
    ["INV-004", 72, 78.2, 52.1, 98.6],
    ["INV-005", 38, 98.8, 96.7, 262.4],
    ["INV-006", 55, 89.7, 74.2, 172.8],
    ["INV-007", 41, 97.8, 92.5, 241.9],
    ["INV-008", 78, 68.5, 38.9, 67.2],
  ];

  for (const [id, temp, eff, pr, power] of baseParams) {
    allTelemetry.push(...generateTelemetry(id, temp, eff, pr, power));
  }

  // Insert in batches of 500
  for (let i = 0; i < allTelemetry.length; i += 500) {
    const batch = allTelemetry.slice(i, i + 500);
    await TelemetryRecord.insertMany(batch, { ordered: false });
  }

  logger.info("Telemetry seeded", { count: allTelemetry.length });

  return { inverters: inverterDocs.length, telemetry: allTelemetry.length };
}
