/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend Barrel Export
 * ─────────────────────────────────────────────────────────
 * Single import point for all backend modules.
 *
 * Usage: import { connectDB, User, getAllInverters, apiSuccess } from "@/backend";
 */

// Config
export { connectDB, env } from "./config";

// Models
export { User, Inverter, TelemetryRecord } from "./models";
export type { IUser, IInverter, IInverterString, ITelemetryRecord } from "./models";

// Services
export {
  getAllInverters,
  createInverter,
  getInverterById,
  updateInverter,
  deleteInverter,
  getDashboardData,
  getWeatherByCoords,
  getWeatherForInverter,
  getInverterTelemetry,
  ingestTelemetry,
  getAnalyticsData,
  getLiveEnergyData,
  getGridData,
  getAIAdvisorData,
  analyzeInverter,
  getUserProfile,
  updateUserProfile,
  sendEmail,
  sendAlertEmail,
  sendWeeklyReport,
  sendMaintenanceReminder,
} from "./services";
export type { EmailOptions, AlertEmailData, WeeklyReportData, MaintenanceReminderData } from "./services";

// Middleware
export { getAuthenticatedUser, checkRateLimit } from "./middleware";
export type { AuthenticatedUser } from "./middleware";

// Utils
export { apiSuccess, apiError, logger } from "./utils";
export type { ApiResponse } from "./utils";

// Seed
export { seedDatabase } from "./seed/seed";
