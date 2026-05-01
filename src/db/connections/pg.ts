import { drizzle } from "drizzle-orm/neon-http";

export const createDb = (url: string) => drizzle(url);

export type Db = ReturnType<typeof createDb>;
