const SERVICES = [
  "Musculação",
  "Treinamento Funcional",
  "HIIT",
  "Pilates Funcional",
  "Funcional Teen",
  "Funcional Kids",
  "Avaliação Física",
  "Tecnologia MOOVZ",
];

function ServiceRow() {
  return (
    <div className="flex shrink-0 items-center gap-6 pr-6">
      {SERVICES.map((service) => (
        <span key={service} className="flex items-center gap-6">
          <span className="font-display text-2xl italic text-white/90 sm:text-3xl">
            {service}
          </span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
        </span>
      ))}
    </div>
  );
}

export function ServicesMarquee() {
  return (
    <section
      aria-label="Modalidades oferecidas"
      className="overflow-hidden bg-ink py-8"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        <ServiceRow />
        <ServiceRow />
      </div>
    </section>
  );
}
