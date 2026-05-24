import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "@/core/types/env";
import { createOpenAILLMService, type LLMService } from "@/services/llm/openai";

let service: LLMService | null = null;

export const llmMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (!service) {
    service = createOpenAILLMService(c.env.OPENAI_API_KEY);
  }
  c.set("llm", service);
  await next();
};
