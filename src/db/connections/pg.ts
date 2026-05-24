import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export const createDb = (url: string) => drizzle(neon(url));

export type Db = ReturnType<typeof createDb>;
