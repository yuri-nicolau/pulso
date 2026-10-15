import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import logoExtensoClaro from "../assets/optimized/logo-extenso03.png";
import { BrandBackdrop } from "../features/trial-class/components/BrandBackdrop";
import { TrialClassForm } from "../features/trial-class/components/TrialClassForm";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/** /aula-experimental: standalone form page (direct link, e.g. Instagram bio). */
export function TrialClassPage() {
  useDocumentTitle("Aula experimental | Pulso Concept");

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-ink">
      <BrandBackdrop />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 pb-4 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <Link to="/" className="shrink-0" aria-label="Pulso Concept, ir para o site">
          <img
            src={logoExtensoClaro}
            alt="Pulso Concept"
            className="h-auto w-40 sm:h-6 sm:w-auto"
          />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Voltar ao site</span>
          <span className="sm:hidden">Site</span>
        </Link>
      </header>

      <main className="relative z-10 flex justify-center px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-4 sm:pt-8">
        <TrialClassForm />
      </main>
    </div>
  );
}
