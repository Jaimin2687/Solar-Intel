/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: Grid / DISCOM Service
 * ─────────────────────────────────────────────────────────
 * In production this would integrate with DISCOM APIs.
 * For hackathon, returns rich realistic data.
 */

import type { GridData } from "@/types";

export async function getGridData(): Promise<GridData> {
  return {
    netMeteringStatus: "approved",
    discomName: "MSEDCL Grid",
    accountId: "EESL-SRT-002",
    meterId: "MTR-2023-002",
    feedInTariff: 5.0,
    contractValid: "Dec 2033",
    exportEarnings: 65.5,
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
}
