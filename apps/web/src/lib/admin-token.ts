// The admin session token (Bearer), kept on this device so the admin stays signed in until it
// expires. Storage can be unavailable (private mode, blocked site data): then it lives in memory.
const STORAGE_KEY = "pulso-concept:admin-token";

let memoryToken: string | null = null;

export function readAdminToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? memoryToken;
  } catch {
    return memoryToken;
  }
}

export function writeAdminToken(token: string | null): void {
  memoryToken = token;
  try {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable: the in-memory copy above keeps this tab signed in.
  }
}
