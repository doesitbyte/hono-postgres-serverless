import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/core/types/env";
import {
  getTargetsResponse,
  unauthorizedResponse,
  updateTargetsBody,
  updateTargetsResponse,
} from "./types";
import { getTargetsHandler, updateTargetsHandler } from "./handlers";

const getTargetsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["targets"],
  summary: "Get nutrition targets",
  responses: {
    200: {
      description: "User targets",
      content: { "application/json": { schema: getTargetsResponse } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: unauthorizedResponse } },
    },
  },
});

const updateTargetsRoute = createRoute({
  method: "put",
  path: "/",
  tags: ["targets"],
  summary: "Set or update nutrition targets",
  request: {
    body: {
      content: { "application/json": { schema: updateTargetsBody } },
      required: true,
    },
  },
  responses: {
    200: {
      description: "Updated targets",
      content: { "application/json": { schema: updateTargetsResponse } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: unauthorizedResponse } },
    },
  },
});

export const targetsApp = new OpenAPIHono<AppEnv>();

targetsApp.openapi(getTargetsRoute, (c) => getTargetsHandler(c));

targetsApp.openapi(updateTargetsRoute, (c) => {
  const body = c.req.valid("json");
  return updateTargetsHandler(c, body);
});

export default targetsApp;
