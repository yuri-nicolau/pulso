# The API on Railway (.railway/railway.ts). Bun runs the TypeScript directly: no build step.
FROM oven/bun:1.4.2-slim

WORKDIR /app
# Every workspace's manifest, so the lockfile matches; only the API's production dependencies
# are installed.
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/db/package.json packages/db/
COPY packages/forms/package.json packages/forms/
RUN bun install --frozen-lockfile --production --filter @pulso-concept/api

COPY apps/api apps/api
COPY packages/db packages/db
COPY packages/forms packages/forms

ENV NODE_ENV=production
CMD ["bun", "run", "--cwd", "apps/api", "start"]
