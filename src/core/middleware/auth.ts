import { createClerkClient } from "@clerk/backend";
import type { MiddlewareHandler } from "hono";
import { createErrorEnvelope } from "@/core/types/response";
import type { AppEnv } from "@/core/types/env";

const unauthorized = (c: Parameters<MiddlewareHandler<AppEnv>>[0]) =>
  c.json(
    createErrorEnvelope({ code: "UNAUTHORIZED" as const, message: "Unauthorized" }),
    401
  );

export const authMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const clerkClient = createClerkClient({
    secretKey: c.env.CLERK_SECRET_KEY,
    publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
  });

  const { isAuthenticated, toAuth } = await clerkClient.authenticateRequest(c.req.raw);

  if (!isAuthenticated) return unauthorized(c);

  const auth = toAuth();
  if (!auth?.userId) return unauthorized(c);

  c.set("userId", auth.userId);
  await next();
};
