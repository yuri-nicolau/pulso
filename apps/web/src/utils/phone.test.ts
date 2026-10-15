import { expect, test } from "bun:test";
import { formatPhoneDisplay, formatPhoneInput, toWhatsAppNumber } from "./phone";

test("masks mobile and landline numbers while typing", () => {
  expect(formatPhoneInput("1")).toBe("(1");
  expect(formatPhoneInput("119")).toBe("(11) 9");
  expect(formatPhoneInput("11912345678")).toBe("(11) 91234-5678");
  expect(formatPhoneInput("1131234567")).toBe("(11) 3123-4567");
  expect(formatPhoneInput("(11) 91234-56789")).toBe("(11) 91234-5678");
});

test("shows stored numbers with or without the country code", () => {
  expect(formatPhoneDisplay("11912345678")).toBe("(11) 91234-5678");
  expect(formatPhoneDisplay("5511912345678")).toBe("(11) 91234-5678");
});

test("adds the 55 country code for WhatsApp only when missing", () => {
  expect(toWhatsAppNumber("11912345678")).toBe("5511912345678");
  expect(toWhatsAppNumber("5511912345678")).toBe("5511912345678");
});
