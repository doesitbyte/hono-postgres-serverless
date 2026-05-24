import type { Db } from "@/db/connections/pg";
import type { LLMService } from "@/services/llm/openai";

export type AppEnv = {
  Bindings: {
    PG_DATABASE_URL: string;
    CLERK_SECRET_KEY: string;
    CLERK_PUBLISHABLE_KEY: string;
    OPENAI_API_KEY: string;
    ALLOWED_ORIGINS?: string;
  };
  Variables: {
    db: Db;
    userId: string;
    llm: LLMService;
  };
};
