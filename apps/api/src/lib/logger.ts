import pino from "pino";

export type Logger = pino.Logger;

export function createLogger(level: pino.Level | "silent"): Logger {
  return pino({
    level,
    redact: ["password", "token", "*.password", "*.token", "headers.authorization"],
  });
}
