export interface ChipOption {
  value: string;
  label: string;
  /** Full label for screen readers when the visible one is abbreviated (e.g. "Seg"). */
  ariaLabel?: string;
}

interface ChipCheckboxGroupProps {
  options: ChipOption[];
  values: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  emptyMessage?: string;
  /** Container classes (e.g. a grid instead of the default flex-wrap). */
  className?: string;
}

/**
 * Multi-select pills for light cards: each chip toggles on and off. Place it inside a
 * `<fieldset>` whose `<legend>` names the group.
 */
export function ChipCheckboxGroup({
  options,
  values,
  onChange,
  disabled = false,
  emptyMessage = "Nenhuma opção disponível.",
  className = "flex flex-wrap gap-2",
}: ChipCheckboxGroupProps) {
  if (options.length === 0) {
    return <p className="text-sm text-ink-muted">{emptyMessage}</p>;
  }

  function toggle(value: string) {
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  return (
    <div className={className}>
      {options.map((option) => {
        const isSelected = values.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            aria-label={option.ariaLabel}
            disabled={disabled}
            onClick={() => toggle(option.value)}
            // Dark text on orange: white fails AA contrast there.
            className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30 disabled:pointer-events-none disabled:opacity-50 ${
              isSelected
                ? "border-orange-500 bg-orange-500 font-semibold text-ink shadow-glow"
                : "border-transparent bg-sand-100 text-ink hover:bg-sand-200"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
