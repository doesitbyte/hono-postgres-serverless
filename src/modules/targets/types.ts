import { z } from "@hono/zod-openapi";
import { errorEnvelope, successEnvelope } from "@/core/types/response";
import { apiError } from "@/core/types/response";

export const updateTargetsBody = z.object({
  calorieTarget: z.number().int().positive().nullable().optional(),
  proteinTarget: z.number().int().positive().nullable().optional(),
  fatTarget: z.number().int().positive().nullable().optional(),
  carbsTarget: z.number().int().positive().nullable().optional(),
});

export const targetsSchema = z.object({
  userId: z.string(),
  calorieTarget: z.number().nullable(),
  proteinTarget: z.number().nullable(),
  fatTarget: z.number().nullable(),
  carbsTarget: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const unauthorizedError = apiError.extend({
  code: z.literal("UNAUTHORIZED"),
});

export const getTargetsResponse = successEnvelope(targetsSchema.nullable());
export const updateTargetsResponse = successEnvelope(targetsSchema);
export const unauthorizedResponse = errorEnvelope(unauthorizedError);
