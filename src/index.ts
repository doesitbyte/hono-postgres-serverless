import { createDb } from "./db/connections/pg";
import type { AppEnv } from "./core/types/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { openapi } from "./core/openapi/app";
import { swaggerUI } from "@hono/swagger-ui";

let db: ReturnType<typeof createDb> | null = null;

const app = new Hono<AppEnv>();

app.use("*", async (c, next) => {
  const extra = c.env.ALLOWED_ORIGINS
    ? c.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [];

  return cors({
    origin: (origin) =>
      origin.startsWith("http://localhost") || extra.includes(origin) ? origin : null,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })(c, next);
});

app.use("*", async (c, next) => {
  if (!db) db = createDb(c.env.PG_DATABASE_URL);
  c.set("db", db);
  await next();
});

app.get("/docs/ui", swaggerUI({ url: "/docs" }));

app.route("/", openapi);

export default app;
