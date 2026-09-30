import espaco01 from "../../assets/photos/espaco-01.jpg";
import espaco02 from "../../assets/photos/espaco-02.jpg";
import espaco03 from "../../assets/photos/espaco-03.jpg";
import espaco04 from "../../assets/photos/espaco-04.jpg";
import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";

interface GalleryPhoto {
  image: string;
  label: string;
  className: string;
}

// Mosaico: fotos horizontais ocupam 2 colunas, verticais ocupam 2 linhas.
// Em 4 colunas forma o bloco [H H V V] / [H H V V]; em 2 colunas empilha
// H / V V / H — sem buracos em nenhum breakpoint.
const PHOTOS: GalleryPhoto[] = [
  { image: espaco01, label: "Nosso espaço", className: "col-span-2" },
  { image: espaco03, label: "Sala de musculação", className: "row-span-2" },
  { image: espaco04, label: "Estrutura completa", className: "row-span-2" },
  { image: espaco02, label: "Sala funcional", className: "col-span-2" },
];

export function Gallery() {
  return (
    <section id="galeria" className="relative mx-auto max-w-6xl px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-orange-500">
          Conheça o espaço
        </span>
        <h2 className="mt-4 font-display text-display-lg font-medium text-ink">
          Fotos do ambiente
        </h2>
      </Reveal>

      <StaggerGroup
        stagger={0.06}
        className="mt-16 grid auto-rows-[10rem] grid-cols-2 gap-4 sm:auto-rows-[14rem] sm:grid-cols-4 sm:gap-6 lg:auto-rows-[16rem]"
      >
        {PHOTOS.map(({ image, label, className }) => (
          <StaggerItem
            key={label}
            className={`group relative overflow-hidden rounded-2xl ${className}`}
          >
            <img
              src={image}
              alt={label}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="absolute bottom-4 left-4 translate-y-2 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {label}
            </span>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
