import { normalizePhone } from "@pulso-concept/forms";

/** Mask while typing: (11) 91234-5678 or (11) 3123-4567. */
export function formatPhoneInput(value: string): string {
  const digits = normalizePhone(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  const area = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${area}) ${rest}`;
  const split = rest.length === 9 ? 5 : 4;
  return `(${area}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}

/** Display format for a stored phone number (digits only, with or without the 55). */
export function formatPhoneDisplay(digits: string): string {
  const local = digits.length > 11 && digits.startsWith("55") ? digits.slice(2) : digits;
  return local.length >= 10 ? formatPhoneInput(local) : digits;
}

/** Number in wa.me format: with the 55 country code. */
export function toWhatsAppNumber(digits: string): string {
  return digits.length <= 11 ? `55${digits}` : digits;
}
