export type DomainErrorStatus = 400 | 401 | 403 | 404 | 409 | 422 | 429;

export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly status: DomainErrorStatus;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class UnauthenticatedError extends DomainError {
  readonly code = "UNAUTHENTICATED";
  readonly status = 401;

  constructor() {
    super("Authentication required");
  }
}
