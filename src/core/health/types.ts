import { z } from "@hono/zod-openapi";
import { apiError, errorEnvelope, successEnvelope } from "@/core/types/response";

export const healthData = z.object({
  status: z.literal("ok"),
});

export const healthResponse = successEnvelope(healthData);

export type HealthResponse = z.infer<typeof healthResponse>;

export const dbHealthError = apiError.extend({
  code: z.literal("DB_UNAVAILABLE"),
});

export const dbHealthErrorResponse = errorEnvelope(dbHealthError);

export type DbHealthErrorResponse = z.infer<typeof dbHealthErrorResponse>;
