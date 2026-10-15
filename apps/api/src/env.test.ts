import { expect, test } from "bun:test";
import { parseEnv } from "./env";

const valid = {
  DATABASE_URL: "postgres://pulso:pulso@localhost:5438/pulso_concept",
  ADMIN_PASSWORD: "a-long-admin-password",
  ADMIN_SESSION_SECRET: "test-secret-that-is-at-least-32-characters-long",
  WEB_ORIGINS: "https://pulso-concept.vercel.app/, http://localhost:5173",
};

test("parses origins into a trimmed list without trailing slashes", () => {
  expect(parseEnv(valid).WEB_ORIGINS).toEqual([
    "https://pulso-concept.vercel.app",
    "http://localhost:5173",
  ]);
});

test("fails at boot on a short password or a secret equal to it", () => {
  expect(() => parseEnv({ ...valid, ADMIN_PASSWORD: "short" })).toThrow();
  const same = "x".repeat(40);
  expect(() => parseEnv({ ...valid, ADMIN_PASSWORD: same, ADMIN_SESSION_SECRET: same })).toThrow();
  expect(() => parseEnv({ ...valid, WEB_ORIGINS: "" })).toThrow();
});
