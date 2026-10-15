export interface PillOption {
  value: string;
  label: string;
  /** Tailwind class (e.g. "bg-orange-500") for a colored indicator before the label. */
  dotClassName?: string;
  /** Full label for screen readers when the visible one is abbreviated (e.g. "Seg"). */
  ariaLabel?: string;
}

/** "dark": on dark backgrounds (landing). "light": on white cards. */
type PillTone = "dark" | "light";

const TONE_STYLES: Record<
  PillTone,
  { selected: string; idle: string; empty: string; size: string }
> = {
  dark: {
    selected: "border-orange-500 bg-orange-500 text-white shadow-glow",
    idle: "border-white/15 bg-white/5 text-sand-100/80 hover:border-orange-500/60 hover:bg-white/10",
    empty: "text-sand-100/60",
    size: "px-4",
  },
  light: {
    // Dark text on orange: white doesn't pass AA contrast.
    selected: "border-orange-500 bg-orange-500 font-semibold text-ink shadow-glow",
    idle: "border-transparent bg-sand-100 text-ink hover:bg-sand-200",
    empty: "text-ink-muted",
    // Tighter: the light chips sit in three-column grids on mobile.
    size: "px-3",
  },
};

interface PillGroupProps {
  name: string;
  options: PillOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  emptyMessage?: string;
  tone?: PillTone;
  /** Container classes (e.g. a grid instead of the default flex-wrap). */
  className?: string;
}

export function PillGroup({
  name,
  options,
  value,
  onChange,
  disabled = false,
  emptyMessage = "Nenhuma opção disponível.",
  tone = "dark",
  className = "flex flex-wrap gap-2",
}: PillGroupProps) {
  const styles = TONE_STYLES[tone];

  if (options.length === 0) {
    return <p className={`text-sm ${styles.empty}`}>{emptyMessage}</p>;
  }

  return (
    <div role="radiogroup" aria-label={name} className={className}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          // biome-ignore lint/a11y/useSemanticElements: pill-styled radio; role + aria-checked keep it a radio for assistive tech.
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={option.ariaLabel}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30 disabled:opacity-50 disabled:pointer-events-none ${
              isSelected ? styles.selected : styles.idle
            } ${styles.size}`}
          >
            {option.dotClassName && (
              <span
                aria-hidden="true"
                className={`h-2 w-2 shrink-0 rounded-full ${option.dotClassName}`}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
