/**
 * Pulso Concept class schedule model.
 *
 * The real schedule (days x times x workout type) lives here as data —
 * the contact form uses these functions to offer only day/time combinations
 * that actually exist, filtered by the user's interest.
 */

import type { ClassType, Interest, Weekday } from "@pulso-concept/forms";

export type { ClassType, Interest };
export type WeekDay = Weekday;

export interface ScheduleSlot {
  day: WeekDay;
  time: string;
  type: ClassType;
}

export const CLASS_TYPE_INFO: Record<ClassType, { label: string; dotClassName: string }> = {
  funcional: { label: "Funcional", dotClassName: "bg-orange-500" },
  hiit: { label: "HIIT 40'", dotClassName: "bg-red-500" },
  pilates: { label: "Pilates Funcional", dotClassName: "bg-purple-500" },
  musculacao: { label: "Musculação", dotClassName: "bg-blue-500" },
  "funcional-teen": { label: "Funcional Teen", dotClassName: "bg-green-500" },
};

// Scheduled class types that each interest unlocks in the form.
// Weight training has a free schedule, so it never appears here: picking only
// "Academia" needs no time slot, and "Os dois" sees only the time slots
// of the "Sala Funcional" classes.
export const INTEREST_CLASS_TYPES: Record<Interest, ClassType[]> = {
  funcional: ["funcional", "hiit", "pilates", "funcional-teen"],
  academia: [],
  "os-dois": ["funcional", "hiit", "pilates", "funcional-teen"],
};

// Shown instead of the time slot when the interest is weight training only (sent as `null`).
export const FREE_TIME_LABEL = "Horário livre";

/** Whether the interest requires picking a class time slot in the form. */
export function requiresPreferredTime(interest: Interest): boolean {
  return INTEREST_CLASS_TYPES[interest].length > 0;
}

export const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: "funcional", label: "Treino funcional" },
  { value: "academia", label: "Academia" },
  { value: "os-dois", label: "Os dois" },
];

// Labels are short on purpose: they become compact chips that flow in one line
// (the "Quantas vezes por semana?" fieldset already gives the full context).
export const FREQUENCY_OPTIONS = [
  { value: "1x", label: "1x" },
  { value: "2x", label: "2x" },
  { value: "3x", label: "3x" },
  { value: "4x", label: "4x" },
  { value: "5x+", label: "5x+" },
] as const;

// Weekly schedule — kept in sync with the Studio's schedule material.
export const SCHEDULE: ScheduleSlot[] = [
  // Monday
  { day: "segunda", time: "06:00", type: "funcional" },
  { day: "segunda", time: "07:00", type: "funcional" },
  { day: "segunda", time: "10:00", type: "pilates" },
  { day: "segunda", time: "12:00", type: "hiit" },
  { day: "segunda", time: "17:00", type: "funcional-teen" },
  { day: "segunda", time: "18:00", type: "funcional" },
  { day: "segunda", time: "19:00", type: "funcional" },
  // Tuesday
  { day: "terca", time: "06:00", type: "funcional" },
  { day: "terca", time: "07:00", type: "funcional" },
  { day: "terca", time: "09:00", type: "funcional" },
  { day: "terca", time: "16:00", type: "musculacao" },
  { day: "terca", time: "18:00", type: "funcional" },
  { day: "terca", time: "19:00", type: "funcional" },
  // Wednesday
  { day: "quarta", time: "06:00", type: "funcional" },
  { day: "quarta", time: "07:00", type: "funcional" },
  { day: "quarta", time: "12:00", type: "hiit" },
  { day: "quarta", time: "17:00", type: "funcional-teen" },
  { day: "quarta", time: "18:00", type: "funcional" },
  { day: "quarta", time: "19:00", type: "funcional" },
  // Thursday
  { day: "quinta", time: "06:00", type: "funcional" },
  { day: "quinta", time: "07:00", type: "funcional" },
  { day: "quinta", time: "09:00", type: "funcional" },
  { day: "quinta", time: "10:00", type: "pilates" },
  { day: "quinta", time: "16:00", type: "musculacao" },
  { day: "quinta", time: "18:00", type: "funcional" },
  { day: "quinta", time: "19:00", type: "funcional" },
  // Friday
  { day: "sexta", time: "06:00", type: "funcional" },
  { day: "sexta", time: "07:00", type: "funcional" },
  { day: "sexta", time: "12:00", type: "hiit" },
  { day: "sexta", time: "16:00", type: "funcional-teen" },
  { day: "sexta", time: "17:00", type: "funcional" },
  // Saturday
  { day: "sabado", time: "08:00", type: "musculacao" },
  { day: "sabado", time: "09:00", type: "funcional" },
];

// Monday to Thursday follow the same time pattern — so they are the basis
// of the "generic" options offered in the form. Friday (reduced evening
// schedule) and Saturday (mornings only) differ, so they are left out of this
// list; the form mentions that difference instead of asking for a day.
const CORE_WEEKDAYS: WeekDay[] = ["segunda", "terca", "quarta", "quinta"];

export interface GenericTimeOption {
  time: string;
  type: ClassType;
}

/**
 * Typical time slots (Monday to Thursday) matching the given interest,
 * one per time, sorted. Each time maps to a single workout type
 * within that range of days.
 */
export function getGenericTimeOptions(interest: Interest): GenericTimeOption[] {
  const allowedTypes = INTEREST_CLASS_TYPES[interest];
  const typeByTime = new Map<string, ClassType>();

  for (const slot of SCHEDULE) {
    if (!CORE_WEEKDAYS.includes(slot.day)) continue;
    if (!allowedTypes.includes(slot.type)) continue;
    typeByTime.set(slot.time, slot.type);
  }

  return [...typeByTime.entries()]
    .map(([time, type]) => ({ time, type }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

/** Workout type for an already validated generic time slot. */
export function getTrainingTypeForTime(interest: Interest, time: string): ClassType | undefined {
  return getGenericTimeOptions(interest).find((option) => option.time === time)?.type;
}
