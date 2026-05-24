import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { AppEnv } from "@/core/types/env";
import { createSuccessEnvelope } from "@/core/types/response";
import { userTargets } from "@/db/schema/user-targets";
import type { updateTargetsBody } from "./types";

export const getTargetsHandler = async (c: Context<AppEnv>) => {
  const userId = c.var.userId;
  const db = c.var.db;

  const [target] = await db
    .select()
    .from(userTargets)
    .where(eq(userTargets.userId, userId))
    .limit(1);

  const result = target
    ? {
        ...target,
        createdAt: target.createdAt.toISOString(),
        updatedAt: target.updatedAt.toISOString(),
      }
    : null;

  return c.json(createSuccessEnvelope(result), 200);
};

export const updateTargetsHandler = async (
  c: Context<AppEnv>,
  body: z.infer<typeof updateTargetsBody>
) => {
  const userId = c.var.userId;
  const db = c.var.db;

  const [result] = await db
    .insert(userTargets)
    .values({ userId, ...body })
    .onConflictDoUpdate({
      target: userTargets.userId,
      set: { ...body, updatedAt: new Date() },
    })
    .returning();

  return c.json(
    createSuccessEnvelope({
      ...result,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    }),
    200
  );
};
