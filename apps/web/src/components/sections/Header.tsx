import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import logoExtensoEscuro from "../../assets/optimized/logo-extenso01.png";
import logoExtensoClaro from "../../assets/optimized/logo-extenso03.png";
import { getWhatsAppUrl } from "../../utils/whatsapp";
import { getButtonClasses } from "../ui/Button";
import { useOverlay } from "../ui/useOverlay";

const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#ambientes", label: "Ambientes" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#equipe", label: "Equipe" },
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
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  // Escape closes, focus moves into the menu (and back to the toggle), the page doesn't scroll.
  useOverlay(isMenuOpen, closeMenu, menuRef);

  return (
    <>
      {/* Dims the page behind the open menu; a tap on it closes the menu. */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-ink/40 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          isMenuOpen
            ? "bg-white shadow-sm"
            : isSolid
              ? "bg-white/85 backdrop-blur-md shadow-sm"
              : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          {/* Same logo as the footer. Over the dark hero we use the version with
            "CONCEPT" in white; when the header turns solid, the dark
            version fades in on top, following the background transition
            without flickering on a src swap. */}
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

          {/* Nav links only come back at xl+ — below that they live inside
            the hamburger menu, making room for the two action buttons
            (WhatsApp + Contact), which are the conversion priority. The wide
            logo + 6 links + both buttons don't fit together at lg. */}
          <nav className="hidden items-center gap-6 xl:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`group relative whitespace-nowrap text-sm font-medium transition-colors ${
                  isSolid ? "text-ink-muted hover:text-ink" : "text-white/90 hover:text-white"
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
              {/* Label only at lg; at xl the links take the space and only the icon stays. */}
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
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobile"
            onClick={() => setIsMenuOpen((open) => !open)}
            className={`-mr-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 xl:hidden ${
              isSolid ? "text-ink hover:bg-sand-100" : "text-white hover:bg-white/10"
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              id="menu-mobile"
              tabIndex={-1}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-ink/10 bg-white outline-none xl:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-sand-100 focus:outline-none focus-visible:bg-sand-100 focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    {link.label}
                  </a>
                ))}

                {/* On medium screens the action buttons are already pinned in
                  the header — in here they only show on pure mobile,
                  avoiding the same CTA appearing twice on screen. */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
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
    </>
  );
}
