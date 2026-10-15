import marcaBranco from "../../assets/optimized/marca-branco.png";
import marcaLaranja from "../../assets/optimized/marca-laranja.png";

interface PulseOrbProps {
  className?: string;
  size?: number;
  variant?: "laranja" | "branco";
  opacity?: number;
}

const VARIANTS = {
  laranja: marcaLaranja,
  branco: marcaBranco,
};

/** Subtle graphic referencing the Pulso logo symbol on section backgrounds. */
export function PulseOrb({
  className = "",
  size = 480,
  variant = "laranja",
  opacity = 0.06,
}: PulseOrbProps) {
  return (
    <img
      src={VARIANTS[variant]}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute select-none blur-[1px] ${className}`}
      style={{ width: size, height: size, opacity }}
    />
  );
}
