import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import logoExtensoClaro from "../../assets/optimized/logo-extenso03.png";
import logoExtensoEscuro from "../../assets/optimized/logo-extenso01.png";
import { getWhatsAppUrl } from "../../utils/whatsapp";
import { getButtonClasses } from "../ui/Button";

const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#ambientes", label: "Ambientes" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#equipe", label: "Equipe" },
  { href: "#galeria", label: "Galeria" },
  { href: "#depoimentos", label: "Depoimentos" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isSolid = isScrolled || isMenuOpen;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isSolid ? "bg-white/85 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        {/* Mesma logo do footer. Sobre o hero escuro usamos a versão com
            "CONCEPT" em branco; quando o header fica sólido, a versão
            escura aparece por cima com fade, acompanhando a transição de
            fundo sem piscar na troca de src. */}
        <a href="#hero" className="relative block shrink-0">
          <img
            src={logoExtensoClaro}
            alt="Pulso Concept"
            className="h-auto w-44 sm:h-6 sm:w-auto"
          />
          <img
            src={logoExtensoEscuro}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
              isSolid ? "opacity-100" : "opacity-0"
            }`}
          />
        </a>

        {/* Os links de navegação só voltam em xl+ — abaixo disso eles ficam
            dentro do menu hambúrguer, dando lugar aos dois botões de ação
            (WhatsApp + Contato), que são a prioridade de conversão. A logo
            extensa + 6 links + os dois botões não cabem juntos em lg. */}
        <nav className="hidden items-center gap-6 xl:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`group relative whitespace-nowrap text-sm font-medium transition-colors ${
                isSolid
                  ? "text-ink-muted hover:text-ink"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conversar no WhatsApp com a Pulso Concept"
            className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${
              isSolid
                ? "border-ink/15 text-ink hover:border-orange-500 hover:text-orange-600"
                : "border-white/30 text-white hover:border-white hover:bg-white/10"
            }`}
          >
            <MessageCircle size={18} strokeWidth={1.75} />
            {/* Rótulo só em lg; em xl os links ocupam o espaço e fica só o ícone. */}
            <span className="hidden lg:inline xl:hidden">WhatsApp</span>
          </a>

          <a
            href="#contato"
            className={`shrink-0 whitespace-nowrap ${getButtonClasses("primary", "md")}`}
          >
            Entrar em contato
          </a>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
          className={`shrink-0 xl:hidden ${isSolid ? "text-ink" : "text-white"}`}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-ink/10 bg-white xl:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-2 py-3 text-sm font-medium text-ink-muted hover:bg-sand-100 hover:text-orange-600"
                >
                  {link.label}
                </a>
              ))}

              {/* Em telas médias os botões de ação já ficam fixos no
                  header — aqui dentro eles só aparecem no mobile puro,
                  evitando duplicar o mesmo CTA duas vezes na tela. */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  document
                    .getElementById("contato")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`mt-2 md:hidden ${getButtonClasses("primary", "md")}`}
              >
                Entrar em contato
              </button>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className={`md:hidden ${getButtonClasses("outline", "md")}`}
              >
                <MessageCircle size={18} strokeWidth={1.75} />
                Falar no WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
