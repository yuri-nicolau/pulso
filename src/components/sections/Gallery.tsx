import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";

interface GalleryPhoto {
  image: string;
  label: string;
  className?: string;
}

const PHOTOS: GalleryPhoto[] = [
  {
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80",
    label: "Recepção",
    className: "sm:col-span-2 sm:row-span-2",
  },
  {
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=80",
    label: "Sala funcional",
  },
  {
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80",
    label: "Sala de musculação",
  },
  {
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&q=80",
    label: "Tecnologia MOOVZ",
  },
  {
    image:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=700&q=80",
    label: "Professores",
  },
  {
    image:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=80",
    label: "Alunos em treino",
    className: "sm:col-span-2",
  },
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
        className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
      >
        {PHOTOS.map(({ image, label, className = "" }) => (
          <StaggerItem
            key={label}
            className={`group relative aspect-square overflow-hidden rounded-2xl ${className}`}
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
