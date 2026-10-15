import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 will-change-transform hover:scale-[1.03] active:scale-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-orange-500 text-white shadow-glow hover:bg-orange-600 hover:shadow-[0_10px_36px_-6px_rgba(249,88,26,0.6)]",
  outline:
    "border border-ink/20 text-ink bg-transparent hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50/50",
  ghost: "bg-transparent text-ink hover:bg-sand-100",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function getButtonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) {
  return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={getButtonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
