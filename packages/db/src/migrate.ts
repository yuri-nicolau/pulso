import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { migrationsFolder } from "./index";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  process.stderr.write("DATABASE_URL is required to run migrations\n");
  process.exit(1);
}

// One connection, so the session settings below apply to every migration statement.
const client = new SQL(databaseUrl, { max: 1 });
await client`SET statement_timeout = 0`;
await migrate(drizzle({ client }), { migrationsFolder });
await client.close();
process.stdout.write("Migrations applied\n");
