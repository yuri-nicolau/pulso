import { expect, test } from "bun:test";
import { createAttemptLimiter } from "./attempts";

test("blocks a key after max attempts inside the window and frees it after", () => {
  const limiter = createAttemptLimiter(2, 1000);
  limiter.record("a", 0);
  expect(limiter.allowed("a", 10)).toBe(true);
  limiter.record("a", 10);
  expect(limiter.allowed("a", 20)).toBe(false);
  expect(limiter.allowed("b", 20)).toBe(true);
  expect(limiter.allowed("a", 1011)).toBe(true);
  limiter.record("a", 1011);
  limiter.reset("a");
  expect(limiter.allowed("a", 1012)).toBe(true);
});
