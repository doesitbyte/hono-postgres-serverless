import { createDb } from "./db/connections/pg";
import type { AppEnv } from "./core/types/env";
import { Hono } from "hono";
import { openapi } from "./core/openapi/app";
import { swaggerUI } from "@hono/swagger-ui";

const app = new Hono<AppEnv>();

app.use("*", async (c, next) => {
  c.set("db", createDb(c.env.PG_DATABASE_URL));
  await next();
});

app.get("/docs/ui", swaggerUI({ url: "/docs" }));

app.route("/", openapi);

export default app;
