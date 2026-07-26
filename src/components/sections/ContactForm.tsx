import { Button } from "../ui/Button";
import { PulseOrb } from "../ui/PulseOrb";
import { Reveal } from "../ui/Reveal";

export function ContactForm() {
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

            <form
              action="https://formsubmit.co/SEU_EMAIL_AQUI"
              method="POST"
              className="mx-auto mt-10 flex max-w-md flex-col gap-4 text-left"
            >
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input
                type="hidden"
                name="_subject"
                value="Nova aula experimental — Pulso Concept"
              />
              <input
                type="hidden"
                name="_next"
                value="https://seudominio.com/obrigado"
              />

              <div>
                <label htmlFor="name" className="sr-only">
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Nome completo"
                  className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white placeholder:text-sand-100/50 outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/15"
                />
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
                  className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white placeholder:text-sand-100/50 outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/15"
                />
              </div>

              <div>
                <label htmlFor="phone" className="sr-only">
                  WhatsApp
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="WhatsApp"
                  className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white placeholder:text-sand-100/50 outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/15"
                />
              </div>

              <div>
                <label htmlFor="goal" className="sr-only">
                  Objetivo
                </label>
                <select
                  id="goal"
                  name="goal"
                  defaultValue=""
                  required
                  className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/15 [&>option]:text-ink"
                >
                  <option value="" disabled>
                    Qual seu objetivo?
                  </option>
                  <option value="emagrecimento">Emagrecimento</option>
                  <option value="ganho-de-forca">Ganho de força</option>
                  <option value="condicionamento">
                    Condicionamento físico
                  </option>
                  <option value="qualidade-de-vida">Qualidade de vida</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="mt-2"
              >
                Agendar minha aula experimental
              </Button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
