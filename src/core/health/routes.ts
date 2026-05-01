import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import healthHandler, { pgHealthHandler } from "./handlers";
import { dbHealthErrorResponse, healthResponse } from "./types";
import type { AppEnv } from "@/core/types/env";

const route = createRoute({
  method: "get",
  path: "/",
  tags: ["health"],
  summary: "Health check",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: healthResponse,
        },
      },
    },
  },
});

const pgRoute = createRoute({
  method: "get",
  path: "/pg",
  tags: ["health"],
  summary: "PostgreSQL health check",
  responses: {
    200: {
      description: "PostgreSQL reachable",
      content: {
        "application/json": {
          schema: healthResponse,
        },
      },
    },
    503: {
      description: "PostgreSQL unavailable",
      content: {
        "application/json": {
          schema: dbHealthErrorResponse,
        },
      },
    },
  },
});

export const healthApp = new OpenAPIHono<AppEnv>();
healthApp.openapi(route, (c) => healthHandler(c));
healthApp.openapi(pgRoute, (c) => pgHealthHandler(c));

export default healthApp;
