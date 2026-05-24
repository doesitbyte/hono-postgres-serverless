import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/core/types/env";
import {
  getProfileResponse,
  unauthorizedResponse,
  upsertProfileBody,
  upsertProfileResponse,
} from "./types";
import { getProfileHandler, upsertProfileHandler } from "./handlers";

const getProfileRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["profile"],
  summary: "Get user profile and recommended targets",
  responses: {
    200: {
      description: "User profile with recommended macro targets",
      content: { "application/json": { schema: getProfileResponse } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: unauthorizedResponse } },
    },
  },
});

const upsertProfileRoute = createRoute({
  method: "put",
  path: "/",
  tags: ["profile"],
  summary: "Create or update user profile",
  request: {
    body: {
      content: { "application/json": { schema: upsertProfileBody } },
      required: true,
    },
  },
  responses: {
    200: {
      description: "Saved profile with recommended macro targets",
      content: { "application/json": { schema: upsertProfileResponse } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: unauthorizedResponse } },
    },
  },
});

export const profileApp = new OpenAPIHono<AppEnv>();

profileApp.openapi(getProfileRoute, (c) => getProfileHandler(c));

profileApp.openapi(upsertProfileRoute, (c) => {
  const body = c.req.valid("json");
  return upsertProfileHandler(c, body);
});
