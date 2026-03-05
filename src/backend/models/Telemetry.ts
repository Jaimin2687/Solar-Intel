/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: Telemetry Record Model (Mongoose)
 * ─────────────────────────────────────────────────────────
 * Time-series telemetry data linked to an inverter.
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ITelemetryRecord extends Document {
  inverterId: string;
  timestamp: Date;
  dcVoltage: number;
  acVoltage: number;
  current: number;
  temperature: number;
  frequency: number;
  powerOutput: number;
  efficiency: number;
  performanceRatio: number;
  irradiance: number;
  ambientTemp: number;
  dailyYield: number;
  stringVoltages: number[];
  stringCurrents: number[];
  createdAt: Date;
}

const TelemetryRecordSchema = new Schema<ITelemetryRecord>(
  {
    inverterId: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true },
    dcVoltage: { type: Number, required: true },
    acVoltage: { type: Number, required: true },
    current: { type: Number, required: true },
    temperature: { type: Number, required: true },
    frequency: { type: Number, default: 50 },
    powerOutput: { type: Number, required: true },
    efficiency: { type: Number, default: 0 },
    performanceRatio: { type: Number, default: 0 },
    irradiance: { type: Number, default: 0 },
    ambientTemp: { type: Number, default: 0 },
    dailyYield: { type: Number, default: 0 },
    stringVoltages: [{ type: Number }],
    stringCurrents: [{ type: Number }],
  },
  { timestamps: true }
);

TelemetryRecordSchema.index({ inverterId: 1, timestamp: -1 });
TelemetryRecordSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 3600 });

export const TelemetryRecord: Model<ITelemetryRecord> =
  mongoose.models.TelemetryRecord ||
  mongoose.model<ITelemetryRecord>("TelemetryRecord", TelemetryRecordSchema);
