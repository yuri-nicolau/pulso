import { Link } from "@tanstack/react-router";
import logoExtenso from "../assets/optimized/logo-extenso01.png";
import { getButtonClasses } from "../components/ui/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle("Página não encontrada | Pulso Concept");

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-sand-50 px-6 text-center">
      <img src={logoExtenso} alt="Pulso Concept" className="h-auto w-44" />
      <h1 className="font-display text-display-md font-medium text-ink">Página não encontrada</h1>
      <p className="max-w-sm text-ink-muted">O endereço que você acessou não existe ou mudou.</p>
      <Link to="/" className={getButtonClasses("outline", "md")}>
        Voltar ao site
      </Link>
    </main>
  );
}
