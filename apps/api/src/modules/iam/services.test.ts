import { expect, test } from "bun:test";
import { createAttemptLimiter } from "../../lib/attempts";
import { UnauthenticatedError } from "../../lib/errors";
import { createSessionTokens } from "../../lib/session";
import { TEST_PASSWORD, TEST_SECRET } from "../../test/setup";
import {
  type IamContext,
  requireAdmin,
  SIGN_IN_MAX_FAILURES,
  signIn,
  TooManySignInAttemptsError,
  WrongPasswordError,
} from "./services";

function context(): IamContext {
  return {
    password: TEST_PASSWORD,
    tokens: createSessionTokens(TEST_SECRET),
    signInLimiter: createAttemptLimiter(SIGN_IN_MAX_FAILURES, 60_000),
  };
}

test("the right password returns a session token that requireAdmin accepts", () => {
  const iam = context();
  const { token } = signIn(iam, TEST_PASSWORD, "a");
  expect(() => requireAdmin(iam.tokens, `Bearer ${token}`)).not.toThrow();
});

test("requireAdmin refuses a missing, malformed or forged header", () => {
  const iam = context();
  expect(() => requireAdmin(iam.tokens, undefined)).toThrow(UnauthenticatedError);
  expect(() => requireAdmin(iam.tokens, "Basic abc")).toThrow(UnauthenticatedError);
  expect(() => requireAdmin(iam.tokens, "Bearer 9999999999999.forged")).toThrow(
    UnauthenticatedError,
  );
});

test("wrong passwords lock the address after the limit, even for the right one", () => {
  const iam = context();
  for (let i = 0; i < SIGN_IN_MAX_FAILURES; i++) {
    expect(() => signIn(iam, "wrong", "a")).toThrow(WrongPasswordError);
  }
  expect(() => signIn(iam, TEST_PASSWORD, "a")).toThrow(TooManySignInAttemptsError);
  expect(() => signIn(iam, TEST_PASSWORD, "b")).not.toThrow();
});
