import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export type Schema = typeof schema;

// Driver-agnostic so services run against Bun SQL in production and PGlite in tests.
export type Database = PgDatabase<PgQueryResultHKT, Schema>;

// Explicit pool options for Supabase's session pooler: idle connections close before the
// pooler's idle timeout, and every connection is recycled so a long-lived one never goes stale.
const POOL = { max: 5, idleTimeout: 30, maxLifetime: 30 * 60, connectionTimeout: 10 };

export function connect(databaseUrl: string): Database {
  return drizzle({ client: new SQL(databaseUrl, POOL), schema });
}
