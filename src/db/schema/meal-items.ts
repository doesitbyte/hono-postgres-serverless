import { pgTable, uuid, text, real, timestamp } from "drizzle-orm/pg-core";
import { meals } from "./meals";

export const mealItems = pgTable("meal_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  mealId: uuid("meal_id")
    .notNull()
    .references(() => meals.id),
  name: text("name").notNull(),
  quantity: text("quantity").notNull(),
  calories: real("calories").notNull(),
  protein: real("protein").notNull(),
  fat: real("fat").notNull(),
  carbs: real("carbs").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
