import { Star } from "lucide-react";
import depoimento01 from "../../assets/photos/depoimento-01.jpg";
import depoimento02 from "../../assets/photos/depoimento-02.jpg";
import { getButtonClasses } from "../ui/Button";
import { PulseOrb } from "../ui/PulseOrb";
import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";

interface Testimonial {
  name: string;
  quote: string;
  avatar: string;
}

const STAR_IDS = ["star-1", "star-2", "star-3", "star-4", "star-5"];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ana Carolina",
    quote:
      "Desde o primeiro dia fazendo parte da história da Pulso. 💚 Resultados, amizades e muitos momentos vividos juntos. 💪",
    avatar: depoimento01,
  },
  {
    name: "Lariana",
    quote:
      "Há quase dez anos, a Pulso me mostra que sempre existe um próximo nível. Com inovação, novos desafios e metodologias em constante evolução, descobri que, quando acho que cheguei à minha melhor versão, ainda posso ir além.",
    avatar: depoimento02,
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="relative mx-auto max-w-6xl px-6">
      <PulseOrb className="-right-32 top-0" size={420} />

      <Reveal className="relative mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-orange-500">
          Comunidade
        </span>
        <h2 className="mt-4 font-display text-display-lg font-medium text-ink">
          Faça parte da comunidade Pulso Concept
        </h2>
        <p className="mt-4 text-ink-muted">
          Mais do que um lugar para treinar, a Pulso Concept é um espaço onde
          pessoas compartilham objetivos, constroem hábitos saudáveis e
          evoluem juntas. Aqui, cada aluno é acompanhado de perto e faz parte
          de uma comunidade que acredita que movimento é qualidade de vida.
        </p>
      </Reveal>

      <StaggerGroup className="relative mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        {TESTIMONIALS.map(({ name, quote, avatar }) => (
          <StaggerItem
            key={name}
            y={30}
            className="group flex flex-col items-center rounded-3xl bg-sand-50 px-8 py-10 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-premium"
          >
            <img
              src={avatar}
              alt={name}
              className="h-16 w-16 rounded-full object-cover ring-4 ring-white"
              loading="lazy"
            />
            <div className="mt-4 flex gap-1 text-orange-500">
              {STAR_IDS.map((id) => (
                <Star key={id} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="mt-4 text-sm leading-relaxed text-ink-soft">
              “{quote}”
            </blockquote>
            <figcaption className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
              {name}
            </figcaption>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal delay={0.15} className="relative mt-14 flex justify-center">
        <a href="#contato" className={getButtonClasses("outline", "lg")}>
          Quero conhecer a Pulso Concept
        </a>
      </Reveal>
    </section>
  );
}
