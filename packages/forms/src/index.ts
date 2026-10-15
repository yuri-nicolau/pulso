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

// Trial class form (/aula-experimental): the days and one-hour periods the person prefers for a
// weight training trial. A preference, not a booking: the studio contacts them to schedule it.
export interface TrialClassAnswers {
  // In week order, no repeats.
  weekdays: Weekday[];
  // Starts of the one-hour periods ("HH:00"), in order, no repeats.
  hours: string[];
}

export type LeadAnswers = ContactAnswers | TrialClassAnswers;

// The studio's opening hours per day (05:00–21:00, Monday to Saturday; closed on Sundays), as
// the first hour of each one-hour period offered: the last period is 20:00–21:00.
const OPEN_ALL_DAY = { first: 5, last: 20 };
const TRIAL_CLASS_HOUR_RANGES: Record<Weekday, { first: number; last: number }> = {
  segunda: OPEN_ALL_DAY,
  terca: OPEN_ALL_DAY,
  quarta: OPEN_ALL_DAY,
  quinta: OPEN_ALL_DAY,
  sexta: OPEN_ALL_DAY,
  sabado: OPEN_ALL_DAY,
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

// Every period offered on at least one of the days, in order: the choices once days are picked.
export function trialClassHoursForDays(weekdays: readonly Weekday[]): string[] {
  const hours = new Set(weekdays.flatMap((weekday) => trialClassHours(weekday)));
  return [...hours].sort();
}

export function sortWeekdays(weekdays: readonly Weekday[]): Weekday[] {
  return WEEKDAYS.filter((weekday) => weekdays.includes(weekday));
}

// "06:00" → "07:00": the end of a one-hour period.
export function periodEnd(hour: string): string {
  return formatHour(Number(hour.slice(0, 2)) + 1);
}

// Brazilian phone numbers, stored as digits only, with or without the 55 country code.
export function normalizePhone(value: string): string {
  return value.replaceAll(/\D/g, "");
}

// A real Brazilian number: a valid area code (11–99, no zero digit), then a mobile (9 + 8 digits)
// or a landline (2–5 + 7 digits). The 55 country code is optional.
export function isValidPhone(value: string): boolean {
  const digits = normalizePhone(value);
  const local = digits.length > 11 && digits.startsWith("55") ? digits.slice(2) : digits;
  return /^[1-9]{2}(9\d{8}|[2-5]\d{7})$/.test(local);
}

const EMAIL_PATTERN =
  /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;

// Emails are kept lowercase and without spaces.
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  const email = normalizeEmail(value);
  return email.length <= 200 && !email.includes("..") && EMAIL_PATTERN.test(email);
}
