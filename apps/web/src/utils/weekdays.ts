import type { Weekday } from "@pulso-concept/forms";

export const WEEKDAY_LABELS: Record<Weekday, { full: string; short: string }> = {
  segunda: { full: "Segunda-feira", short: "Seg" },
  terca: { full: "Terça-feira", short: "Ter" },
  quarta: { full: "Quarta-feira", short: "Qua" },
  quinta: { full: "Quinta-feira", short: "Qui" },
  sexta: { full: "Sexta-feira", short: "Sex" },
  sabado: { full: "Sábado", short: "Sáb" },
};
