// Counts attempts per key (e.g. wrong passwords per address) in a sliding window, in memory:
// the API runs as one replica.
export interface AttemptLimiter {
  // True while the key is still under the limit.
  allowed(key: string, now?: number): boolean;
  record(key: string, now?: number): void;
  reset(key: string): void;
}

export function createAttemptLimiter(max: number, windowMs: number): AttemptLimiter {
  const attempts = new Map<string, number[]>();
  const recent = (key: string, now: number) => {
    const kept = (attempts.get(key) ?? []).filter((at) => now - at < windowMs);
    if (kept.length === 0) attempts.delete(key);
    else attempts.set(key, kept);
    return kept;
  };
  return {
    allowed: (key, now = Date.now()) => recent(key, now).length < max,
    record(key, now = Date.now()) {
      attempts.set(key, [...recent(key, now), now]);
    },
    reset(key) {
      attempts.delete(key);
    },
  };
}
