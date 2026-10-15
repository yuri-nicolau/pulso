import logoExtenso from "../../assets/optimized/logo-extenso01.png";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "../../utils/instagram";
import { InstagramIcon } from "../ui/InstagramIcon";

const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#ambientes", label: "Ambientes" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#equipe", label: "Equipe" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#contato", label: "Contato" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-sand-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-14 text-center sm:flex-row sm:justify-between sm:text-left">
        <a href="#hero" className="shrink-0">
          {/* Very wide logo (900x74) — below sm it doesn't fit the full width
              with a fixed h-9, and Tailwind preflight's max-width:100%
              squeezes only the width, distorting the image. So we lock
              the width (with auto height) on mobile and only go back to
              the original size from sm up, where there's room to
              spare. */}
          <img src={logoExtenso} alt="Pulso Concept" className="h-auto w-44 sm:h-9 sm:w-auto" />
        </a>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
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

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram da Pulso Concept (@${INSTAGRAM_HANDLE})`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:-rotate-12 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
          >
            <InstagramIcon size={18} />
          </a>
        </div>
      </div>

      <div className="border-t border-ink/10 px-6 py-6 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} Pulso Concept. Todos os direitos reservados.
      </div>
    </footer>
  );
}
