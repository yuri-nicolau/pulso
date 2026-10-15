import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Accent color based on the Pulso logo — CTAs, icons and details
        orange: {
          50: "#fff4ed",
          100: "#ffe6d5",
          200: "#ffc9aa",
          300: "#ffa374",
          400: "#ff7a3c",
          500: "#f9581a", // main orange
          600: "#ea3d0f",
          700: "#c22b0d",
          800: "#9a2412",
          900: "#7c2012",
        },
        // Neutral tones for secondary backgrounds and breathing room
        sand: {
          50: "#fbfaf8",
          100: "#f5f2ed",
          200: "#ece6dc",
          300: "#ddd3c3",
          400: "#c2b39a",
        },
        // Magenta from the brand art (logo-meta): pairs with orange on backgrounds and graphics,
        // never as a text color on light backgrounds.
        magenta: {
          300: "#f57ab5",
          400: "#f0479a",
          500: "#e2187a",
          600: "#c01065",
          700: "#930c4f",
          900: "#3d0620",
        },
        ink: {
          DEFAULT: "#141414",
          soft: "#2b2b2b",
          muted: "#5c5c5c",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["'Fraunces'", "'Georgia'", "serif"],
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
        ghost: ["clamp(5rem, 10vw, 10rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
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
        // Color blobs for the trial class page background.
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(6%, -4%, 0) scale(1.08)" },
        },
        // Waves coming out of the Pulso circle, like a heartbeat.
        "pulse-ring": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "15%": { opacity: "0.55" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        drift: "drift 18s ease-in-out infinite",
        "drift-reverse": "drift 22s ease-in-out infinite reverse",
        "pulse-ring": "pulse-ring 4.5s cubic-bezier(0.16, 1, 0.3, 1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
