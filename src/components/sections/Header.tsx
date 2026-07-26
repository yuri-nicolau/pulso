import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import marcaLaranja from "../../assets/optimized/marca-laranja.png";
import { getButtonClasses } from "../ui/Button";

const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#ambientes", label: "Ambientes" },
  { href: "#diferenciais", label: "Diferenciais" },
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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#hero" className="group flex items-center gap-2.5">
          <img
            src={marcaLaranja}
            alt=""
            className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[20deg]"
          />
          <span
            className={`font-display text-sm font-semibold uppercase tracking-[0.2em] transition-colors ${
              isSolid ? "text-ink" : "text-white"
            }`}
          >
            Pulso Concept
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`group relative text-sm font-medium transition-colors ${
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

        <a
          href="#contato"
          className={`hidden md:inline-flex ${getButtonClasses("primary", "md")}`}
        >
          Agende sua aula
        </a>

        <button
          type="button"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
          className={`md:hidden ${isSolid ? "text-ink" : "text-white"}`}
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
            className="overflow-hidden border-t border-ink/10 bg-white md:hidden"
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
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  document
                    .getElementById("contato")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`mt-2 ${getButtonClasses("primary", "md")}`}
              >
                Agende sua aula
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
