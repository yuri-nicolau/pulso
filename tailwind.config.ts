import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cor de destaque baseada no logo Pulso — CTAs, ícones e detalhes
        orange: {
          50: "#fff4ed",
          100: "#ffe6d5",
          200: "#ffc9aa",
          300: "#ffa374",
          400: "#ff7a3c",
          500: "#f9581a", // laranja principal
          600: "#ea3d0f",
          700: "#c22b0d",
          800: "#9a2412",
          900: "#7c2012",
        },
        // Tons neutros para fundos secundários e respiro
        sand: {
          50: "#fbfaf8",
          100: "#f5f2ed",
          200: "#ece6dc",
          300: "#ddd3c3",
          400: "#c2b39a",
        },
        ink: {
          DEFAULT: "#141414",
          soft: "#2b2b2b",
          muted: "#5c5c5c",
        },
      },
      fontFamily: {
        sans: [
          "'Inter'",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "'Fraunces'",
          "'Georgia'",
          "serif",
        ],
      },
      fontSize: {
        hero: [
          "clamp(2.75rem, 5vw + 1.5rem, 5.75rem)",
          { lineHeight: "1.04", letterSpacing: "-0.025em" },
        ],
        "display-lg": [
          "clamp(2.25rem, 3vw + 1.25rem, 3.5rem)",
          { lineHeight: "1.08", letterSpacing: "-0.02em" },
        ],
        "display-md": [
          "clamp(1.75rem, 1.5vw + 1.25rem, 2.5rem)",
          { lineHeight: "1.15", letterSpacing: "-0.015em" },
        ],
        ghost: [
          "clamp(5rem, 10vw, 10rem)",
          { lineHeight: "1", letterSpacing: "-0.03em" },
        ],
      },
      borderRadius: {
        full: "9999px",
      },
      boxShadow: {
        premium: "0 30px 60px -20px rgba(20, 20, 20, 0.25)",
        glow: "0 8px 30px -6px rgba(249, 88, 26, 0.45)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
