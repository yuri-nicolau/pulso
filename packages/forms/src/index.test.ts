import { expect, test } from "bun:test";
import {
  isTrialClassHourAvailable,
  isValidPhone,
  normalizePhone,
  periodEnd,
  trialClassHours,
  WEEKDAYS,
} from "./index";

test("weekdays offer one-hour periods from 06:00 to 20:00", () => {
  const hours = trialClassHours("segunda");
  expect(hours[0]).toBe("06:00");
  expect(hours.at(-1)).toBe("19:00");
  expect(hours).toHaveLength(14);
});

test("Friday ends earlier and Saturday is morning only", () => {
  expect(trialClassHours("sexta").at(-1)).toBe("17:00");
  expect(trialClassHours("sabado")).toEqual(["08:00", "09:00"]);
});

test("every day offers at least one period, and only those are available", () => {
  for (const day of WEEKDAYS) expect(trialClassHours(day).length).toBeGreaterThan(0);
  expect(isTrialClassHourAvailable("sabado", "08:00")).toBe(true);
  expect(isTrialClassHourAvailable("sabado", "10:00")).toBe(false);
  expect(isTrialClassHourAvailable("terca", "05:00")).toBe(false);
});

test("periodEnd is one hour later", () => {
  expect(periodEnd("06:00")).toBe("07:00");
  expect(periodEnd("19:00")).toBe("20:00");
});

test("phones are digits only, 10 to 13 of them", () => {
  expect(normalizePhone("+55 (11) 91234-5678")).toBe("5511912345678");
  expect(isValidPhone("(11) 91234-5678")).toBe(true);
  expect(isValidPhone("(11) 3123-4567")).toBe(true);
  expect(isValidPhone("91234-5678")).toBe(false);
  expect(isValidPhone("+55 11 91234-5678 0")).toBe(false);
});
