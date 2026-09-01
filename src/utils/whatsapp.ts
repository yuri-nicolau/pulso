// (11) 91338-9090, com DDI 55 — formato exigido pelo link wa.me (só dígitos).
const WHATSAPP_PHONE = "5511913389090";

export const WHATSAPP_DISPLAY_NUMBER = "(11) 91338-9090";

const DEFAULT_MESSAGE =
  "Olá! Vim pelo site da Pulso Concept e gostaria de mais informações.";

export function getWhatsAppUrl(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
