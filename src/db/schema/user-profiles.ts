import { pgTable, text, integer, real, pgEnum, timestamp } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female"]);
export const activityLevelEnum = pgEnum("activity_level", [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "very_active",
  "extra_active",
]);
export const goalEnum = pgEnum("goal", ["fat_loss", "maintain", "build_muscle"]);

export const userProfiles = pgTable("user_profiles", {
  userId: text("user_id").primaryKey(),
  heightCm: integer("height_cm").notNull(),
  weightKg: real("weight_kg").notNull(),
  age: integer("age").notNull(),
  gender: genderEnum("gender").notNull(),
  activityLevel: activityLevelEnum("activity_level").notNull(),
  goal: goalEnum("goal").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
