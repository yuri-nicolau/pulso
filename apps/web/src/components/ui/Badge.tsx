import type { ReactNode } from "react";

export type BadgeTone = "orange" | "sky" | "violet" | "emerald" | "amber" | "neutral" | "ink";

// Dark text on a soft background in every tone (AA contrast).
const TONES: Record<BadgeTone, string> = {
  orange: "bg-orange-100 text-orange-900",
  sky: "bg-sky-100 text-sky-900",
  violet: "bg-violet-100 text-violet-900",
  emerald: "bg-emerald-100 text-emerald-900",
  amber: "bg-amber-100 text-amber-900",
  neutral: "bg-sand-200 text-ink-soft",
  ink: "bg-ink text-white",
};

const DOTS: Record<BadgeTone, string> = {
  orange: "bg-orange-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  neutral: "bg-ink-muted",
  ink: "bg-orange-500",
};

interface BadgeProps {
  tone: BadgeTone;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone, children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${DOTS[tone]}`} />
      {children}
    </span>
  );
}
