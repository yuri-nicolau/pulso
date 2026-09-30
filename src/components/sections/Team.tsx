import professor01 from "../../assets/photos/professor-01.jpg";
import professor02 from "../../assets/photos/professor-02.jpg";
import professor03 from "../../assets/photos/professor-03.jpg";
import professor04 from "../../assets/photos/professor-04.jpg";
import { PulseOrb } from "../ui/PulseOrb";
import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";

interface TeamMember {
  name: string;
  role: string;
  photo: string;
}

// TODO: substituir pelos nomes reais dos professores.
const TEAM: TeamMember[] = [
  { name: "Professor 1", role: "Personal Trainer", photo: professor01 },
  { name: "Professor 2", role: "Personal Trainer", photo: professor02 },
  { name: "Professora 3", role: "Personal Trainer", photo: professor03 },
  { name: "Professora 4", role: "Personal Trainer", photo: professor04 },
];

export function Team() {
  return (
    <section id="equipe" className="relative mx-auto max-w-6xl px-6">
      <PulseOrb className="-left-32 top-1/3" size={420} />

      <Reveal className="relative mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-orange-500">
          Nossa equipe
        </span>
        <h2 className="mt-4 font-display text-display-lg font-medium text-ink">
          Quem acompanha a sua evolução
        </h2>
        <p className="mt-4 text-ink-muted">
          Profissionais qualificados que conhecem cada aluno pelo nome,
          corrigem de perto e ajustam o treino ao seu objetivo — do primeiro
          dia em diante.
        </p>
      </Reveal>

      <StaggerGroup className="relative mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {TEAM.map(({ name, role, photo }) => (
          <StaggerItem
            key={name}
            y={30}
            className="group relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-premium"
          >
            <img
              src={photo}
              alt={`${name}, ${role} da Pulso Concept`}
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <span className="mb-3 block h-1 w-8 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-14" />
              <h3 className="font-display text-lg font-medium text-white sm:text-xl">
                {name}
              </h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-white/70">
                {role}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
