/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: Inverter Service
 * ─────────────────────────────────────────────────────────
 * All inverter-related business logic.
 */

import { connectDB } from "@/backend/config";
import { Inverter, User } from "@/backend/models";
import logger from "@/backend/utils/logger";
import type { Inverter as InverterType } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Map a DB inverter doc to the frontend Inverter type */
function mapToFrontend(inv: any): InverterType {
  const doc = inv as {
    inverterId: string; name: string; location: string; status: string;
    performanceRatio: number; temperature: number; powerOutput: number;
    riskScore: number; lastUpdated: Date; uptime: number; inverterModel: string;
    capacity: number; installDate: Date; firmware: string; dcVoltage: number;
    acVoltage: number; frequency: number; currentOutput: number;
    dailyYield: number; lifetimeYield: number; efficiency: number;
    strings: { stringId: string; voltage: number; current: number; power: number; status: string }[];
  };

  return {
    id: doc.inverterId,
    name: doc.name,
    location: doc.location,
    status: doc.status as InverterType["status"],
    performanceRatio: doc.performanceRatio,
    temperature: doc.temperature,
    powerOutput: doc.powerOutput,
    riskScore: doc.riskScore,
    lastUpdated: doc.lastUpdated?.toISOString?.() || new Date().toISOString(),
    uptime: doc.uptime,
    model: doc.inverterModel,
    capacity: doc.capacity,
    installDate: doc.installDate?.toISOString?.().split("T")[0] || "",
    firmware: doc.firmware,
    dcVoltage: doc.dcVoltage,
    acVoltage: doc.acVoltage,
    frequency: doc.frequency,
    currentOutput: doc.currentOutput,
    dailyYield: doc.dailyYield,
    lifetimeYield: doc.lifetimeYield,
    efficiency: doc.efficiency,
    strings: (doc.strings || []).map((s) => ({
      id: s.stringId,
      voltage: s.voltage,
      current: s.current,
      power: s.power,
      status: s.status as InverterType["status"],
    })),
  };
}

/** Get all inverters (fallback: return all if user has none) */
export async function getAllInverters(userId: string): Promise<InverterType[]> {
  await connectDB();

  let inverters = await Inverter.find({ ownerId: userId })
    .sort({ inverterId: 1 })
    .lean();

  if (inverters.length === 0) {
    inverters = await Inverter.find({}).sort({ inverterId: 1 }).lean();
  }

  // If still empty, fall back to mock data
  if (inverters.length === 0) {
    const { fetchAllInverters } = await import("@/lib/mock-data");
    return fetchAllInverters();
  }

  logger.info("Inverters fetched", { userId, count: inverters.length });
  return inverters.map(mapToFrontend);
}

/** Create a new inverter (admin only) */
export async function createInverter(
  userId: string,
  body: any
): Promise<{ inverterId: string }> {
  await connectDB();

  const dbUser = await User.findById(userId).lean();
  if (!dbUser || dbUser.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  const required = ["inverterId", "name", "location", "model", "capacity", "installDate"];
  for (const field of required) {
    if (!body[field]) throw new Error(`MISSING_FIELD:${field}`);
  }

  const strings = (body.strings || []).map((s: any) => ({
    stringId: s.id,
    voltage: s.voltage,
    current: s.current,
    power: s.power,
    status: s.status,
  }));

  const inverter = await Inverter.create({
    inverterId: body.inverterId as string,
    name: body.name as string,
    location: body.location as string,
    status: (body.status as string) || "healthy",
    performanceRatio: (body.performanceRatio as number) || 0,
    temperature: (body.temperature as number) || 0,
    powerOutput: (body.powerOutput as number) || 0,
    riskScore: (body.riskScore as number) || 0,
    inverterModel: body.model as string,
    capacity: body.capacity as number,
    installDate: new Date(body.installDate as string),
    firmware: (body.firmware as string) || "",
    dcVoltage: (body.dcVoltage as number) || 0,
    acVoltage: (body.acVoltage as number) || 0,
    frequency: (body.frequency as number) || 50,
    currentOutput: (body.currentOutput as number) || 0,
    dailyYield: (body.dailyYield as number) || 0,
    lifetimeYield: (body.lifetimeYield as number) || 0,
    efficiency: (body.efficiency as number) || 0,
    strings,
    ownerId: userId,
  });

  logger.info("Inverter created", { inverterId: inverter.inverterId, userId });
  return { inverterId: inverter.inverterId };
}

/** Get a single inverter by its inverterId string */
export async function getInverterById(
  inverterId: string,
  userId: string
): Promise<InverterType | null> {
  await connectDB();

  const inv = await Inverter.findOne({ inverterId }).lean();
  if (!inv) return null;

  logger.info("Inverter fetched", { inverterId, userId });
  return mapToFrontend(inv);
}

/** Update an inverter (owner or admin only) */
export async function updateInverter(
  inverterId: string,
  userId: string,
  body: any
): Promise<InverterType> {
  await connectDB();

  const dbUser = await User.findById(userId).lean();
  const existing = await Inverter.findOne({ inverterId });
  if (!existing) throw new Error("NOT_FOUND");

  const isOwner = existing.ownerId?.toString() === userId;
  const isAdmin = dbUser?.role === "admin";
  if (!isOwner && !isAdmin) throw new Error("FORBIDDEN");

  // Map frontend field names → DB field names
  const allowedUpdates: Record<string, any> = {};
  const fieldMap: Record<string, string> = { model: "inverterModel" };
  const updatableFields = [
    "name", "location", "status", "performanceRatio", "temperature",
    "powerOutput", "riskScore", "uptime", "model", "capacity",
    "installDate", "firmware", "dcVoltage", "acVoltage", "frequency",
    "currentOutput", "dailyYield", "lifetimeYield", "efficiency",
  ];
  for (const field of updatableFields) {
    if (body[field] !== undefined) {
      const dbField = fieldMap[field] || field;
      allowedUpdates[dbField] = body[field];
    }
  }
  if (body.installDate) allowedUpdates.installDate = new Date(body.installDate);
  if (body.strings) {
    allowedUpdates.strings = (body.strings as any[]).map((s) => ({
      stringId: s.id,
      voltage: s.voltage,
      current: s.current,
      power: s.power,
      status: s.status,
    }));
  }
  allowedUpdates.lastUpdated = new Date();

  const updated = await Inverter.findOneAndUpdate(
    { inverterId },
    { $set: allowedUpdates },
    { new: true, runValidators: true }
  ).lean();

  if (!updated) throw new Error("NOT_FOUND");
  logger.info("Inverter updated", { inverterId, userId });
  return mapToFrontend(updated);
}

/** Delete an inverter and its telemetry (admin only) */
export async function deleteInverter(
  inverterId: string,
  userId: string
): Promise<void> {
  await connectDB();

  const dbUser = await User.findById(userId).lean();
  if (!dbUser || dbUser.role !== "admin") throw new Error("FORBIDDEN");

  const deleted = await Inverter.findOneAndDelete({ inverterId });
  if (!deleted) throw new Error("NOT_FOUND");

  // Also remove associated telemetry
  const { TelemetryRecord } = await import("@/backend/models");
  await TelemetryRecord.deleteMany({ inverterId });

  logger.info("Inverter deleted", { inverterId, userId });
}

export { mapToFrontend };
