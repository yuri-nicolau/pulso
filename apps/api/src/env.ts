import { z } from "zod";

// Every variable the API reads, validated once at boot. Keep .env.example in sync.
const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    // Production: Supabase's session pooler URL (port 5432) with ?sslmode=require.
    DATABASE_URL: z.url(),
    // The admin page's password. Lives only here, never in the web app.
    ADMIN_PASSWORD: z.string().min(12),
    // Signs admin session tokens. Generate with: openssl rand -base64 32
    ADMIN_SESSION_SECRET: z.string().min(32),
    // Comma-separated origins CORS trusts (the Vercel domains, local Vite).
    WEB_ORIGINS: z
      .string()
      .transform((value) =>
        value
          .split(",")
          .map((origin) => origin.trim().replace(/\/$/, ""))
          .filter(Boolean),
      )
      .pipe(z.array(z.url()).min(1)),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  })
  // Reusing the password as the signing key would let one leak open both.
  .refine((env) => env.ADMIN_SESSION_SECRET !== env.ADMIN_PASSWORD, {
    message: "Must differ from ADMIN_PASSWORD",
    path: ["ADMIN_SESSION_SECRET"],
  });

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
