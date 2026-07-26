import type { LucideIcon } from "lucide-react";
import {
  Dumbbell,
  Users,
  Activity,
  Weight,
  UserCheck,
  Thermometer,
  Sparkles,
  HeartPulse,
  HeartHandshake,
} from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";

interface SpaceFeature {
  icon: LucideIcon;
  label: string;
}

interface SpaceCardProps {
  title: string;
  description: string;
  image: string;
  features: SpaceFeature[];
  align: "left" | "right";
}

const functionalFeatures: SpaceFeature[] = [
  { icon: Users, label: "Grupos reduzidos" },
  { icon: Activity, label: "Treino dinâmico" },
  { icon: UserCheck, label: "Acompanhamento próximo" },
];

const strengthFeatures: SpaceFeature[] = [
  { icon: Dumbbell, label: "Força e hipertrofia" },
  { icon: Weight, label: "Pesos livres e aparelhos" },
  { icon: UserCheck, label: "Orientação profissional" },
];

const extras: SpaceFeature[] = [
  { icon: Thermometer, label: "Ambiente climatizado" },
  { icon: Sparkles, label: "Equipamentos modernos" },
  { icon: HeartPulse, label: "Tecnologia MOOVZ" },
  { icon: HeartHandshake, label: "Atendimento personalizado" },
];

function SpaceCard({
  title,
  description,
  image,
  features,
  align,
}: SpaceCardProps) {
  return (
    <div
      className={`flex flex-col gap-8 md:flex-row md:items-center ${
        align === "right" ? "md:flex-row-reverse" : ""
      }`}
    >
      <Reveal className="w-full md:w-1/2" y={40}>
        <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-premium">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>
      </Reveal>

      <Reveal className="w-full md:w-1/2" delay={0.1}>
        <h3 className="font-display text-display-md font-medium text-ink">
          {title}
        </h3>
        <p className="mt-4 text-ink-muted">{description}</p>

        <ul className="mt-8 space-y-4">
          {features.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500 transition-transform duration-300 hover:scale-110">
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <span className="font-medium text-ink-soft">{label}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

export function Spaces() {
  return (
    <section id="ambientes" className="relative mx-auto max-w-6xl px-6">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-ghost text-ink/[0.04] sm:-top-16"
      >
        02
      </span>

      <Reveal className="relative mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-orange-500">
          Nossa estrutura
        </span>
        <h2 className="mt-4 font-display text-display-lg font-medium text-ink">
          Dois ambientes. Uma experiência completa.
        </h2>
        <p className="mt-4 text-ink-muted">
          Nossa estrutura conta com uma Sala de Treinamento Funcional,
          destinada às aulas em grupos reduzidos, e uma Sala de Musculação
          (Treino de Força), equipada com aparelhos e pesos livres — sempre
          com acompanhamento próximo dos professores.
        </p>
      </Reveal>

      <div className="relative mt-16 flex flex-col gap-24">
        <SpaceCard
          title="Sala de Treinamento Funcional"
          description="Espaço desenvolvido para aulas em grupos reduzidos, com equipamentos variados e metodologia voltada para um treinamento dinâmico, eficiente e acompanhado de perto pelos professores."
          image="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80"
          features={functionalFeatures}
          align="left"
        />

        <SpaceCard
          title="Sala de Musculação (Treino de Força)"
          description="Ambiente equipado com aparelhos e pesos livres para treinos de força, hipertrofia, condicionamento físico e melhoria da qualidade de vida, sempre com orientação profissional."
          image="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
          features={strengthFeatures}
          align="right"
        />
      </div>

      <StaggerGroup className="relative mt-20 grid grid-cols-2 gap-8 border-t border-ink/10 pt-12 sm:grid-cols-4">
        {extras.map(({ icon: Icon, label }) => (
          <StaggerItem
            key={label}
            className="flex flex-col items-center text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500 transition-transform duration-300 hover:scale-110">
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <span className="mt-3 text-sm font-medium text-ink-soft">
              {label}
            </span>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
