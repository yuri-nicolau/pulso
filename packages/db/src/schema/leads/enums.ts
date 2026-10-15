import { FORM_KEYS } from "@pulso-concept/forms";
import { pgEnum } from "drizzle-orm/pg-core";

export const leadForm = pgEnum("lead_form", FORM_KEYS);

// The follow-up pipeline of a form response, in order.
export const LEAD_STATUSES = ["new", "contacted", "trial_scheduled", "enrolled", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export const leadStatus = pgEnum("lead_status", LEAD_STATUSES);

export const PAYMENT_STATUSES = ["pending", "paid"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export const paymentStatus = pgEnum("payment_status", PAYMENT_STATUSES);
