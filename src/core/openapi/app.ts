import type { AppEnv } from "@/core/types/env";
import { OpenAPIHono } from "@hono/zod-openapi";
import healthApp from "../health/routes";
import { authMiddleware } from "../middleware/auth";
import { llmMiddleware } from "../middleware/llm";
import { logsApp } from "@/modules/logs/routes";
import { targetsApp } from "@/modules/targets/routes";
import { profileApp } from "@/modules/profile/routes";
import { openApiDocConfig } from "./config";

export const openapi = new OpenAPIHono<AppEnv>();
openapi.doc("/docs", openApiDocConfig);

openapi.route("/health", healthApp);

openapi.use("/logs/*", authMiddleware, llmMiddleware);
openapi.use("/targets/*", authMiddleware);
openapi.use("/profile/*", authMiddleware);

openapi.route("/logs", logsApp);
openapi.route("/targets", targetsApp);
openapi.route("/profile", profileApp);

export default openapi;
