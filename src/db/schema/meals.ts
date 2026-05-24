import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { logs } from "./logs";

export const meals = pgTable("meals", {
  id: uuid("id").primaryKey().defaultRandom(),
  logId: uuid("log_id")
    .notNull()
    .references(() => logs.id),
  title: text("title"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
