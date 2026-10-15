import { describe, expect, test } from "bun:test";
import { createSessionTokens, safeEqual } from "./session";

const SECRET = "test-secret-that-is-at-least-32-characters-long";

describe("session tokens", () => {
  test("a fresh token verifies until it expires", () => {
    const tokens = createSessionTokens(SECRET, 1000);
    const { token, expiresAt } = tokens.issue(0);
    expect(expiresAt).toBe(new Date(1000).toISOString());
    expect(tokens.verify(token, 999)).toBe(true);
    expect(tokens.verify(token, 1000)).toBe(false);
  });

  test("a token signed with another secret or tampered with is refused", () => {
    const { token } = createSessionTokens(SECRET).issue();
    expect(createSessionTokens(`${SECRET}-other`).verify(token)).toBe(false);
    const [expiry, signature] = token.split(".");
    const later = String(Number(expiry) + 1);
    expect(createSessionTokens(SECRET).verify(`${later}.${signature}`)).toBe(false);
    expect(createSessionTokens(SECRET).verify("garbage")).toBe(false);
    expect(createSessionTokens(SECRET).verify(`${token}.extra`)).toBe(false);
  });

  test("safeEqual compares strings of any length", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abcd")).toBe(false);
  });
});
