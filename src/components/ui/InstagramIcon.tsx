// O lucide-react 1.x removeu os ícones de marca, então desenhamos o glifo do
// Instagram no mesmo estilo de traço dos ícones Lucide usados no projeto.
interface InstagramIconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function InstagramIcon({
  size = 24,
  strokeWidth = 1.75,
  className = "",
}: InstagramIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
