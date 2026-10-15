import marcaBranco from "../../../assets/optimized/marca-branco.png";
import marcaLaranja from "../../../assets/optimized/marca-laranja.png";

const MARQUEE_TEXT = "Pulso Concept • Aula experimental • Saúde • Força • Performance • ";

// Waves coming out of the Pulso circle; staggered delays form a continuous heartbeat.
const RING_DELAYS = ["[animation-delay:0s]", "[animation-delay:1.5s]", "[animation-delay:3s]"];

/**
 * Trial class page background: black with the brand art's magenta and orange mesh,
 * slow-moving color blobs, grain, halftone, the Pulso symbol at giant scale with
 * pulsing waves and an outlined marquee running diagonally.
 * Purely decorative (aria-hidden); animations respect "reduce motion".
 */
export function BrandBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-brand-mesh" />

      <div className="absolute -left-[20%] top-[10%] h-[60vmax] w-[60vmax] rounded-full bg-magenta-500/40 blur-3xl motion-safe:animate-drift" />
      <div className="absolute -right-[25%] bottom-[-20%] h-[55vmax] w-[55vmax] rounded-full bg-orange-500/40 blur-3xl motion-safe:animate-drift-reverse" />

      {/* Giant symbol with the "pulse" waves coming out of it. */}
      <div className="absolute -bottom-[18vmax] -left-[14vmax] h-[62vmax] w-[62vmax]">
        {RING_DELAYS.map((delay) => (
          <span
            key={delay}
            className={`absolute inset-0 rounded-full border border-white/25 opacity-0 motion-safe:animate-pulse-ring ${delay}`}
          />
        ))}
        <img
          src={marcaBranco}
          alt=""
          className="absolute inset-[18%] h-[64%] w-[64%] -rotate-12 select-none opacity-[0.09]"
        />
      </div>

      <img
        src={marcaLaranja}
        alt=""
        className="absolute -right-[6vmax] -top-[8vmax] w-[34vmax] rotate-[24deg] select-none opacity-30 mix-blend-screen"
      />

      <div className="absolute inset-0 bg-halftone opacity-60" />

      {/* Diagonal outlined marquee. */}
      <div className="absolute left-[-10%] top-[62%] w-[120%] -rotate-[8deg] overflow-hidden sm:top-[70%]">
        <div className="flex w-max motion-safe:animate-marquee-slow">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              className="text-outline whitespace-nowrap pr-8 font-display text-ghost font-medium uppercase italic"
            >
              {MARQUEE_TEXT.repeat(2)}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-grain opacity-[0.18] mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/60" />
    </div>
  );
}
