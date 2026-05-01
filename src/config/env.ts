import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PG_DATABASE_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

const loadEnv = (): Env => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(`Invalid environment variables: ${result.error.message}`);
  }
  return result.data;
};

export const env = loadEnv();
