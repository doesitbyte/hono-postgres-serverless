import { z } from "@hono/zod-openapi";

export const healthResponse = z.object({
  status: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponse>;

export const dbHealthErrorResponse = z.object({
  status: z.literal("error"),
  message: z.string(),
});

export type DbHealthErrorResponse = z.infer<typeof dbHealthErrorResponse>;
