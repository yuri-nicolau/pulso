import type { LucideIcon } from "lucide-react";
import {
  HeartHandshake,
  Building2,
  Users,
  Target,
  HeartPulse,
  GraduationCap,
  LayoutGrid,
  Heart,
} from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";

interface Feature {
  icon: LucideIcon;
  title: string;
}

const FEATURES: Feature[] = [
  { icon: HeartHandshake, title: "Atendimento próximo" },
  { icon: Building2, title: "Ambiente moderno" },
  { icon: Users, title: "Grupos reduzidos" },
  { icon: Target, title: "Planejamento personalizado" },
  { icon: HeartPulse, title: "Tecnologia MOOVZ" },
  { icon: GraduationCap, title: "Professores qualificados" },
  { icon: LayoutGrid, title: "Estrutura completa" },
  { icon: Heart, title: "Comunidade acolhedora" },
];

export function Features() {
  return (
    <section id="diferenciais" className="relative mx-auto max-w-6xl px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-orange-500">
          Diferenciais
        </span>
        <h2 className="mt-4 font-display text-display-lg font-medium text-ink">
          O que você encontra aqui
        </h2>
      </Reveal>

      <StaggerGroup className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title }) => (
          <StaggerItem
            key={title}
            className="group flex flex-col items-center text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-glow">
              <Icon size={24} strokeWidth={1.75} />
            </span>
            <span className="mt-4 text-sm font-medium text-ink-soft">
              {title}
            </span>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
