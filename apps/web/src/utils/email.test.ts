import { expect, test } from "bun:test";
import { formatEmailInput } from "./email";

test("lowercases, strips accents and drops characters an email can't have", () => {
  expect(formatEmailInput(" Maria Silva@Exemplo.COM ")).toBe("mariasilva@exemplo.com");
  expect(formatEmailInput("joão(teste)@mail.com")).toBe("joaoteste@mail.com");
});

test("keeps a single @ and no local-part symbols in the domain", () => {
  expect(formatEmailInput("a@b@c.com")).toBe("a@bc.com");
  expect(formatEmailInput("a+tag@do_main.com")).toBe("a+tag@domain.com");
});

test("keeps partial input while typing", () => {
  expect(formatEmailInput("maria@")).toBe("maria@");
  expect(formatEmailInput("maria.")).toBe("maria.");
});
