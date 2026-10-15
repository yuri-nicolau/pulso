/**
 * Mask while typing: lowercase, accents reduced to their base letter, no spaces or characters an
 * email can't have, a single "@".
 * Validity itself (domain, extension) is checked with `isValidEmail` from @pulso-concept/forms.
 */
export function formatEmailInput(value: string): string {
  const cleaned = value
    .normalize("NFD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replaceAll(/[^a-z0-9._%+\-@]/g, "");
  const at = cleaned.indexOf("@");
  if (at === -1) return cleaned.slice(0, 200);
  const domain = cleaned
    .slice(at + 1)
    .replaceAll("@", "")
    .replaceAll(/[_%+]/g, "");
  return `${cleaned.slice(0, at + 1)}${domain}`.slice(0, 200);
}
