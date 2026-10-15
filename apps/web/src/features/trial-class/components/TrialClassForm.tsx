import {
  isValidPhone,
  periodEnd,
  trialClassHours,
  WEEKDAYS,
  type Weekday,
} from "@pulso-concept/forms";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarCheck2, Clock3, Loader2, MessageCircle } from "lucide-react";
import { type FormEvent, useState } from "react";
import marcaLaranja from "../../../assets/optimized/marca-laranja.png";
import { PillGroup } from "../../../components/ui/PillGroup";
import { TextField } from "../../../components/ui/TextField";
import { formatPhoneInput } from "../../../utils/phone";
import { submissionErrorMessage } from "../../../utils/submitLead";
import { WEEKDAY_LABELS } from "../../../utils/weekdays";
import { getWhatsAppUrl } from "../../../utils/whatsapp";
import { useSubmitTrialClass } from "../api";

interface FormState {
  name: string;
  phone: string;
  email: string;
  weekday: Weekday | "";
  hour: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = { name: "", phone: "", email: "", weekday: "", hour: "" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const easeOut = [0.16, 1, 0.3, 1] as const;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (form.name.trim().length < 2) errors.name = "Informe seu nome completo.";
  if (!isValidPhone(form.phone)) errors.phone = "Informe um telefone com DDD.";
  if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = "Informe um e-mail válido.";
  if (!form.weekday) errors.weekday = "Escolha o dia da semana.";
  if (!form.hour) errors.hour = "Escolha o horário.";
  return errors;
}

/** "06:00" → "06h – 07h", a short label that fits in three columns on mobile. */
function shortPeriod(hour: string): string {
  return `${hour.slice(0, 2)}h – ${periodEnd(hour).slice(0, 2)}h`;
}

interface ScheduledClass {
  firstName: string;
  weekday: Weekday;
  hour: string;
}

export function TrialClassForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [scheduled, setScheduled] = useState<ScheduledClass | null>(null);
  const submit = useSubmitTrialClass();
  const isSubmitting = submit.isPending;

  const hours = form.weekday ? trialClassHours(form.weekday) : [];

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleWeekdayChange(value: string) {
    const weekday = value as Weekday;
    setForm((current) => ({
      ...current,
      weekday,
      // Keep the time slot if it also exists on the new day (Saturday has fewer slots).
      hour: trialClassHours(weekday).includes(current.hour) ? current.hour : "",
    }));
    setErrors((current) => ({ ...current, weekday: undefined, hour: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Honeypot: bots fill in hidden fields, humans don't.
    if (new FormData(event.currentTarget).get("_honeypot")) return;

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !form.weekday) return;

    const weekday = form.weekday;
    submit.mutate(
      {
        name: form.name.trim(),
        phone: form.phone,
        email: form.email.trim(),
        weekday,
        hour: form.hour,
      },
      {
        onSuccess: () => {
          setScheduled({
            firstName: form.name.trim().split(" ")[0] ?? "",
            weekday,
            hour: form.hour,
          });
          setForm(initialForm);
        },
      },
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeOut }}
      className="relative w-full max-w-xl overflow-hidden rounded-[2rem] bg-white shadow-premium"
    >
      {/* Brand stripe at the top of the card. */}
      <div className="h-1.5 w-full bg-gradient-to-r from-magenta-500 via-orange-500 to-orange-400" />

      <img
        src={marcaLaranja}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 w-48 rotate-12 select-none opacity-[0.07]"
      />

      <div className="relative px-5 py-8 sm:px-10 sm:py-10">
        <AnimatePresence mode="wait" initial={false}>
          {scheduled ? (
            <SuccessState
              key="success"
              scheduled={scheduled}
              onReset={() => {
                setScheduled(null);
                submit.reset();
              }}
            />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-900">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                Aula experimental gratuita
              </span>
              <h1 className="mt-4 font-display text-display-md font-medium text-ink">
                Agende sua aula de musculação
              </h1>
              <p className="mt-3 text-ink-muted">
                Escolha o dia e o horário em que você quer treinar. Nossa equipe confirma tudo com
                você pelo WhatsApp.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
                <input
                  type="text"
                  name="_honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <TextField
                  label="Nome completo"
                  name="name"
                  autoComplete="name"
                  placeholder="Seu nome e sobrenome"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  error={errors.name}
                  disabled={isSubmitting}
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField
                    label="Telefone (WhatsApp)"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="(11) 91234-5678"
                    value={form.phone}
                    onChange={(event) => updateField("phone", formatPhoneInput(event.target.value))}
                    error={errors.phone}
                    disabled={isSubmitting}
                  />
                  <TextField
                    label="E-mail"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="voce@email.com"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    error={errors.email}
                    disabled={isSubmitting}
                  />
                </div>

                <fieldset className="m-0 border-0 p-0">
                  <legend className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                    <CalendarCheck2 className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                    Dia da semana para treinar
                  </legend>
                  <PillGroup
                    name="Dia da semana"
                    tone="light"
                    className="grid grid-cols-3 gap-2 sm:grid-cols-6"
                    options={WEEKDAYS.map((weekday) => ({
                      value: weekday,
                      label: WEEKDAY_LABELS[weekday].short,
                      ariaLabel: WEEKDAY_LABELS[weekday].full,
                    }))}
                    value={form.weekday}
                    onChange={handleWeekdayChange}
                    disabled={isSubmitting}
                  />
                  {errors.weekday && (
                    <p className="mt-1.5 text-sm text-red-700">{errors.weekday}</p>
                  )}
                </fieldset>

                <fieldset className="m-0 border-0 p-0">
                  <legend className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                    <Clock3 className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                    Horário
                    {form.weekday && (
                      <span className="font-normal text-ink-muted">
                        · {WEEKDAY_LABELS[form.weekday].full}
                      </span>
                    )}
                  </legend>
                  <PillGroup
                    name="Horário"
                    tone="light"
                    className="grid grid-cols-3 gap-2 sm:grid-cols-4"
                    options={hours.map((hour) => ({
                      value: hour,
                      label: shortPeriod(hour),
                      ariaLabel: `Das ${hour} às ${periodEnd(hour)}`,
                    }))}
                    value={form.hour}
                    onChange={(value) => updateField("hour", value)}
                    disabled={isSubmitting}
                    emptyMessage="Escolha um dia para ver os horários disponíveis."
                  />
                  {errors.hour && form.weekday && (
                    <p className="mt-1.5 text-sm text-red-700">{errors.hour}</p>
                  )}
                  <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                    Cada opção é um período de 1 hora. Sexta-feira vai até as 18h e sábado funciona
                    só pela manhã. Não abrimos aos domingos.
                  </p>
                </fieldset>

                {submit.isError && (
                  <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
                    {submissionErrorMessage(submit.error)}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-base font-medium text-white transition-all duration-300 hover:bg-ink-soft hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      Agendar aula experimental
                      <ArrowRight
                        className="h-5 w-5 text-orange-400 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-ink-muted">
                  Ao enviar, você concorda em ser contatado pela equipe da Pulso Concept.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface SuccessStateProps {
  scheduled: ScheduledClass;
  onReset: () => void;
}

function SuccessState({ scheduled, onReset }: SuccessStateProps) {
  const day = WEEKDAY_LABELS[scheduled.weekday].full.toLowerCase();
  const period = `das ${scheduled.hour} às ${periodEnd(scheduled.hour)}`;
  const whatsappMessage = `Olá! Acabei de agendar uma aula experimental de musculação pelo site para ${day}, ${period}.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOut }}
      role="status"
      className="flex flex-col items-center py-4 text-center"
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-orange-500/25 motion-safe:animate-ping" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-magenta-500 to-orange-500">
          <CalendarCheck2 className="h-9 w-9 text-white" strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>

      <h1 className="mt-6 font-display text-display-md font-medium text-ink">
        {scheduled.firstName ? `Tudo certo, ${scheduled.firstName}!` : "Tudo certo!"}
      </h1>
      <p className="mt-3 max-w-sm text-ink-muted">
        Recebemos seu pedido de aula experimental para{" "}
        <strong className="font-semibold text-ink">
          {day}, {period}
        </strong>
        . Em breve nossa equipe confirma com você pelo WhatsApp.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3">
        <a
          href={getWhatsAppUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-8 py-4 text-base font-medium text-white transition-all duration-300 hover:bg-ink-soft hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          <MessageCircle
            className="h-5 w-5 text-orange-400"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          Falar no WhatsApp agora
        </a>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-sand-100 px-8 py-4 text-base font-medium text-ink transition-colors hover:bg-sand-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          Conhecer o studio
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="mt-1 text-sm font-medium text-ink-muted underline-offset-4 hover:text-ink hover:underline"
        >
          Agendar para outra pessoa
        </button>
      </div>
    </motion.div>
  );
}
