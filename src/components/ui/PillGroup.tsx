export interface PillOption {
  value: string;
  label: string;
  /** Classe Tailwind (ex.: "bg-orange-500") para um indicador colorido antes do label. */
  dotClassName?: string;
}

interface PillGroupProps {
  name: string;
  options: PillOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  emptyMessage?: string;
}

export function PillGroup({
  name,
  options,
  value,
  onChange,
  disabled = false,
  emptyMessage = "Nenhuma opção disponível.",
}: PillGroupProps) {
  if (options.length === 0) {
    return <p className="text-sm text-sand-100/60">{emptyMessage}</p>;
  }

  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30 disabled:opacity-50 disabled:pointer-events-none ${
              isSelected
                ? "border-orange-500 bg-orange-500 text-white shadow-glow"
                : "border-white/15 bg-white/5 text-sand-100/80 hover:border-orange-500/60 hover:bg-white/10"
            }`}
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
