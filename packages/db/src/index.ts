export * from "./client";
export * from "./schema";
export * as schema from "./schema";

export const migrationsFolder = new URL("../drizzle", import.meta.url).pathname;
