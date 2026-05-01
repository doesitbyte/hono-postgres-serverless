import { Db } from "@/db/connections/pg";

export type AppEnv = {
  Bindings: { PG_DATABASE_URL: string };
  Variables: { db: Db };
};
