import {
  isValidEmail,
  isValidPhone,
  periodEnd,
  sortWeekdays,
  trialClassHoursForDays,
  WEEKDAYS,
  type Weekday,
} from "@pulso-concept/forms";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock3, MessageCircle, PhoneCall } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import marcaLaranja from "../../../assets/optimized/marca-laranja.png";
import { ChipCheckboxGroup } from "../../../components/ui/ChipCheckboxGroup";
import { TextField } from "../../../components/ui/TextField";
import { formatEmailInput } from "../../../utils/email";
import { formatPeriodList, shortPeriod } from "../../../utils/periods";
import { formatPhoneInput } from "../../../utils/phone";
import { submissionErrorMessage } from "../../../utils/submitLead";
import { formatWeekdayList, WEEKDAY_LABELS } from "../../../utils/weekdays";
import { getWhatsAppUrl } from "../../../utils/whatsapp";
import { useSubmitTrialClass } from "../api";
import { ConfirmSubmitButton, type SubmitPhase } from "./ConfirmSubmitButton";

interface FormState {
  name: string;
  phone: string;
  email: string;
  weekdays: Weekday[];
  hours: string[];
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = { name: "", phone: "", email: "", weekdays: [], hours: [] };

// How long the button's confirmation animation plays before the success state replaces the form.
const CONFIRMATION_MS = 1600;

const easeOut = [0.16, 1, 0.3, 1] as const;

const FIELD_ERRORS = {
  name: "Informe seu nome completo.",
  phone: "Informe um celular ou telefone válido, com DDD.",
  email: "Informe um e-mail válido, como nome@exemplo.com.",
  weekdays: "Escolha pelo menos um dia.",
  hours: "Escolha pelo menos um horário.",
} as const;

function validateField(field: keyof FormState, form: FormState): string | undefined {
  switch (field) {
    case "name":
      return form.name.trim().length >= 2 ? undefined : FIELD_ERRORS.name;
    case "phone":
      return isValidPhone(form.phone) ? undefined : FIELD_ERRORS.phone;
    case "email":
      return isValidEmail(form.email) ? undefined : FIELD_ERRORS.email;
    case "weekdays":
      return form.weekdays.length > 0 ? undefined : FIELD_ERRORS.weekdays;
    case "hours":
      return form.hours.length > 0 ? undefined : FIELD_ERRORS.hours;
  }
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of Object.keys(FIELD_ERRORS) as (keyof FormState)[]) {
    const error = validateField(field, form);
    if (error) errors[field] = error;
  }
  return errors;
}

interface SentRequest {
  firstName: string;
  weekdays: Weekday[];
  hours: string[];
}

export function TrialClassForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [confirming, setConfirming] = useState(false);
  const [sent, setSent] = useState<SentRequest | null>(null);
  const submit = useSubmitTrialClass();
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(confirmTimer.current), []);

  const busy = submit.isPending || confirming;
  const phase: SubmitPhase = confirming ? "success" : submit.isPending ? "loading" : "idle";
  // Before any day is picked, every period the studio offers on some day is shown.
  const hourOptions = trialClassHoursForDays(form.weekdays.length > 0 ? form.weekdays : WEEKDAYS);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  // Masked fields are checked when the person leaves them, so typos show up before sending.
  function validateOnBlur(field: "name" | "phone" | "email") {
    if (!form[field]) return;
    setErrors((current) => ({ ...current, [field]: validateField(field, form) }));
  }

  function handleWeekdaysChange(values: string[]) {
    const weekdays = sortWeekdays(values as Weekday[]);
    const offered = trialClassHoursForDays(weekdays);
    setForm((current) => ({
      ...current,
      weekdays,
      // Drop periods no chosen day offers (all days share the same hours today).
      hours:
        weekdays.length > 0
          ? current.hours.filter((hour) => offered.includes(hour))
          : current.hours,
    }));
    setErrors((current) => ({ ...current, weekdays: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    // Honeypot: bots fill hidden fields, humans don't.
    if (new FormData(event.currentTarget).get("_honeypot")) return;

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const request: SentRequest = {
      firstName: form.name.trim().split(" ")[0] ?? "",
      weekdays: form.weekdays,
      hours: [...form.hours].sort(),
    };
    submit.mutate(
      {
        name: form.name.trim(),
        phone: form.phone,
        email: form.email,
        weekdays: request.weekdays,
        hours: request.hours,
      },
      {
        onSuccess: () => {
          setConfirming(true);
          confirmTimer.current = setTimeout(() => {
            setConfirming(false);
            setSent(request);
            setForm(initialForm);
          }, CONFIRMATION_MS);
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
      {/* Brand stripe across the top of the card. */}
      <div className="h-1.5 w-full bg-gradient-to-r from-magenta-500 via-orange-500 to-orange-400" />

      <img
        src={marcaLaranja}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 w-48 rotate-12 select-none opacity-[0.07]"
      />

      <div className="relative px-5 py-8 sm:px-10 sm:py-10">
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <SuccessState
              key="success"
              request={sent}
              onReset={() => {
                setSent(null);
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
                Aula experimental
              </span>
              <h1 className="mt-4 font-display text-display-md font-medium text-ink">
                Quando você quer treinar?
              </h1>
              <p className="mt-3 text-ink-muted">
                Conte os dias e horários de sua preferência para a aula experimental de musculação.
                A equipe da Pulso Concept entra em contato para combinar tudo com você.
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
                  maxLength={120}
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  onBlur={() => validateOnBlur("name")}
                  error={errors.name}
                  disabled={busy}
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField
                    label="Telefone (WhatsApp)"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="(11) 91234-5678"
                    maxLength={15}
                    value={form.phone}
                    onChange={(event) => updateField("phone", formatPhoneInput(event.target.value))}
                    onBlur={() => validateOnBlur("phone")}
                    error={errors.phone}
                    disabled={busy}
                  />
                  <TextField
                    label="E-mail"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="nome@exemplo.com"
                    maxLength={200}
                    value={form.email}
                    onChange={(event) => updateField("email", formatEmailInput(event.target.value))}
                    onBlur={() => validateOnBlur("email")}
                    error={errors.email}
                    disabled={busy}
                  />
                </div>

                <fieldset className="m-0 border-0 p-0">
                  <legend className="mb-2 text-sm font-medium text-ink">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                      Dias de preferência
                    </span>
                    <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                      Escolha um ou mais.
                    </span>
                  </legend>
                  <ChipCheckboxGroup
                    className="grid grid-cols-3 gap-2 sm:grid-cols-6"
                    options={WEEKDAYS.map((weekday) => ({
                      value: weekday,
                      label: WEEKDAY_LABELS[weekday].short,
                      ariaLabel: WEEKDAY_LABELS[weekday].full,
                    }))}
                    values={form.weekdays}
                    onChange={handleWeekdaysChange}
                    disabled={busy}
                  />
                  {errors.weekdays && (
                    <p className="mt-1.5 text-sm text-red-700">{errors.weekdays}</p>
                  )}
                </fieldset>

                <fieldset className="m-0 border-0 p-0">
                  <legend className="mb-2 text-sm font-medium text-ink">
                    <span className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                      Horários de preferência
                    </span>
                    <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                      Escolha um ou mais.
                    </span>
                  </legend>
                  <ChipCheckboxGroup
                    className="grid grid-cols-3 gap-2 sm:grid-cols-4"
                    options={hourOptions.map((hour) => ({
                      value: hour,
                      label: shortPeriod(hour),
                      ariaLabel: `Das ${hour} às ${periodEnd(hour)}`,
                    }))}
                    values={form.hours}
                    onChange={(values) => updateField("hours", values)}
                    disabled={busy}
                  />
                  {errors.hours && <p className="mt-1.5 text-sm text-red-700">{errors.hours}</p>}
                  <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                    Cada opção é um período de 1 hora. Funcionamos das 5h às 21h, de segunda a
                    sábado.
                  </p>
                </fieldset>

                {submit.isError && (
                  <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
                    {submissionErrorMessage(submit.error)}
                  </p>
                )}

                <ConfirmSubmitButton
                  phase={phase}
                  idleLabel="Enviar minhas preferências"
                  loadingLabel="Enviando…"
                  successLabel="Preferências enviadas!"
                />

                <p className="text-center text-xs leading-relaxed text-ink-muted">
                  O envio não confirma a aula: a equipe da Pulso Concept vai entrar em contato para
                  combinar o dia e o horário com você.
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
  request: SentRequest;
  onReset: () => void;
}

function SuccessState({ request, onReset }: SuccessStateProps) {
  const days = formatWeekdayList(request.weekdays);
  const periods = formatPeriodList(request.hours);
  const whatsappMessage = `Olá! Acabei de enviar pelo site meu interesse em uma aula experimental de musculação. Tenho preferência por ${days.toLowerCase()}, nos horários ${periods}.`;

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
          <PhoneCall className="h-9 w-9 text-white" strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>

      <h1 className="mt-6 font-display text-display-md font-medium text-ink">
        {request.firstName ? `Recebemos, ${request.firstName}!` : "Recebemos!"}
      </h1>
      <p className="mt-3 max-w-sm text-ink-muted">
        A equipe da Pulso Concept vai entrar em contato pelo WhatsApp para combinar o dia e o
        horário da sua aula experimental.
      </p>

      <dl className="mt-6 w-full divide-y divide-sand-200 rounded-2xl bg-sand-50 px-4 text-left text-sm">
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="shrink-0 text-ink-muted">Dias de preferência</dt>
          <dd className="text-right font-medium text-ink">{days}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="shrink-0 text-ink-muted">Horários</dt>
          <dd className="text-right font-medium text-ink">{periods}</dd>
        </div>
      </dl>

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
          Enviar para outra pessoa
        </button>
      </div>
    </motion.div>
  );
}
