import type { AttemptLimiter } from "../../lib/attempts";
import { DomainError, UnauthenticatedError } from "../../lib/errors";
import { type SessionTokens, safeEqual } from "../../lib/session";

// Wrong passwords allowed per address before sign-in is locked for the rest of the window.
export const SIGN_IN_MAX_FAILURES = 5;
export const SIGN_IN_FAILURE_WINDOW_MS = 15 * 60 * 1000;

export interface IamContext {
  password: string;
  tokens: SessionTokens;
  // Failed sign-ins per address.
  signInLimiter: AttemptLimiter;
}

export class WrongPasswordError extends DomainError {
  readonly code = "WRONG_PASSWORD";
  readonly status = 401;

  constructor() {
    super("Wrong password");
  }
}

export class TooManySignInAttemptsError extends DomainError {
  readonly code = "TOO_MANY_ATTEMPTS";
  readonly status = 429;

  constructor() {
    super("Too many sign-in attempts, try again later");
  }
}

export function signIn(context: IamContext, password: string, address: string) {
  if (!context.signInLimiter.allowed(address)) throw new TooManySignInAttemptsError();
  if (!safeEqual(password, context.password)) {
    context.signInLimiter.record(address);
    throw new WrongPasswordError();
  }
  context.signInLimiter.reset(address);
  return context.tokens.issue();
}

// Throws unless the Authorization header carries a valid admin session.
export function requireAdmin(tokens: SessionTokens, authorization: string | undefined): void {
  const token = authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token || !tokens.verify(token)) throw new UnauthenticatedError();
}
