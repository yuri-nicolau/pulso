/** Where the highlight moves in a list of `length` options for a navigation key (null = not one). */
export function nextListIndex(current: number, key: string, length: number): number | null {
  if (length === 0) return null;
  switch (key) {
    case "ArrowDown":
      return current < 0 ? 0 : Math.min(current + 1, length - 1);
    case "ArrowUp":
      return current < 0 ? length - 1 : Math.max(current - 1, 0);
    case "Home":
    case "PageUp":
      return 0;
    case "End":
    case "PageDown":
      return length - 1;
    default:
      return null;
  }
}

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/**
 * Type-to-jump: the next option (after `current`, wrapping around) whose label starts with
 * `query`, ignoring case and accents; -1 when none does.
 */
export function findByTypeahead(labels: readonly string[], query: string, current: number): number {
  const prefix = fold(query);
  if (!prefix) return -1;
  for (let step = 1; step <= labels.length; step++) {
    const index = (current + step + labels.length) % labels.length;
    if (fold(labels[index] ?? "").startsWith(prefix)) return index;
  }
  return -1;
}
