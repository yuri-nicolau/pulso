import { treaty } from "@elysiajs/eden";
import type { App } from "@pulso-concept/api";
import { readAdminToken } from "./admin-token";

// Production calls the Railway API directly (VITE_API_URL); locally Vite proxies /api.
const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) || window.location.origin;

// parseDate is off: dates arrive as ISO strings, as the API types them.
export const api = treaty<App>(baseUrl, {
  parseDate: false,
  headers: (): Record<string, string> => {
    const token = readAdminToken();
    return token ? { authorization: `Bearer ${token}` } : {};
  },
}).api;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string | undefined,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface EdenResult<T> {
  data: T;
  error: { status: unknown; value: unknown } | null;
}

// Eden returns `{ data, error }`; this throws an ApiError instead, for TanStack Query.
export async function unwrap<T>(request: Promise<EdenResult<T>>): Promise<Exclude<T, null>> {
  let result: EdenResult<T>;
  try {
    result = await request;
  } catch {
    throw new ApiError(0, "NETWORK", "Network error");
  }
  if (result.error) {
    const status = typeof result.error.status === "number" ? result.error.status : 500;
    const value = result.error.value as { code?: string; message?: string } | null;
    throw new ApiError(status, value?.code, value?.message ?? "Request failed");
  }
  return result.data as Exclude<T, null>;
}
