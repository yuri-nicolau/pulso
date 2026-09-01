import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import marcaBranco from "../../assets/optimized/marca-branco.png";
import { getButtonClasses } from "../ui/Button";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-ink"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          y: imageY,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-transparent" />

      <img
        src={marcaBranco}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 w-[26rem] rotate-12 select-none opacity-[0.07] sm:-right-16 sm:w-[36rem]"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-4xl px-6 pt-24 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="inline-block rounded-full border border-orange-400/40 bg-orange-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-orange-300 backdrop-blur-sm"
        >
          Studio Premium de Treinamento
        </motion.span>

        <h1 className="mt-6 font-display text-hero font-medium text-white">
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
            className="block"
          >
            Treine com propósito.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: easeOut }}
            className="block italic text-orange-400"
          >
            Evolua com constância.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: easeOut }}
          className="mx-auto mt-6 max-w-2xl text-base text-sand-100/90 sm:text-lg"
        >
          Um Studio premium onde saúde, força e performance se encontram em
          uma experiência personalizada.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.52, ease: easeOut }}
          className="mt-10 flex justify-center"
        >
          <a href="#contato" className={getButtonClasses("primary", "lg")}>
            Quero ser contatado
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#sobre"
        aria-label="Rolar para a próxima seção"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70 transition-colors hover:text-orange-400"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={28} strokeWidth={1.5} />
      </motion.a>
    </section>
  );
}
