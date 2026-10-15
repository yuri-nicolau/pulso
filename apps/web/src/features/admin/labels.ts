import type { ContactAnswers, TrialClassAnswers } from "@pulso-concept/forms";
import type { BadgeTone } from "../../components/ui/Badge";
import { formatPeriodList, formatShortPeriodList } from "../../utils/periods";
import { CLASS_TYPE_INFO, FREE_TIME_LABEL, INTEREST_OPTIONS } from "../../utils/schedule";
import { formatWeekdayList } from "../../utils/weekdays";
import type { FormKey, LeadStatus, LeadView, PaymentStatus } from "./api";

export const FORM_LABELS: Record<FormKey, string> = {
  trial_class: "Aula experimental",
  contact: "Contato do site",
};

export const STATUS_LABELS: Record<LeadStatus, { label: string; tone: BadgeTone }> = {
  new: { label: "Novo", tone: "orange" },
  contacted: { label: "Em contato", tone: "sky" },
  trial_scheduled: { label: "Aula agendada", tone: "violet" },
  enrolled: { label: "Matriculado", tone: "emerald" },
  lost: { label: "Não fechou", tone: "neutral" },
};

export const PAYMENT_LABELS: Record<PaymentStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: "Pendente", tone: "amber" },
  paid: { label: "Pago", tone: "emerald" },
};

export const STATUS_ORDER = Object.keys(STATUS_LABELS) as LeadStatus[];
export const PAYMENT_ORDER = Object.keys(PAYMENT_LABELS) as PaymentStatus[];
export const FORM_ORDER = Object.keys(FORM_LABELS) as FormKey[];

const INTEREST_LABELS = Object.fromEntries(
  INTEREST_OPTIONS.map((option) => [option.value, option.label]),
) as Record<ContactAnswers["interest"], string>;

/** "Seg, Qua · 07h – 08h, 18h – 19h": the trial class preferences in one compact line. */
export function trialPreferences(answers: TrialClassAnswers): string {
  return `${formatWeekdayList(answers.weekdays, "short")} · ${formatShortPeriodList(answers.hours)}`;
}

/** A one-line summary of the lead's preference, for the list. */
export function leadSummary(lead: LeadView): string {
  if (lead.form === "trial_class") {
    return `Musculação · ${trialPreferences(lead.answers as TrialClassAnswers)}`;
  }
  const answers = lead.answers as ContactAnswers;
  const time = answers.preferredTime ?? FREE_TIME_LABEL;
  return `${INTEREST_LABELS[answers.interest]} · ${answers.frequency}/semana · ${time}`;
}

/** Form questions and answers, in the order they were asked. */
export function leadAnswers(lead: LeadView): { question: string; answer: string }[] {
  if (lead.form === "trial_class") {
    const answers = lead.answers as TrialClassAnswers;
    return [
      { question: "Modalidade", answer: "Musculação" },
      { question: "Dias de preferência", answer: formatWeekdayList(answers.weekdays) },
      { question: "Horários de preferência", answer: formatPeriodList(answers.hours) },
    ];
  }
  const answers = lead.answers as ContactAnswers;
  return [
    { question: "Interesse", answer: INTEREST_LABELS[answers.interest] },
    { question: "Vezes por semana", answer: answers.frequency },
    { question: "Melhor horário", answer: answers.preferredTime ?? FREE_TIME_LABEL },
    { question: "Treino no horário", answer: CLASS_TYPE_INFO[answers.trainingType].label },
  ];
}

const DATE_TIME = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

export function formatDateTime(iso: string): string {
  return DATE_TIME.format(new Date(iso));
}

/** Ready-made message to start the WhatsApp conversation with the lead. */
export function whatsappGreeting(lead: LeadView): string {
  const firstName = lead.name.split(" ")[0] ?? lead.name;
  if (lead.form === "trial_class") {
    const answers = lead.answers as TrialClassAnswers;
    const days = formatWeekdayList(answers.weekdays).toLowerCase();
    return `Olá, ${firstName}! Aqui é da Pulso Concept. Recebemos seu interesse em uma aula experimental de musculação, com preferência por ${days}, nos horários ${formatPeriodList(answers.hours)}. Vamos combinar o melhor dia para você?`;
  }
  return `Olá, ${firstName}! Aqui é da Pulso Concept. Recebemos seu contato pelo site e queremos agendar sua aula experimental. Qual o melhor dia para você?`;
}
