/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Complete Mock Data Layer
 * ─────────────────────────────────────────────────────────
 */

import type {
  DashboardData, Inverter, PerformanceTrend, AIInsight,
  SystemHealth, LiveEnergyData, WaveformPoint, AnalyticsData,
  GridData, AIAdvisorData, Anomaly, SolarForecast,
  MaintenanceItem, RiskTimelinePoint, UserProfile,
} from "@/types";

/* ═══════════════════════════════════════════════════════════
   INVERTER FLEET
   ═══════════════════════════════════════════════════════════ */
const inverters: Inverter[] = [
  {
    id: "INV-001", name: "Aurora-7 Block A", location: "Rajasthan, Sector 12",
    status: "healthy", performanceRatio: 94.2, temperature: 42, powerOutput: 248.5,
    riskScore: 8, lastUpdated: "2026-03-05T09:30:00Z", uptime: 99.7,
    model: "SolarEdge SE250K", capacity: 250, installDate: "2024-06-15",
    firmware: "v4.12.3", dcVoltage: 620, acVoltage: 233.8, frequency: 49.98,
    currentOutput: 362, dailyYield: 1842, lifetimeYield: 1245.6, efficiency: 98.1,
    strings: [
      { id: "S1", voltage: 620, current: 9.2, power: 5704, status: "healthy" },
      { id: "S2", voltage: 618, current: 9.1, power: 5624, status: "healthy" },
      { id: "S3", voltage: 622, current: 9.3, power: 5785, status: "healthy" },
    ],
  },
  {
    id: "INV-002", name: "Aurora-7 Block B", location: "Rajasthan, Sector 12",
    status: "healthy", performanceRatio: 91.8, temperature: 44, powerOutput: 235.1,
    riskScore: 12, lastUpdated: "2026-03-05T09:28:00Z", uptime: 99.2,
    model: "SolarEdge SE250K", capacity: 250, installDate: "2024-06-15",
    firmware: "v4.12.3", dcVoltage: 615, acVoltage: 233.5, frequency: 49.96,
    currentOutput: 345, dailyYield: 1756, lifetimeYield: 1198.3, efficiency: 97.6,
    strings: [
      { id: "S1", voltage: 616, current: 9.0, power: 5544, status: "healthy" },
      { id: "S2", voltage: 614, current: 8.9, power: 5465, status: "healthy" },
      { id: "S3", voltage: 615, current: 8.8, power: 5412, status: "warning" },
    ],
  },
  {
    id: "INV-003", name: "Solaris-9 East Wing", location: "Gujarat, Zone 4",
    status: "warning", performanceRatio: 78.4, temperature: 58, powerOutput: 187.3,
    riskScore: 45, lastUpdated: "2026-03-05T09:25:00Z", uptime: 96.1,
    model: "Huawei SUN2000-215", capacity: 215, installDate: "2024-03-22",
    firmware: "v3.8.1", dcVoltage: 580, acVoltage: 231.2, frequency: 49.92,
    currentOutput: 278, dailyYield: 1320, lifetimeYield: 945.7, efficiency: 91.4,
    strings: [
      { id: "S1", voltage: 582, current: 8.4, power: 4889, status: "healthy" },
      { id: "S2", voltage: 560, current: 7.2, power: 4032, status: "warning" },
      { id: "S3", voltage: 578, current: 8.1, power: 4682, status: "healthy" },
    ],
  },
  {
    id: "INV-004", name: "Helios-3 Central", location: "Tamil Nadu, Grid 7",
    status: "critical", performanceRatio: 52.1, temperature: 72, powerOutput: 98.6,
    riskScore: 87, lastUpdated: "2026-03-05T09:15:00Z", uptime: 88.4,
    model: "ABB PVS-175", capacity: 175, installDate: "2023-11-08",
    firmware: "v2.9.7", dcVoltage: 480, acVoltage: 228.1, frequency: 49.85,
    currentOutput: 148, dailyYield: 624, lifetimeYield: 712.3, efficiency: 78.2,
    strings: [
      { id: "S1", voltage: 485, current: 6.2, power: 3007, status: "warning" },
      { id: "S2", voltage: 440, current: 4.1, power: 1804, status: "critical" },
      { id: "S3", voltage: 478, current: 5.8, power: 2772, status: "warning" },
    ],
  },
  {
    id: "INV-005", name: "Zenith-12 North", location: "Karnataka, Area 3",
    status: "healthy", performanceRatio: 96.7, temperature: 38, powerOutput: 262.4,
    riskScore: 5, lastUpdated: "2026-03-05T09:32:00Z", uptime: 99.9,
    model: "SMA Sunny Tripower 250", capacity: 250, installDate: "2025-01-10",
    firmware: "v5.1.0", dcVoltage: 640, acVoltage: 234.2, frequency: 50.01,
    currentOutput: 380, dailyYield: 1920, lifetimeYield: 680.4, efficiency: 98.8,
    strings: [
      { id: "S1", voltage: 642, current: 9.5, power: 6099, status: "healthy" },
      { id: "S2", voltage: 638, current: 9.4, power: 5997, status: "healthy" },
      { id: "S3", voltage: 641, current: 9.5, power: 6090, status: "healthy" },
    ],
  },
  {
    id: "INV-006", name: "Prism-4 Module C", location: "Maharashtra, Sector 8",
    status: "warning", performanceRatio: 74.2, temperature: 55, powerOutput: 172.8,
    riskScore: 52, lastUpdated: "2026-03-05T09:20:00Z", uptime: 94.8,
    model: "Growatt MAX 200KTL3", capacity: 200, installDate: "2024-08-30",
    firmware: "v3.2.4", dcVoltage: 565, acVoltage: 230.8, frequency: 49.90,
    currentOutput: 252, dailyYield: 1180, lifetimeYield: 560.2, efficiency: 89.7,
    strings: [
      { id: "S1", voltage: 568, current: 7.8, power: 4430, status: "healthy" },
      { id: "S2", voltage: 545, current: 6.5, power: 3543, status: "warning" },
      { id: "S3", voltage: 562, current: 7.5, power: 4215, status: "healthy" },
    ],
  },
  {
    id: "INV-007", name: "Nova-6 South Array", location: "Andhra Pradesh, Zone 2",
    status: "healthy", performanceRatio: 92.5, temperature: 41, powerOutput: 241.9,
    riskScore: 10, lastUpdated: "2026-03-05T09:31:00Z", uptime: 99.5,
    model: "SolarEdge SE250K", capacity: 250, installDate: "2024-09-12",
    firmware: "v4.12.3", dcVoltage: 625, acVoltage: 234.0, frequency: 49.99,
    currentOutput: 352, dailyYield: 1798, lifetimeYield: 432.1, efficiency: 97.8,
    strings: [
      { id: "S1", voltage: 626, current: 9.1, power: 5697, status: "healthy" },
      { id: "S2", voltage: 624, current: 9.0, power: 5616, status: "healthy" },
      { id: "S3", voltage: 625, current: 9.1, power: 5688, status: "healthy" },
    ],
  },
  {
    id: "INV-008", name: "Eclipse-2 West", location: "Madhya Pradesh, Grid 5",
    status: "critical", performanceRatio: 38.9, temperature: 78, powerOutput: 67.2,
    riskScore: 93, lastUpdated: "2026-03-05T09:10:00Z", uptime: 82.1,
    model: "ABB PVS-175", capacity: 175, installDate: "2023-09-20",
    firmware: "v2.9.5", dcVoltage: 420, acVoltage: 226.4, frequency: 49.78,
    currentOutput: 102, dailyYield: 398, lifetimeYield: 834.6, efficiency: 68.5,
    strings: [
      { id: "S1", voltage: 425, current: 4.8, power: 2040, status: "critical" },
      { id: "S2", voltage: 410, current: 3.2, power: 1312, status: "critical" },
      { id: "S3", voltage: 418, current: 4.1, power: 1714, status: "critical" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   30-DAY PERFORMANCE TREND
   ═══════════════════════════════════════════════════════════ */
const performanceTrends: PerformanceTrend[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date("2026-02-04");
  date.setDate(date.getDate() + i);
  const base = 88 + Math.sin(i * 0.3) * 4;
  return {
    date: date.toISOString().split("T")[0],
    performanceRatio: Math.round((base + (Math.random() - 0.5) * 3) * 10) / 10,
    expectedRatio: Math.round((90 + Math.sin(i * 0.2) * 2) * 10) / 10,
    powerOutput: Math.round((1.8 + Math.sin(i * 0.25) * 0.3 + (Math.random() - 0.5) * 0.1) * 100) / 100,
  };
});

/* ═══════════════════════════════════════════════════════════
   AI INSIGHTS
   ═══════════════════════════════════════════════════════════ */
const aiInsights: AIInsight[] = [
  {
    id: "insight-001", inverterId: "INV-004", inverterName: "Helios-3 Central",
    riskLevel: "critical",
    summary: "IGBT module thermal degradation detected — imminent failure within 72 hours.",
    reasoning: "Analysis of the last 14 days reveals a consistent upward drift in junction temperature (+2.3°C/day) coupled with a 38% drop in conversion efficiency. The voltage ripple pattern on DC bus matches known IGBT gate oxide breakdown signatures. Historical fleet data from 847 similar failure events confirms this trajectory with 94% accuracy.",
    recommendations: [
      "Immediately reduce load to 60% of rated capacity to slow thermal degradation.",
      "Schedule emergency IGBT module replacement within 48 hours.",
      "Inspect DC bus capacitors for ESR degradation — co-failure rate is 23%.",
      "Deploy portable monitoring unit for real-time thermal imaging during wind-down.",
    ],
    confidence: 0.94, generatedAt: "2026-03-05T08:00:00Z",
  },
  {
    id: "insight-002", inverterId: "INV-008", inverterName: "Eclipse-2 West",
    riskLevel: "critical",
    summary: "Capacitor bank ESR anomaly — progressive degradation pattern identified.",
    reasoning: "Frequency-domain analysis of output current harmonics reveals a 340% increase in 3rd-order distortion over 21 days, characteristic of electrolytic capacitor drying. The ambient temperature profile at this installation (avg 45°C) accelerates aging by a factor of 2.4x compared to rated conditions.",
    recommendations: [
      "Order replacement capacitor bank (P/N: ECB-4400-HT) — lead time 5 days.",
      "Reduce switching frequency by 15% to decrease capacitor ripple current stress.",
      "Install supplementary cooling fans on the capacitor bay as an interim measure.",
      "Run full harmonic compliance test post-replacement to verify grid code adherence.",
    ],
    confidence: 0.89, generatedAt: "2026-03-05T08:15:00Z",
  },
  {
    id: "insight-003", inverterId: "INV-003", inverterName: "Solaris-9 East Wing",
    riskLevel: "high",
    summary: "MPPT tracking efficiency decline — partial string shading or PV degradation suspected.",
    reasoning: "The MPPT controller is operating 12% below the theoretical maximum power point, with hunting oscillations visible in the I-V curve sampling data. Correlation with satellite irradiance data rules out weather anomalies.",
    recommendations: [
      "Dispatch drone-based thermal inspection to identify hot-spot cells.",
      "Cross-reference with site construction logs for new shading obstructions.",
      "If PID confirmed, schedule anti-PID voltage treatment during next maintenance window.",
      "Update MPPT algorithm parameters to widen tracking bandwidth by 8%.",
    ],
    confidence: 0.82, generatedAt: "2026-03-05T08:30:00Z",
  },
];

/* ═══════════════════════════════════════════════════════════
   SYSTEM HEALTH AGGREGATE
   ═══════════════════════════════════════════════════════════ */
const systemHealth: SystemHealth = {
  totalInverters: inverters.length,
  healthyCount: inverters.filter((i) => i.status === "healthy").length,
  warningCount: inverters.filter((i) => i.status === "warning").length,
  criticalCount: inverters.filter((i) => i.status === "critical").length,
  avgPerformanceRatio: Math.round((inverters.reduce((s, i) => s + i.performanceRatio, 0) / inverters.length) * 10) / 10,
  totalPowerOutput: Math.round(inverters.reduce((s, i) => s + i.powerOutput, 0) / 100) / 10,
  systemUptime: Math.round((inverters.reduce((s, i) => s + i.uptime, 0) / inverters.length) * 10) / 10,
  predictedFailures: 2,
};

/* ═══════════════════════════════════════════════════════════
   LIVE ENERGY DATA
   ═══════════════════════════════════════════════════════════ */
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

const liveEnergy: LiveEnergyData = {
  solarPower: 12.46,
  loadPower: 2.74,
  gridVoltage: 233.8,
  gridFrequency: 49.98,
  batteryLevel: 87,
  batteryStatus: "charging",
  batteryTimeRemaining: "~7.3 hrs left at current load",
  isExporting: true,
  gridExport: 9.72,
  gridImport: 0,
  timestamp: "2026-03-05T14:54:36Z",
  waveformData: generateWaveform(),
  todaySummary: {
    totalGenerated: 105.5,
    totalConsumed: 56.2,
    netGridPosition: 49.3,
    selfSufficiency: 100,
    peakSolarHour: "12:00",
    peakLoadHour: "18:00",
    co2Avoided: 84.4,
  },
};

/* ═══════════════════════════════════════════════════════════
   ANALYTICS DATA
   ═══════════════════════════════════════════════════════════ */
const analyticsData: AnalyticsData = {
  dailyGeneration: Array.from({ length: 30 }, (_, i) => {
    const date = new Date("2026-02-04");
    date.setDate(date.getDate() + i);
    const gen = 85 + Math.sin(i * 0.3) * 20 + (Math.random() - 0.5) * 10;
    const cons = 45 + Math.sin(i * 0.2) * 8 + (Math.random() - 0.5) * 5;
    return {
      date: date.toISOString().split("T")[0],
      generated: Math.round(gen * 10) / 10,
      consumed: Math.round(cons * 10) / 10,
      exported: Math.round((gen - cons) * 0.7 * 10) / 10,
      imported: Math.round(Math.max(0, cons - gen * 0.5) * 10) / 10,
    };
  }),
  monthlyComparison: [
    { month: "Sep", thisYear: 2840, lastYear: 2650, target: 2800 },
    { month: "Oct", thisYear: 2920, lastYear: 2780, target: 2900 },
    { month: "Nov", thisYear: 2650, lastYear: 2520, target: 2700 },
    { month: "Dec", thisYear: 2380, lastYear: 2210, target: 2400 },
    { month: "Jan", thisYear: 2510, lastYear: 2340, target: 2500 },
    { month: "Feb", thisYear: 2780, lastYear: 2600, target: 2750 },
    { month: "Mar", thisYear: 1420, lastYear: 2850, target: 2900 },
  ],
  inverterRanking: inverters
    .map((inv, idx) => ({
      id: inv.id, name: inv.name,
      performance: inv.performanceRatio,
      yield: inv.dailyYield,
      rank: idx + 1,
    }))
    .sort((a, b) => b.performance - a.performance)
    .map((item, idx) => ({ ...item, rank: idx + 1 })),
  degradationAnalysis: Array.from({ length: 12 }, (_, i) => {
    const d = new Date("2025-04-01");
    d.setMonth(d.getMonth() + i);
    const expected = 92 - i * 0.05;
    return {
      month: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      actual: Math.round((expected - i * 0.08 - (Math.random() - 0.5) * 0.5) * 100) / 100,
      expected: Math.round(expected * 100) / 100,
      degradation: Math.round(i * 0.08 * 100) / 100,
    };
  }),
  heatmapData: Array.from({ length: 7 * 24 }, (_, i) => {
    const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][Math.floor(i / 24)];
    const hour = i % 24;
    const isSunny = hour >= 6 && hour <= 18;
    return {
      hour, day,
      value: isSunny ? Math.round((Math.sin(((hour - 6) / 12) * Math.PI) * 85 + (Math.random() - 0.5) * 15) * 10) / 10 : 0,
    };
  }),
  energyMix: Array.from({ length: 14 }, (_, i) => {
    const d = new Date("2026-02-20");
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().split("T")[0],
      solar: Math.round((65 + (Math.random() - 0.5) * 15) * 10) / 10,
      grid: Math.round((20 + (Math.random() - 0.5) * 10) * 10) / 10,
      battery: Math.round((15 + (Math.random() - 0.5) * 8) * 10) / 10,
    };
  }),
};

/* ═══════════════════════════════════════════════════════════
   GRID / DISCOM DATA
   ═══════════════════════════════════════════════════════════ */
const gridData: GridData = {
  netMeteringStatus: "approved",
  discomName: "MSEDCL Grid",
  accountId: "EESL-SRT-002",
  meterId: "MTR-2023-002",
  feedInTariff: 5.00,
  contractValid: "Dec 2033",
  exportEarnings: 65.50,
  syncQuality: 98.4,
  voltageStability: 99.1,
  frequencyStability: 99.8,
  monthlyNetMetering: [
    { month: "Oct 2025", imported: 120, exported: 285, netAmount: 825 },
    { month: "Nov 2025", imported: 135, exported: 260, netAmount: 625 },
    { month: "Dec 2025", imported: 150, exported: 220, netAmount: 350 },
    { month: "Jan 2026", imported: 140, exported: 240, netAmount: 500 },
    { month: "Feb 2026", imported: 125, exported: 275, netAmount: 750 },
    { month: "Mar 2026", imported: 45, exported: 135, netAmount: 450 },
  ],
  gridEvents: [
    { id: "GE-001", timestamp: "2026-03-05T06:12:00Z", type: "voltage-sag", severity: "warning", duration: 340, description: "Grid voltage dropped to 218V for 5.6 minutes during morning load surge" },
    { id: "GE-002", timestamp: "2026-03-04T14:30:00Z", type: "export-limit", severity: "info", duration: 120, description: "Export power limited to 80% due to grid congestion signal from DISCOM" },
    { id: "GE-003", timestamp: "2026-03-03T22:15:00Z", type: "outage", severity: "critical", duration: 1800, description: "Complete grid outage for 30 minutes — battery backup activated" },
    { id: "GE-004", timestamp: "2026-03-02T11:45:00Z", type: "frequency-deviation", severity: "warning", duration: 60, description: "Grid frequency dropped to 49.5Hz — inverter anti-islanding triggered" },
    { id: "GE-005", timestamp: "2026-03-01T08:00:00Z", type: "sync-loss", severity: "critical", duration: 45, description: "Momentary sync loss during grid reconnection after maintenance" },
  ],
};

/* ═══════════════════════════════════════════════════════════
   AI ADVISOR DATA
   ═══════════════════════════════════════════════════════════ */
const anomalies: Anomaly[] = [
  { id: "AN-001", inverterId: "INV-004", inverterName: "Helios-3 Central", timestamp: "2026-03-05T08:45:00Z", severity: "critical", parameter: "Junction Temperature", expectedValue: 55, actualValue: 72, unit: "°C", description: "IGBT junction temperature exceeded safe operating limits by 31%", isResolved: false },
  { id: "AN-002", inverterId: "INV-008", inverterName: "Eclipse-2 West", timestamp: "2026-03-05T07:30:00Z", severity: "critical", parameter: "THD (Current)", expectedValue: 3.0, actualValue: 10.2, unit: "%", description: "Total Harmonic Distortion 3.4x above grid compliance threshold", isResolved: false },
  { id: "AN-003", inverterId: "INV-003", inverterName: "Solaris-9 East Wing", timestamp: "2026-03-05T06:15:00Z", severity: "warning", parameter: "MPPT Efficiency", expectedValue: 98.5, actualValue: 86.3, unit: "%", description: "MPPT tracking efficiency 12.4% below theoretical optimum", isResolved: false },
  { id: "AN-004", inverterId: "INV-006", inverterName: "Prism-4 Module C", timestamp: "2026-03-04T15:20:00Z", severity: "warning", parameter: "String Voltage Mismatch", expectedValue: 2.0, actualValue: 4.1, unit: "%", description: "Voltage delta between strings S1 and S2 exceeds tolerance", isResolved: false },
  { id: "AN-005", inverterId: "INV-002", inverterName: "Aurora-7 Block B", timestamp: "2026-03-04T10:00:00Z", severity: "info", parameter: "Efficiency Dip", expectedValue: 98.0, actualValue: 96.8, unit: "%", description: "Minor efficiency reduction detected — within acceptable range but trending", isResolved: true },
  { id: "AN-006", inverterId: "INV-001", inverterName: "Aurora-7 Block A", timestamp: "2026-03-03T14:00:00Z", severity: "info", parameter: "Fan Speed Increase", expectedValue: 2200, actualValue: 2800, unit: "RPM", description: "Cooling fan speed elevated — ambient temperature compensation active", isResolved: true },
];

const solarForecast: SolarForecast[] = Array.from({ length: 48 }, (_, i) => {
  const d = new Date("2026-03-05T06:00:00Z");
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

const maintenanceSchedule: MaintenanceItem[] = [
  { id: "MT-001", inverterId: "INV-004", inverterName: "Helios-3 Central", task: "Emergency IGBT Module Replacement", status: "scheduled", priority: "critical", scheduledDate: "2026-03-07", estimatedDuration: "6 hours", assignedTo: "Rajesh Kumar", notes: "P/N: IGBT-SE250-R3. Emergency procurement approved. Site access confirmed." },
  { id: "MT-002", inverterId: "INV-008", inverterName: "Eclipse-2 West", task: "Capacitor Bank Replacement + Harmonic Test", status: "scheduled", priority: "critical", scheduledDate: "2026-03-10", estimatedDuration: "8 hours", assignedTo: "Amit Patel", notes: "P/N: ECB-4400-HT ordered. Supplementary cooling installed as interim." },
  { id: "MT-003", inverterId: "INV-003", inverterName: "Solaris-9 East Wing", task: "Drone Thermal Inspection + MPPT Recalibration", status: "scheduled", priority: "high", scheduledDate: "2026-03-08", estimatedDuration: "4 hours", assignedTo: "Priya Sharma", notes: "DJI Matrice 300 RTK with radiometric camera. Site cleared for drone ops." },
  { id: "MT-004", inverterId: "INV-006", inverterName: "Prism-4 Module C", task: "String Voltage Balancing + Connector Inspection", status: "in-progress", priority: "medium", scheduledDate: "2026-03-05", estimatedDuration: "3 hours", assignedTo: "Vikram Singh", notes: "String S2 connectors showing 0.3Ω resistance. May need MC4 replacement." },
  { id: "MT-005", inverterId: "INV-001", inverterName: "Aurora-7 Block A", task: "Quarterly Preventive Maintenance", status: "completed", priority: "low", scheduledDate: "2026-02-28", estimatedDuration: "2 hours", assignedTo: "Suresh Nair", notes: "All checks passed. Next PM due May 2026." },
  { id: "MT-006", inverterId: "INV-005", inverterName: "Zenith-12 North", task: "Firmware Update to v5.2.0", status: "scheduled", priority: "low", scheduledDate: "2026-03-12", estimatedDuration: "1 hour", assignedTo: "Neha Gupta", notes: "New firmware fixes MPPT droop compensation bug. Schedule during low-irradiance window." },
];

const riskTimeline: RiskTimelinePoint[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date("2026-02-20");
  d.setDate(d.getDate() + i);
  return {
    date: d.toISOString().split("T")[0],
    riskScore: Math.round((25 + i * 3.5 + Math.sin(i * 0.5) * 8 + (Math.random() - 0.5) * 5) * 10) / 10,
    events: i === 8 ? ["IGBT temp anomaly first detected"] : i === 11 ? ["Capacitor ESR alert triggered"] : [],
  };
});

const aiAdvisorData: AIAdvisorData = {
  insights: aiInsights,
  anomalies,
  forecast: solarForecast,
  maintenanceSchedule,
  riskTimeline,
  healthScore: 72,
  alertCount: { critical: 2, warning: 2, info: 2 },
};

/* ═══════════════════════════════════════════════════════════
   USER PROFILE / SETTINGS
   ═══════════════════════════════════════════════════════════ */
const userProfile: UserProfile = {
  name: "Jaimin Parmar",
  email: "jaimin@solarintel.io",
  role: "Fleet Operations Manager",
  accountId: "EESL-AHD-001",
  plan: "premium",
  planCost: 2999,
  nextRenewal: "15 April, 2026",
  devices: [
    { id: "DEV-001", name: "Aurora-7 Block A Inverter", type: "inverter", status: "online", lastSeen: "2026-03-05T09:30:00Z", firmware: "v4.12.3" },
    { id: "DEV-002", name: "Smart Meter MTR-2023-001", type: "meter", status: "online", lastSeen: "2026-03-05T09:32:00Z", firmware: "v2.1.0" },
    { id: "DEV-003", name: "Tesla Powerwall 2", type: "battery", status: "online", lastSeen: "2026-03-05T09:31:00Z", firmware: "v21.44.1" },
    { id: "DEV-004", name: "Ambient Temp Sensor S1", type: "sensor", status: "online", lastSeen: "2026-03-05T09:30:00Z", firmware: "v1.3.2" },
    { id: "DEV-005", name: "Irradiance Sensor IR-01", type: "sensor", status: "offline", lastSeen: "2026-03-04T18:00:00Z", firmware: "v1.2.8" },
  ],
  notifications: {
    email: true, sms: true, push: true,
    criticalAlerts: true, weeklyReport: true, maintenanceReminders: true,
  },
};

/* ═══════════════════════════════════════════════════════════
   FETCH FUNCTIONS (Simulated API with latency)
   ═══════════════════════════════════════════════════════════ */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchDashboardData(): Promise<DashboardData> {
  await delay(400);
  return { systemHealth, inverters, performanceTrends, aiInsights };
}

export async function fetchLiveEnergy(): Promise<LiveEnergyData> {
  await delay(200);
  return { ...liveEnergy, waveformData: generateWaveform(), timestamp: new Date().toISOString() };
}

export async function fetchInverterDetail(id: string): Promise<Inverter | undefined> {
  await delay(300);
  return inverters.find((i) => i.id === id);
}

export async function fetchAllInverters(): Promise<Inverter[]> {
  await delay(300);
  return inverters;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  await delay(500);
  return analyticsData;
}

export async function fetchGridData(): Promise<GridData> {
  await delay(400);
  return gridData;
}

export async function fetchAIAdvisor(): Promise<AIAdvisorData> {
  await delay(600);
  return aiAdvisorData;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  await delay(300);
  return userProfile;
}
