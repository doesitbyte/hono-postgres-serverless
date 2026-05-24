import { pgTable, uuid, text, date, timestamp } from "drizzle-orm/pg-core";

export const logs = pgTable("logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  rawInput: text("raw_input").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
