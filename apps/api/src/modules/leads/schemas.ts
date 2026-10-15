import { LEAD_STATUSES, PAYMENT_STATUSES } from "@pulso-concept/db";
import { CLASS_TYPES, FREQUENCIES, INTERESTS, WEEKDAYS } from "@pulso-concept/forms";
import { t } from "elysia";
import { oneOf } from "../../lib/schema";

const contactFields = {
  name: t.String({ minLength: 2, maxLength: 120 }),
  email: t.String({ format: "email", maxLength: 200 }),
  phone: t.String({ minLength: 10, maxLength: 25 }),
};

export const contactLeadBody = t.Object({
  ...contactFields,
  interest: oneOf(INTERESTS),
  frequency: oneOf(FREQUENCIES),
  preferredTime: t.Nullable(t.String({ pattern: "^([01]\\d|2[0-3]):[0-5]\\d$" })),
  trainingType: oneOf(CLASS_TYPES),
});

export const trialClassLeadBody = t.Object({
  ...contactFields,
  weekdays: t.Array(oneOf(WEEKDAYS), { minItems: 1, maxItems: WEEKDAYS.length }),
  hours: t.Array(t.String({ pattern: "^([01]\\d|2[0-3]):00$" }), { minItems: 1, maxItems: 24 }),
});

export const leadParams = t.Object({ id: t.String({ format: "uuid" }) });

export const leadPatchBody = t.Object({
  status: t.Optional(oneOf(LEAD_STATUSES)),
  paymentStatus: t.Optional(oneOf(PAYMENT_STATUSES)),
  notes: t.Optional(t.String({ maxLength: 5000 })),
});
