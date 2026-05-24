import { z } from "@hono/zod-openapi";
import { apiError, errorEnvelope, successEnvelope } from "@/core/types/response";

export const genderValues = ["male", "female"] as const;
export const activityLevelValues = [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "very_active",
  "extra_active",
] as const;
export const goalValues = ["fat_loss", "maintain", "build_muscle"] as const;

export const upsertProfileBody = z.object({
  heightCm: z.number().int().positive(),
  weightKg: z.number().positive(),
  age: z.number().int().positive(),
  gender: z.enum(genderValues),
  activityLevel: z.enum(activityLevelValues),
  goal: z.enum(goalValues),
});

export const recommendedTargetsSchema = z.object({
  calorieTarget: z.number().int(),
  proteinTarget: z.number().int(),
  fatTarget: z.number().int(),
  carbsTarget: z.number().int(),
});

export const profileSchema = z.object({
  userId: z.string(),
  heightCm: z.number().int(),
  weightKg: z.number(),
  age: z.number().int(),
  gender: z.enum(genderValues),
  activityLevel: z.enum(activityLevelValues),
  goal: z.enum(goalValues),
  recommendedTargets: recommendedTargetsSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const unauthorizedError = apiError.extend({
  code: z.literal("UNAUTHORIZED"),
});

export const getProfileResponse = successEnvelope(profileSchema.nullable());
export const upsertProfileResponse = successEnvelope(profileSchema);
export const unauthorizedResponse = errorEnvelope(unauthorizedError);
