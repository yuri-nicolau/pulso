// What each public form asks, shared by the API (validation) and the web app (options).
// Values only: user-facing pt-BR labels live in the web app.

// Every form that feeds the admin page. A new form = a new key here, its answers type below,
// a public route in the API's `leads` module and a label in the web app.
export const FORM_KEYS = ["contact", "trial_class"] as const;
export type FormKey = (typeof FORM_KEYS)[number];

export const WEEKDAYS = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

// Landing page contact form ("Sua evolução começa aqui.").
export const INTERESTS = ["funcional", "academia", "os-dois"] as const;
export type Interest = (typeof INTERESTS)[number];

export const FREQUENCIES = ["1x", "2x", "3x", "4x", "5x+"] as const;
export type Frequency = (typeof FREQUENCIES)[number];

export const CLASS_TYPES = [
  "funcional",
  "hiit",
  "pilates",
  "musculacao",
  "funcional-teen",
] as const;
export type ClassType = (typeof CLASS_TYPES)[number];

export interface ContactAnswers {
  interest: Interest;
  frequency: Frequency;
  // "HH:MM" class start; null when the interest is weight training only (free schedule).
  preferredTime: string | null;
  trainingType: ClassType;
}

// Trial class form (/aula-experimental): a weight training trial in a one-hour period.
export interface TrialClassAnswers {
  weekday: Weekday;
  // Start of the one-hour period, "HH:00".
  hour: string;
}

export type LeadAnswers = ContactAnswers | TrialClassAnswers;

// Weight training opening hours per day, as the first hour of each one-hour period offered.
// Derived from the studio's class grid (first and last class of each day); keep in sync with it.
const TRIAL_CLASS_HOUR_RANGES: Record<Weekday, { first: number; last: number }> = {
  segunda: { first: 6, last: 19 },
  terca: { first: 6, last: 19 },
  quarta: { first: 6, last: 19 },
  quinta: { first: 6, last: 19 },
  sexta: { first: 6, last: 17 },
  sabado: { first: 8, last: 9 },
};

export function formatHour(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

// Every period start ("HH:00") offered on a day, in order.
export function trialClassHours(weekday: Weekday): string[] {
  const { first, last } = TRIAL_CLASS_HOUR_RANGES[weekday];
  return Array.from({ length: last - first + 1 }, (_, index) => formatHour(first + index));
}

export function isTrialClassHourAvailable(weekday: Weekday, hour: string): boolean {
  return trialClassHours(weekday).includes(hour);
}

// "06:00" → "07:00": the end of a one-hour period.
export function periodEnd(hour: string): string {
  return formatHour(Number(hour.slice(0, 2)) + 1);
}

// Brazilian phone numbers: digits only, with or without the 55 country code (10 to 13 digits).
export function normalizePhone(value: string): string {
  return value.replaceAll(/\D/g, "");
}

export function isValidPhone(value: string): boolean {
  const digits = normalizePhone(value);
  return digits.length >= 10 && digits.length <= 13;
}
