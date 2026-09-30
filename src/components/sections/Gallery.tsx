import galeria01 from "../../assets/photos/galeria-01.jpg";
import galeria02 from "../../assets/photos/galeria-02.jpg";
import galeria03 from "../../assets/photos/galeria-03.jpg";
import galeria04 from "../../assets/photos/galeria-04.jpg";
import galeria05 from "../../assets/photos/galeria-05.jpg";
import galeria06 from "../../assets/photos/galeria-06.jpg";
import { PulseOrb } from "../ui/PulseOrb";
import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";

interface GalleryPhoto {
  src: string;
  alt: string;
  // Fotos "destaque" ocupam 2x2 no grid desktop e a linha inteira no mobile;
  // as demais são verticais (1 coluna x 2 linhas no desktop).
  featured?: boolean;
  objectPosition?: string;
}

// Ordem pensada para o bento grid: cada bloco de 2 linhas no desktop tem
// um destaque horizontal + duas fotos verticais, alternando o lado.
const PHOTOS: GalleryPhoto[] = [
  {
    src: galeria04,
    alt: "Turma treinando com kettlebells na sala funcional",
    featured: true,
  },
  {
    src: galeria01,
    alt: "Aluno fazendo flexão no tapete durante a aula",
    objectPosition: "object-[center_70%]",
  },
  {
    src: galeria02,
    alt: "Aluna arremessando a medicine ball na parede de tijolos",
  },
  {
    src: galeria05,
    alt: "Grupo de alunas sorrindo após o treino",
  },
  {
    src: galeria06,
    alt: "Alunas reunidas em frente à parede de tijolos do Studio",
  },
  {
    src: galeria03,
    alt: "Aluno agachando com a medicine ball antes do arremesso",
    featured: true,
    objectPosition: "object-[center_30%]",
  },
];

export function Gallery() {
  return (
    <section id="galeria" className="relative mx-auto max-w-6xl px-6">
      <PulseOrb className="-right-32 top-1/4" size={420} />

      <Reveal className="relative mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-orange-500">
          Galeria
        </span>
        <h2 className="mt-4 font-display text-display-lg font-medium text-ink">
          A energia de quem treina junto
        </h2>
        <p className="mt-4 text-ink-muted">
          Um pouco do dia a dia no Studio: turmas pequenas, muito suor e
          aquela vontade de voltar amanhã.
        </p>
      </Reveal>

      <StaggerGroup className="relative mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:auto-rows-[170px] xl:auto-rows-[190px]">
        {PHOTOS.map(({ src, alt, featured, objectPosition = "object-center" }) => (
          <StaggerItem
            key={src}
            y={30}
            className={`group relative overflow-hidden rounded-[1.5rem] shadow-premium lg:aspect-auto lg:rounded-[2rem] ${
              featured
                ? "col-span-2 aspect-[4/3] lg:row-span-2"
                : "aspect-[3/4] lg:row-span-2"
            }`}
          >
            <img
              src={src}
              alt={alt}
              className={`h-full w-full object-cover ${objectPosition} transition-transform duration-700 ease-out group-hover:scale-105`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
