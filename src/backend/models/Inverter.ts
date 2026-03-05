/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: Inverter Model (Mongoose)
 * ─────────────────────────────────────────────────────────
 * Stores inverter fleet metadata + real-time state.
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IInverterString {
  stringId: string;
  voltage: number;
  current: number;
  power: number;
  status: "healthy" | "warning" | "critical";
}

export interface IInverter extends Document {
  inverterId: string;
  name: string;
  location: string;
  status: "healthy" | "warning" | "critical";
  performanceRatio: number;
  temperature: number;
  powerOutput: number;
  riskScore: number;
  lastUpdated: Date;
  uptime: number;
  inverterModel: string;
  capacity: number;
  installDate: Date;
  firmware: string;
  dcVoltage: number;
  acVoltage: number;
  frequency: number;
  currentOutput: number;
  dailyYield: number;
  lifetimeYield: number;
  efficiency: number;
  strings: IInverterString[];
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InverterStringSchema = new Schema<IInverterString>(
  {
    stringId: { type: String, required: true },
    voltage: { type: Number, required: true },
    current: { type: Number, required: true },
    power: { type: Number, required: true },
    status: { type: String, enum: ["healthy", "warning", "critical"], default: "healthy" },
  },
  { _id: false }
);

const InverterSchema = new Schema<IInverter>(
  {
    inverterId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ["healthy", "warning", "critical"], default: "healthy" },
    performanceRatio: { type: Number, default: 0 },
    temperature: { type: Number, default: 0 },
    powerOutput: { type: Number, default: 0 },
    riskScore: { type: Number, default: 0, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now },
    uptime: { type: Number, default: 100, min: 0, max: 100 },
    inverterModel: { type: String, required: true },
    capacity: { type: Number, required: true },
    installDate: { type: Date, required: true },
    firmware: { type: String, default: "" },
    dcVoltage: { type: Number, default: 0 },
    acVoltage: { type: Number, default: 0 },
    frequency: { type: Number, default: 50 },
    currentOutput: { type: Number, default: 0 },
    dailyYield: { type: Number, default: 0 },
    lifetimeYield: { type: Number, default: 0 },
    efficiency: { type: Number, default: 0, min: 0, max: 100 },
    strings: [InverterStringSchema],
    ownerId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

InverterSchema.index({ ownerId: 1, inverterId: 1 });

export const Inverter: Model<IInverter> =
  mongoose.models.Inverter || mongoose.model<IInverter>("Inverter", InverterSchema);
