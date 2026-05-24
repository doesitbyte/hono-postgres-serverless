import OpenAI from "openai";
import { parseFoodInput, type ParsedMeals } from "@/services/llm/agents/parse-food-input";

export interface LLMService {
  parseFoodInput(text: string): Promise<ParsedMeals>;
}

export const createOpenAILLMService = (apiKey: string): LLMService => {
  const client = new OpenAI({ apiKey });
  return {
    parseFoodInput: (text) => parseFoodInput(client, text),
  };
};
