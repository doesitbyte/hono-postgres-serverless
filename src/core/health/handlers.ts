import type { AppEnv } from "@/core/types/env";
import { createErrorEnvelope, createSuccessEnvelope } from "@/core/types/response";
import { sql } from "drizzle-orm";
import type { Context } from "hono";

const healthHandler = async (c: Context<AppEnv>) => {
  return c.json(createSuccessEnvelope({ status: "ok" as const }), 200);
};

export const pgHealthHandler = async (c: Context<AppEnv>) => {
  try {
    await c.get("db").execute(sql`SELECT 1`);
    return c.json(createSuccessEnvelope({ status: "ok" as const }), 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return c.json(
      createErrorEnvelope({
        code: "DB_UNAVAILABLE" as const,
        message,
      }),
      503
    );
  }
};

export default healthHandler;
