/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — API Client
 * ─────────────────────────────────────────────────────────
 * All data fetches go through real API routes backed by
 * MongoDB. Services auto-fall back to seeded data when the
 * DB is empty — but the client always hits the real API.
 *
 * Replace all direct mock-data imports in pages/components
 * with these functions.
 * ─────────────────────────────────────────────────────────
 */

import type {
  DashboardData,
  LiveEnergyData,
  AnalyticsData,
  AIAdvisorData,
  GridData,
  UserProfile,
  Inverter,
  MLPredictionResponse,
} from "@/types";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  const json = await res.json();
  // Our apiSuccess wraps data in { success, data } — unwrap it
  return (json.data ?? json) as T;
}

/* ── Dashboard ─────────────────────────────────────────── */
export async function fetchDashboardData(): Promise<DashboardData> {
  return apiFetch<DashboardData>("/api/dashboard");
}

/* ── Live Energy ───────────────────────────────────────── */
export async function fetchLiveEnergy(): Promise<LiveEnergyData> {
  return apiFetch<LiveEnergyData>("/api/live-energy");
}

/* ── Inverters ─────────────────────────────────────────── */
export async function fetchAllInverters(): Promise<Inverter[]> {
  return apiFetch<Inverter[]>("/api/inverters");
}

export async function fetchInverterDetail(id: string): Promise<Inverter> {
  return apiFetch<Inverter>(`/api/inverters/${id}`);
}

/* ── Analytics ─────────────────────────────────────────── */
export async function fetchAnalytics(): Promise<AnalyticsData> {
  return apiFetch<AnalyticsData>("/api/analytics");
}

/* ── AI Advisor (insights, anomalies, forecast, maintenance) */
export async function fetchAIAdvisor(): Promise<AIAdvisorData> {
  return apiFetch<AIAdvisorData>("/api/ai-advisor");
}

/* ── Grid / DISCOM ─────────────────────────────────────── */
export async function fetchGridData(): Promise<GridData> {
  return apiFetch<GridData>("/api/grid");
}

/* ── User Profile ──────────────────────────────────────── */
export async function fetchUserProfile(): Promise<UserProfile> {
  try {
    return await apiFetch<UserProfile>("/api/user/profile");
  } catch {
    // Not authenticated — return a safe guest profile so the page still renders
    const { fetchUserProfile: mockProfile } = await import("@/lib/mock-data");
    return mockProfile();
  }
}

/* ── ML Predictions ────────────────────────────────────── */
export async function fetchMLPredictions(): Promise<MLPredictionResponse> {
  return apiFetch<MLPredictionResponse>("/api/predict");
}

export async function fetchMLPredictionSingle(inverterData: Record<string, number | string>): Promise<{
  risk_score: number;
  risk_level: string;
  failure_predicted: boolean;
  top_factors: string[];
  recommended_action: string;
}> {
  const res = await fetch(`${BASE}/api/predict`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inverterData),
  });
  if (!res.ok) throw new Error(`ML predict failed: ${res.status}`);
  const json = await res.json();
  return (json.data ?? json);
}
