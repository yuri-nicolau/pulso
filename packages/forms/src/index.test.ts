import { expect, test } from "bun:test";
import {
  isTrialClassHourAvailable,
  isValidEmail,
  isValidPhone,
  normalizeEmail,
  normalizePhone,
  periodEnd,
  sortWeekdays,
  trialClassHours,
  trialClassHoursForDays,
  WEEKDAYS,
} from "./index";

test("every day from Monday to Saturday offers one-hour periods from 05:00 to 21:00", () => {
  for (const day of WEEKDAYS) {
    const hours = trialClassHours(day);
    expect(hours[0]).toBe("05:00");
    expect(hours.at(-1)).toBe("20:00");
    expect(hours).toHaveLength(16);
  }
});

test("only periods inside opening hours are available", () => {
  expect(isTrialClassHourAvailable("sabado", "05:00")).toBe(true);
  expect(isTrialClassHourAvailable("sabado", "20:00")).toBe(true);
  expect(isTrialClassHourAvailable("terca", "04:00")).toBe(false);
  expect(isTrialClassHourAvailable("terca", "21:00")).toBe(false);
});

test("periodEnd is one hour later", () => {
  expect(periodEnd("06:00")).toBe("07:00");
  expect(periodEnd("20:00")).toBe("21:00");
});

test("several days offer every period open on at least one of them, in order", () => {
  expect(trialClassHoursForDays(["sabado"])).toEqual(trialClassHours("sabado"));
  expect(trialClassHoursForDays(["sabado", "segunda"])).toEqual(trialClassHours("segunda"));
  expect(trialClassHoursForDays([])).toEqual([]);
});

test("sortWeekdays keeps week order and drops repeats", () => {
  expect(sortWeekdays(["sabado", "segunda", "quarta", "segunda"])).toEqual([
    "segunda",
    "quarta",
    "sabado",
  ]);
});

test("phones are digits only", () => {
  expect(normalizePhone("+55 (11) 91234-5678")).toBe("5511912345678");
});

test("only real Brazilian mobile and landline numbers are valid", () => {
  expect(isValidPhone("(11) 91234-5678")).toBe(true);
  expect(isValidPhone("(11) 3123-4567")).toBe(true);
  expect(isValidPhone("+55 (21) 99876-5432")).toBe(true);
  expect(isValidPhone("(55) 3222-1111")).toBe(true);
  // Missing area code, too long, area code with a zero, mobile without the 9, landline 6–8.
  expect(isValidPhone("91234-5678")).toBe(false);
  expect(isValidPhone("+55 11 91234-5678 0")).toBe(false);
  expect(isValidPhone("(10) 91234-5678")).toBe(false);
  expect(isValidPhone("(11) 81234-5678")).toBe(false);
  expect(isValidPhone("(11) 7123-4567")).toBe(false);
  expect(isValidPhone("(11) 11111-1111")).toBe(false);
});

test("emails are lowercase without spaces, and must be well formed", () => {
  expect(normalizeEmail("  Maria.Silva@Example.COM ")).toBe("maria.silva@example.com");
  for (const email of ["maria@example.com", "a.b+tag@mail.co", "joao_1@sub.dominio.com.br"]) {
    expect(isValidEmail(email)).toBe(true);
  }
  for (const email of [
    "maria",
    "maria@",
    "@example.com",
    "maria@example",
    "maria@example.c",
    "maria..silva@example.com",
    "maria@exa_mple.com",
    ".maria@example.com",
    "maria@-example.com",
    "ma ria@example.com",
  ]) {
    expect(isValidEmail(email)).toBe(false);
  }
});
