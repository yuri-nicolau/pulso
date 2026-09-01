import logoExtenso from "../../assets/optimized/logo-extenso01.png";

const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#ambientes", label: "Ambientes" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#galeria", label: "Galeria" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#contato", label: "Contato" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-sand-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-14 text-center sm:flex-row sm:justify-between sm:text-left">
        <a href="#hero" className="shrink-0">
          {/* Logo bem larga (900x74) — abaixo de sm não cabe na largura
              inteira com h-9 fixo, e o max-width:100% do preflight do
              Tailwind espreme só a largura, distorcendo a imagem. Por isso
              travamos a largura (com altura automática) no mobile e só
              voltamos ao tamanho original a partir de sm, onde já sobra
              espaço. */}
          <img
            src={logoExtenso}
            alt="Pulso Concept"
            className="h-auto w-44 sm:h-9 sm:w-auto"
          />
        </a>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-end">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-orange-600"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t border-ink/10 px-6 py-6 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} Pulso Concept. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
