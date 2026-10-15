import { periodEnd } from "@pulso-concept/forms";

const LIST = new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" });

/** "06:00" → "06h – 07h": a short label that fits three chips per row on a phone. */
export function shortPeriod(hour: string): string {
  return `${hour.slice(0, 2)}h – ${periodEnd(hour).slice(0, 2)}h`;
}

// Word joiners around the dash keep a period ("18:00–19:00") from breaking across lines.
const PERIOD_DASH = "\u2060–\u2060";

/** ["07:00", "18:00"] → "07:00–08:00 e 18:00–19:00", in order. */
export function formatPeriodList(hours: readonly string[]): string {
  return LIST.format([...hours].sort().map((hour) => `${hour}${PERIOD_DASH}${periodEnd(hour)}`));
}

/** ["07:00", "18:00"] → "07h – 08h, 18h – 19h": compact, for lists and tables. */
export function formatShortPeriodList(hours: readonly string[]): string {
  return [...hours].sort().map(shortPeriod).join(", ");
}
