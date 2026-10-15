import { cors } from "@elysiajs/cors";
import type { Database } from "@pulso-concept/db";
import { Elysia } from "elysia";
import type { AttemptLimiter } from "./lib/attempts";
import { DomainError } from "./lib/errors";
import type { Logger } from "./lib/logger";
import { iamRoutes } from "./modules/iam/routes";
import type { IamContext } from "./modules/iam/services";
import { leadsRoutes } from "./modules/leads/routes";

export interface AppDeps {
  db: Database;
  logger: Logger;
  // The web app's origins (WEB_ORIGINS): the only ones CORS trusts.
  corsOrigins: string[];
  iam: IamContext;
  // Public form submissions per address.
  submissionLimiter: AttemptLimiter;
}

export function createApp({ db, logger, corsOrigins, iam, submissionLimiter }: AppDeps) {
  return new Elysia()
    .use(
      cors({
        origin: corsOrigins,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["content-type", "authorization"],
      }),
    )
    .onError({ as: "global" }, ({ error, code, status }) => {
      if (error instanceof DomainError) {
        return status(error.status, { code: error.code, message: error.message });
      }
      if (code === "VALIDATION" || code === "NOT_FOUND" || code === "PARSE") return;

      logger.error({ err: error }, "Unhandled error");
      return status(500, { code: "INTERNAL", message: "Internal server error" });
    })
    .group("/api", (api) =>
      api
        // Railway's health check (.railway/railway.ts).
        .get("/health", () => ({ status: "ok" as const }))
        .use(iamRoutes({ iam }))
        .use(leadsRoutes({ db, tokens: iam.tokens, submissionLimiter })),
    );
}

export type App = ReturnType<typeof createApp>;
