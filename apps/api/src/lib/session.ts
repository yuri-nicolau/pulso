import { timingSafeEqual } from "node:crypto";

// Stateless admin sessions: "<expiry ms>.<HMAC-SHA256 of the expiry>", sent as a Bearer token.
// Changing ADMIN_SESSION_SECRET signs every session out.
export interface SessionTokens {
  issue(now?: number): { token: string; expiresAt: string };
  verify(token: string, now?: number): boolean;
}

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function safeEqual(a: string, b: string): boolean {
  // Hash first so different lengths take the same time and never throw.
  const digest = (value: string) => new Bun.CryptoHasher("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

export function createSessionTokens(secret: string, ttlMs = SESSION_TTL_MS): SessionTokens {
  const sign = (payload: string) =>
    new Bun.CryptoHasher("sha256", secret).update(payload).digest("base64url");
  return {
    issue(now = Date.now()) {
      const expiry = now + ttlMs;
      return {
        token: `${expiry}.${sign(String(expiry))}`,
        expiresAt: new Date(expiry).toISOString(),
      };
    },
    verify(token, now = Date.now()) {
      const [expiry, signature, ...rest] = token.split(".");
      if (!expiry || !signature || rest.length > 0 || !/^\d+$/.test(expiry)) return false;
      if (!safeEqual(signature, sign(expiry))) return false;
      return Number(expiry) > now;
    },
  };
}
