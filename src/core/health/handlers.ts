import type { AppEnv } from "@/core/types/env";
import { sql } from "drizzle-orm";
import type { Context } from "hono";

const healthHandler = async (c: Context<AppEnv>) => {
  return c.json({ status: "ok" }, 200);
};

export const pgHealthHandler = async (c: Context<AppEnv>) => {
  try {
    await c.get("db").execute(sql`SELECT 1`);
    return c.json({ status: "ok" }, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return c.json({ status: "error" as const, message }, 503);
  }
};

export default healthHandler;
