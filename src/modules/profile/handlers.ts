import type { Context } from "hono";
import { eq } from "drizzle-orm";
import type { z } from "zod";
import type { AppEnv } from "@/core/types/env";
import { createSuccessEnvelope } from "@/core/types/response";
import { userProfiles } from "@/db/schema/user-profiles";
import type { upsertProfileBody } from "./types";
import {
  ACTIVITY_MULTIPLIERS,
  GOAL_CALORIE_ADJUSTMENTS,
  PROTEIN_PER_KG,
  FAT_PER_KG,
} from "./constants";

function calculateRecommendedTargets(profile: {
  heightCm: number;
  weightKg: number;
  age: number;
  gender: "male" | "female";
  activityLevel: (typeof activityLevelValues)[number];
  goal: (typeof goalValues)[number];
}) {
  const { heightCm, weightKg, age, gender, activityLevel, goal } = profile;

  const bmr =
    10 * weightKg + 6.25 * heightCm - 5 * age + (gender === "male" ? 5 : -161);

  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  const calorieTarget = Math.round(tdee + GOAL_CALORIE_ADJUSTMENTS[goal]);

  const proteinTarget = Math.round(weightKg * PROTEIN_PER_KG[goal]);
  const fatTarget = Math.round(weightKg * FAT_PER_KG[goal]);
  const carbsTarget = Math.max(
    0,
    Math.round((calorieTarget - proteinTarget * 4 - fatTarget * 9) / 4)
  );

  return { calorieTarget, proteinTarget, fatTarget, carbsTarget };
}

export const getProfileHandler = async (c: Context<AppEnv>) => {
  const userId = c.var.userId;
  const db = c.var.db;

  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);

  if (!profile) {
    return c.json(createSuccessEnvelope(null), 200);
  }

  return c.json(
    createSuccessEnvelope({
      ...profile,
      recommendedTargets: calculateRecommendedTargets(profile),
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    }),
    200
  );
};

export const upsertProfileHandler = async (
  c: Context<AppEnv>,
  body: z.infer<typeof upsertProfileBody>
) => {
  const userId = c.var.userId;
  const db = c.var.db;

  const [result] = await db
    .insert(userProfiles)
    .values({ userId, ...body })
    .onConflictDoUpdate({
      target: userProfiles.userId,
      set: { ...body, updatedAt: new Date() },
    })
    .returning();

  return c.json(
    createSuccessEnvelope({
      ...result,
      recommendedTargets: calculateRecommendedTargets(result),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    }),
    200
  );
};
