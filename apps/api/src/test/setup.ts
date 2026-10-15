import { PGlite } from "@electric-sql/pglite";
import { type Database, migrationsFolder, schema } from "@pulso-concept/db";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { createApp } from "../app";
import { createAttemptLimiter } from "../lib/attempts";
import { createLogger } from "../lib/logger";
import { createSessionTokens } from "../lib/session";
import { SIGN_IN_FAILURE_WINDOW_MS, SIGN_IN_MAX_FAILURES } from "../modules/iam/services";
import { SUBMISSION_MAX_PER_WINDOW, SUBMISSION_WINDOW_MS } from "../modules/leads/services";

export const TEST_ORIGIN = "http://localhost:5173";
export const TEST_PASSWORD = "correct-horse-battery";
export const TEST_SECRET = "test-secret-that-is-at-least-32-characters-long";

// An in-process Postgres with every migration applied, fresh per call.
export async function createTestDb(): Promise<Database> {
  const db = drizzle({ client: new PGlite(), schema });
  await migrate(db, { migrationsFolder });
  return db as unknown as Database;
}

export async function createTestApp() {
  const db = await createTestDb();
  const tokens = createSessionTokens(TEST_SECRET);
  const app = createApp({
    db,
    logger: createLogger("silent"),
    corsOrigins: [TEST_ORIGIN],
    iam: {
      password: TEST_PASSWORD,
      tokens,
      signInLimiter: createAttemptLimiter(SIGN_IN_MAX_FAILURES, SIGN_IN_FAILURE_WINDOW_MS),
    },
    submissionLimiter: createAttemptLimiter(SUBMISSION_MAX_PER_WINDOW, SUBMISSION_WINDOW_MS),
  });
  const adminToken = tokens.issue().token;
  return { db, app, adminToken };
}

type TestApp = Awaited<ReturnType<typeof createTestApp>>["app"];

export function request(
  app: TestApp,
  method: string,
  path: string,
  { body, token, ip }: { body?: unknown; token?: string; ip?: string } = {},
) {
  const headers: Record<string, string> = { origin: TEST_ORIGIN, "x-real-ip": ip ?? "203.0.113.1" };
  if (body !== undefined) headers["content-type"] = "application/json";
  if (token) headers.authorization = `Bearer ${token}`;
  return app.handle(
    new Request(`http://localhost${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  );
}

// Response bodies in tests, typed by the caller (Bun types `json()` as unknown).
export async function readJson<T = Record<string, unknown>>(response: Response): Promise<T> {
  return (await response.json()) as T;
}
