import { connect } from "@pulso-concept/db";
import { createApp } from "./app";
import { parseEnv } from "./env";
import { createAttemptLimiter } from "./lib/attempts";
import { createLogger } from "./lib/logger";
import { createSessionTokens } from "./lib/session";
import { SIGN_IN_FAILURE_WINDOW_MS, SIGN_IN_MAX_FAILURES } from "./modules/iam/services";
import { SUBMISSION_MAX_PER_WINDOW, SUBMISSION_WINDOW_MS } from "./modules/leads/services";

const env = parseEnv(process.env);
const logger = createLogger(env.LOG_LEVEL);

const app = createApp({
  db: connect(env.DATABASE_URL),
  logger,
  corsOrigins: env.WEB_ORIGINS,
  iam: {
    password: env.ADMIN_PASSWORD,
    tokens: createSessionTokens(env.ADMIN_SESSION_SECRET),
    signInLimiter: createAttemptLimiter(SIGN_IN_MAX_FAILURES, SIGN_IN_FAILURE_WINDOW_MS),
  },
  submissionLimiter: createAttemptLimiter(SUBMISSION_MAX_PER_WINDOW, SUBMISSION_WINDOW_MS),
}).listen(env.PORT);

logger.info({ port: app.server?.port }, "API listening");
