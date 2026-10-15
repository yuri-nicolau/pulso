import { expect, test } from "bun:test";
import { formatPeriodList, formatShortPeriodList, shortPeriod } from "./periods";
import { formatWeekdayList } from "./weekdays";

test("formats one-hour periods", () => {
  expect(shortPeriod("06:00")).toBe("06h – 07h");
  // Periods never break across lines (word joiners around the dash).
  const plain = (text: string) => text.replaceAll("\u2060", "");
  expect(plain(formatPeriodList(["18:00", "07:00"]))).toBe("07:00–08:00 e 18:00–19:00");
  expect(formatPeriodList(["09:00"])).toBe("09:00\u2060–\u206010:00");
  expect(formatShortPeriodList(["18:00", "07:00", "12:00"])).toBe(
    "07h – 08h, 12h – 13h, 18h – 19h",
  );
});

test("formats weekdays in week order", () => {
  expect(formatWeekdayList(["sabado", "segunda", "quarta"])).toBe(
    "Segunda-feira, Quarta-feira e Sábado",
  );
  expect(formatWeekdayList(["sexta", "terca"], "short")).toBe("Ter, Sex");
});
