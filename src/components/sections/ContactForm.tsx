import {
  Activity,
  CheckCircle2,
  Combine,
  Dumbbell,
  Info,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CLASS_TYPE_INFO,
  FREQUENCY_OPTIONS,
  getGenericTimeOptions,
  getTrainingTypeForTime,
  INTEREST_OPTIONS,
  type Interest,
} from "../../utils/schedule";
import { LeadSubmissionError, submitLead } from "../../utils/submitLead";
import type { LeadPayload } from "../../utils/submitLead";
import { getWhatsAppUrl } from "../../utils/whatsapp";
import { Button } from "../ui/Button";
import { PillGroup } from "../ui/PillGroup";
import { PulseOrb } from "../ui/PulseOrb";
import { Reveal } from "../ui/Reveal";

type SubmissionStatus = "idle" | "loading" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  phone: string;
  interest: Interest | "";
  frequency: string;
  preferredTime: string;
}

const initialFormState: FormState = {
  name: "",
  email: "",
  phone: "",
  interest: "",
  frequency: "",
  preferredTime: "",
};

const INTEREST_ICONS: Record<Interest, LucideIcon> = {
  funcional: Activity,
  academia: Dumbbell,
  "os-dois": Combine,
};

type CompleteFormState = FormState & { interest: Interest };

function isFormComplete(form: FormState): form is CompleteFormState {
  return Boolean(
    form.name &&
      form.email &&
      form.phone &&
      form.interest &&
      form.frequency &&
      form.preferredTime,
  );
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const timeOptions = form.interest ? getGenericTimeOptions(form.interest) : [];

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleInterestChange(nextInterest: string) {
    const interest = nextInterest as Interest;
    setForm((prev) => {
      const options = getGenericTimeOptions(interest);
      const timeStillValid = options.some((o) => o.time === prev.preferredTime);
      return {
        ...prev,
        interest,
        preferredTime: timeStillValid ? prev.preferredTime : "",
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Honeypot: bots preenchem campos ocultos, humanos não.
    const honeypot = new FormData(event.currentTarget).get("_honeypot");
    if (honeypot) return;

    if (!isFormComplete(form)) {
      setStatus("error");
      setErrorMessage("Preencha todos os campos antes de enviar.");
      return;
    }

    const trainingType = getTrainingTypeForTime(form.interest, form.preferredTime);
    if (!trainingType) {
      setStatus("error");
      setErrorMessage("Selecione um horário válido.");
      return;
    }

    const payload: LeadPayload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      interest: form.interest,
      frequency: form.frequency,
      preferredTime: form.preferredTime,
      trainingType,
    };

    setStatus("loading");
    setErrorMessage("");

    try {
      await submitLead(payload);
      setStatus("success");
      setForm(initialFormState);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof LeadSubmissionError
          ? error.message
          : "Algo deu errado. Tente novamente em instantes.",
      );
    }
  }

  return (
    <section id="contato" className="mx-auto max-w-4xl px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-center shadow-premium sm:px-16 sm:py-20">
          <PulseOrb
            className="-left-24 -top-24 rotate-12"
            variant="branco"
            opacity={0.12}
            size={320}
          />
          <PulseOrb
            className="-bottom-24 -right-24 -rotate-12"
            variant="branco"
            opacity={0.08}
            size={320}
          />

          <div className="relative">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-orange-400">
              Comece hoje
            </span>
            <h2 className="mt-4 font-display text-display-lg font-medium text-white">
              Sua evolução começa aqui.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sand-100/80">
              Preencha seus dados e nossa equipe entrará em contato para
              agendar sua aula experimental gratuita.
            </p>

            {status === "success" ? (
              <div
                role="status"
                className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 rounded-3xl border border-orange-500/30 bg-white/5 px-6 py-10 text-white"
              >
                <CheckCircle2 className="h-10 w-10 text-orange-400" />
                <p className="font-display text-xl font-medium">
                  Recebemos seus dados!
                </p>
                <p className="text-sand-100/80">
                  Nossa equipe vai entrar em contato em breve para agendar sua
                  aula experimental.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="mx-auto mt-10 flex max-w-xl flex-col gap-6 text-left"
              >
                {/* Honeypot anti-spam: mantido fora da visão e do tab order */}
                <input
                  type="text"
                  name="_honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1">
                    <label htmlFor="name" className="sr-only">
                      Nome
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Nome completo"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      disabled={status === "loading"}
                      className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white placeholder:text-sand-100/50 outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/15 disabled:opacity-60"
                    />
                  </div>

                  <div className="flex-1">
                    <label htmlFor="phone" className="sr-only">
                      WhatsApp
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="WhatsApp"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      disabled={status === "loading"}
                      className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white placeholder:text-sand-100/50 outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/15 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="sr-only">
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="E-mail"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    disabled={status === "loading"}
                    className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white placeholder:text-sand-100/50 outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/15 disabled:opacity-60"
                  />
                </div>

                <fieldset className="m-0 border-0 p-0">
                  <legend className="mb-3 text-sm font-medium text-sand-100/80">
                    Qual é o seu interesse?
                  </legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {INTEREST_OPTIONS.map((option) => {
                      const Icon = INTEREST_ICONS[option.value];
                      const isSelected = form.interest === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          disabled={status === "loading"}
                          onClick={() => handleInterestChange(option.value)}
                          aria-pressed={isSelected}
                          className={`flex flex-col items-center gap-2 rounded-2xl border px-4 py-4 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30 disabled:opacity-50 disabled:pointer-events-none ${
                            isSelected
                              ? "border-orange-500 bg-orange-500 text-white shadow-glow"
                              : "border-white/15 bg-white/5 text-sand-100/80 hover:border-orange-500/60 hover:bg-white/10"
                          }`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.75} />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="m-0 border-0 p-0">
                  <legend className="mb-3 text-sm font-medium text-sand-100/80">
                    Quantas vezes por semana?
                  </legend>
                  <PillGroup
                    name="Frequência por semana"
                    options={[...FREQUENCY_OPTIONS]}
                    value={form.frequency}
                    onChange={(value) => updateField("frequency", value)}
                    disabled={status === "loading"}
                  />
                </fieldset>

                <fieldset className="m-0 border-0 p-0">
                  <legend className="mb-3 text-sm font-medium text-sand-100/80">
                    Melhor horário
                  </legend>
                  <PillGroup
                    name="Horário preferido"
                    options={timeOptions.map((option) => ({
                      value: option.time,
                      // Todo botão traz o nome da atividade escrito — a cor
                      // do indicador é só reforço visual, nunca a única
                      // forma de saber o que é aquele horário (ex.: um
                      // horário de Funcional Teen precisa ficar óbvio).
                      label: `${option.time} · ${CLASS_TYPE_INFO[option.type].label}`,
                      dotClassName: CLASS_TYPE_INFO[option.type].dotClassName,
                    }))}
                    value={form.preferredTime}
                    onChange={(value) => updateField("preferredTime", value)}
                    disabled={status === "loading"}
                    emptyMessage="Escolha seu interesse acima para ver os horários disponíveis."
                  />

                  <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-sand-100/60">
                    <Info
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400"
                      aria-hidden="true"
                    />
                    <span>
                      Horários de segunda a quinta. Sexta-feira tem grade
                      reduzida no fim do dia e sábado funciona só pela manhã —
                      nossa equipe confirma o horário exato com você. Não
                      funcionamos aos domingos.
                    </span>
                  </p>
                </fieldset>

                {status === "error" && (
                  <p role="alert" className="text-sm text-orange-300">
                    {errorMessage}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === "loading"}
                  className="mt-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Quero ser contatado"
                  )}
                </Button>

                <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-sand-100/40">
                  <span className="h-px flex-1 bg-white/10" />
                  ou
                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-medium text-white transition-all duration-300 will-change-transform hover:scale-[1.03] hover:border-orange-500 hover:bg-white/10 active:scale-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
                  Falar no WhatsApp agora
                </a>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
