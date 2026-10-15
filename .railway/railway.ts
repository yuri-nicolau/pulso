import { defineRailway, github, preserve, project, service } from "railway/iac";

// The API on Railway (see README, "Deploy"). Railway doesn't read this file on deploy: change it,
// then `railway config plan` and `railway config apply`. Every push to main deploys.
export default defineRailway(() => {
  const api = service("pulso-concept", {
    source: github("yuri-nicolau/pulso", { checkSuites: false }),
    build: {
      builder: "DOCKERFILE",
      dockerfilePath: "Dockerfile",
      watchPatterns: ["apps/api/**", "packages/**", "bun.lock", "Dockerfile"],
    },
    start: "bun run --cwd apps/api start",
    healthcheck: "/api/health",
    // Drizzle migrations run before each deploy goes live.
    preDeploy: "bun run --cwd packages/db migrate",
    // One replica (in-memory rate limits), same region as Supabase (us-east-1).
    replicas: { "us-east4-eqdc4a": 1 },
    deploy: { restartPolicyMaxRetries: 5 },
    env: {
      NODE_ENV: "production",
      LOG_LEVEL: "info",
      // The public domain (pulso-concept-production.up.railway.app) targets this port.
      PORT: "3000",
      // The Vercel domains allowed to call the API (CORS).
      WEB_ORIGINS: [
        "https://pulsoconcept.com.br",
        "https://www.pulsoconcept.com.br",
        "https://pulso-five-phi.vercel.app",
        "https://pulso-yuri-nicolaus-projects.vercel.app",
      ].join(","),
      // Secrets stay on Railway, never in the repo.
      DATABASE_URL: preserve(),
      ADMIN_PASSWORD: preserve(),
      ADMIN_SESSION_SECRET: preserve(),
    },
  });

  return project("pulso-concept", {
    resources: [api],
  });
});
