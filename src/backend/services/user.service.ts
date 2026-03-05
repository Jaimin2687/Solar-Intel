/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Backend: User Service
 * ─────────────────────────────────────────────────────────
 */

import { connectDB } from "@/backend/config";
import { User } from "@/backend/models";
import logger from "@/backend/utils/logger";

export async function getUserProfile(userId: string) {
  await connectDB();

  const user = await User.findById(userId).lean();
  if (!user) throw new Error("NOT_FOUND");

  return {
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    accountId: user.accountId,
    plan: user.plan,
    planCost: user.planCost,
    nextRenewal: user.nextRenewal,
    notifications: user.notifications,
    createdAt: user.createdAt,
  };
}

export async function updateUserProfile(
  userId: string,
  body: Record<string, unknown>
) {
  await connectDB();

  const allowedFields: Record<string, boolean> = { name: true, notifications: true };
  const updates: Record<string, unknown> = {};
  for (const key of Object.keys(body)) {
    if (allowedFields[key]) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("NO_VALID_FIELDS");
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).lean();

  if (!updated) throw new Error("NOT_FOUND");

  logger.info("User profile updated", { userId, fields: Object.keys(updates) });

  return {
    name: updated.name,
    email: updated.email,
    notifications: updated.notifications,
  };
}
