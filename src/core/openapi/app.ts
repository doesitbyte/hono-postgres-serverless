import type { AppEnv } from "@/core/types/env";
import { OpenAPIHono } from "@hono/zod-openapi";
import healthApp from "../health/routes";
import { openApiDocConfig } from "./config";

export const openapi = new OpenAPIHono<AppEnv>();
openapi.doc("/docs", openApiDocConfig);

openapi.route("/health", healthApp);

export default openapi;
