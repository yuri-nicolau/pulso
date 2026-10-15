// (11) 91338-9090, with the 55 country code — the format wa.me links require (digits only).
const WHATSAPP_PHONE = "5511913389090";

export const WHATSAPP_DISPLAY_NUMBER = "(11) 91338-9090";

const DEFAULT_MESSAGE = "Olá! Vim pelo site da Pulso Concept e gostaria de mais informações.";

export function getWhatsAppUrl(message: string = DEFAULT_MESSAGE, phone = WHATSAPP_PHONE): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
