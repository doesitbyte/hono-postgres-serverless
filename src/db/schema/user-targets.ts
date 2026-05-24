import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const userTargets = pgTable("user_targets", {
  userId: text("user_id").primaryKey(),
  calorieTarget: integer("calorie_target"),
  proteinTarget: integer("protein_target"),
  fatTarget: integer("fat_target"),
  carbsTarget: integer("carbs_target"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
