import type { Weekday } from "@pulso-concept/forms";
import { sortWeekdays } from "@pulso-concept/forms";

export const WEEKDAY_LABELS: Record<Weekday, { full: string; short: string }> = {
  segunda: { full: "Segunda-feira", short: "Seg" },
  terca: { full: "Terça-feira", short: "Ter" },
  quarta: { full: "Quarta-feira", short: "Qua" },
  quinta: { full: "Quinta-feira", short: "Qui" },
  sexta: { full: "Sexta-feira", short: "Sex" },
  sabado: { full: "Sábado", short: "Sáb" },
};

const LIST = new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" });

/** ["segunda", "quarta"] → "Segunda-feira e Quarta-feira" ("short": "Seg, Qua"), in week order. */
export function formatWeekdayList(weekdays: readonly Weekday[], style: "full" | "short" = "full") {
  const labels = sortWeekdays(weekdays).map((weekday) => WEEKDAY_LABELS[weekday][style]);
  return style === "short" ? labels.join(", ") : LIST.format(labels);
}
