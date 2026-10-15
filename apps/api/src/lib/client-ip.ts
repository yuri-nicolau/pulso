import type { Server } from "elysia/universal";

// The caller's address, for rate limits. Railway's proxy sets X-Real-IP and appends the real
// address to X-Forwarded-For (the leftmost entries can be forged by the caller).
export function clientIp(request: Request, server: Server | null): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  if (forwarded) return forwarded;
  return server?.requestIP(request)?.address ?? "unknown";
}
