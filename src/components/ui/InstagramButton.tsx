import { ArrowUpRight } from "lucide-react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "../../utils/instagram";
import { InstagramIcon } from "./InstagramIcon";

interface InstagramButtonProps {
  className?: string;
}

// Pílula com o círculo laranja do Pulso à esquerda (referência ao logo) e o
// @ em destaque — no hover o círculo gira levemente e a seta "escapa".
export function InstagramButton({ className = "" }: InstagramButtonProps) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Seguir a Pulso Concept no Instagram (@${INSTAGRAM_HANDLE})`}
      className={`group inline-flex items-center gap-4 rounded-full border border-ink/10 bg-white py-2 pl-2 pr-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/40 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${className}`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-105">
        <InstagramIcon size={22} />
      </span>

      <span className="flex flex-col text-left">
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-ink-muted">
          Siga no Instagram
        </span>
        <span className="font-display text-lg font-medium leading-tight text-ink transition-colors group-hover:text-orange-600">
          @{INSTAGRAM_HANDLE}
        </span>
      </span>

      <ArrowUpRight
        size={20}
        strokeWidth={1.75}
        className="text-ink-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-600"
      />
    </a>
  );
}
