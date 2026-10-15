import { type InputHTMLAttributes, useId } from "react";

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  error?: string;
  hint?: string;
}

/** Text field with a visible label, for light cards. */
export function TextField({ label, error, hint, className = "", ...rest }: TextFieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full rounded-2xl border bg-sand-100 px-4 py-3 text-base text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/80 focus:bg-white focus:ring-4 disabled:opacity-60 ${
          error
            ? "border-red-600 focus:ring-red-600/15"
            : "border-transparent focus:border-orange-500 focus:ring-orange-500/15"
        }`}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
