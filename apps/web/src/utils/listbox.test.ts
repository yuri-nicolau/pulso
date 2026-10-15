import { expect, test } from "bun:test";
import { findByTypeahead, nextListIndex } from "./listbox";

test("arrow keys move within bounds; Home/End jump to the ends", () => {
  expect(nextListIndex(0, "ArrowDown", 3)).toBe(1);
  expect(nextListIndex(2, "ArrowDown", 3)).toBe(2);
  expect(nextListIndex(1, "ArrowUp", 3)).toBe(0);
  expect(nextListIndex(0, "ArrowUp", 3)).toBe(0);
  expect(nextListIndex(-1, "ArrowDown", 3)).toBe(0);
  expect(nextListIndex(-1, "ArrowUp", 3)).toBe(2);
  expect(nextListIndex(1, "Home", 3)).toBe(0);
  expect(nextListIndex(1, "End", 3)).toBe(2);
  expect(nextListIndex(1, "Enter", 3)).toBeNull();
  expect(nextListIndex(0, "ArrowDown", 0)).toBeNull();
});

test("typeahead finds the next label by prefix, ignoring case and accents, wrapping", () => {
  const labels = [
    "Todos os status",
    "Novo",
    "Em contato",
    "Aula agendada",
    "Matriculado",
    "Não fechou",
  ];
  expect(findByTypeahead(labels, "n", 0)).toBe(1);
  expect(findByTypeahead(labels, "n", 1)).toBe(5);
  expect(findByTypeahead(labels, "nao", 0)).toBe(5);
  expect(findByTypeahead(labels, "n", 5)).toBe(1);
  expect(findByTypeahead(labels, "AU", 0)).toBe(3);
  expect(findByTypeahead(labels, "x", 0)).toBe(-1);
  expect(findByTypeahead(labels, "", 0)).toBe(-1);
});
