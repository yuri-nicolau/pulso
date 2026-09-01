import { Check } from "lucide-react";
import { PulseOrb } from "../ui/PulseOrb";
import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";

const AUDIENCE = [
  "Emagrecer",
  "Ganhar força",
  "Desenvolver massa muscular",
  "Melhorar o condicionamento físico",
  "Ter mais disposição",
  "Cuidar da saúde",
  "Treinar com acompanhamento profissional",
  "Fazer parte de uma comunidade que incentiva a evolução",
];

export function About() {
  return (
    <section id="sobre" className="relative mx-auto max-w-6xl px-6">
      <PulseOrb className="-left-32 -top-32" size={420} />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-4 -top-10 select-none font-display text-ghost text-ink/[0.04] sm:-top-16"
      >
        01
      </span>

      <div className="relative flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
        <Reveal className="w-full md:w-1/2" y={40}>
          <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-premium">
            <img
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80"
              alt="Professor orientando aluno durante o treino na Pulso Concept"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        </Reveal>

        <div className="w-full md:w-1/2">
          <Reveal delay={0.05}>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-orange-500">
              Quem somos
            </span>
            <h2 className="mt-4 font-display text-display-lg font-medium text-ink">
              Mais do que um lugar para treinar.
            </h2>
            <p className="mt-6 text-ink-muted">
              A Pulso Concept é um estúdio premium de treinamento que une
              performance, saúde e bem-estar em um ambiente moderno,
              acolhedor e exclusivo. Trabalhamos com grupos reduzidos para
              oferecer acompanhamento próximo, correções individuais e um
              planejamento de treinamento alinhado aos objetivos de cada
              aluno.
            </p>
            <p className="mt-4 text-ink-muted">
              Aqui, cada aluno se sente pertencente a uma comunidade que
              valoriza qualidade de vida, evolução constante e atendimento
              personalizado — desde a entrada até o término do treino.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="mt-10 font-display text-lg font-medium text-ink">
              Para quem é a Pulso Concept
            </h3>
          </Reveal>

          <StaggerGroup className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {AUDIENCE.map((item) => (
              <StaggerItem key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Check size={13} strokeWidth={2.5} />
                </span>
                <span className="text-sm text-ink-soft">{item}</span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
