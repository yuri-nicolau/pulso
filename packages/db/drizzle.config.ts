import { defineConfig } from "drizzle-kit";

// `generate` only diffs schema snapshots and never opens a connection, so a placeholder is fine
// there. Migrations run through `bun run db:migrate` (src/migrate.ts).
const databaseUrl =
  process.env.DATABASE_URL ?? "postgres://pulso:pulso@localhost:5438/pulso_concept";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  strict: true,
  dbCredentials: { url: databaseUrl },
});
