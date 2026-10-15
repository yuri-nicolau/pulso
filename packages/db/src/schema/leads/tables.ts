import type { LeadAnswers } from "@pulso-concept/forms";
import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { leadForm, leadStatus, paymentStatus } from "./enums";

// One response to any public form. Contact fields are columns (searched and shown in the list);
// what each form asks on top of them lives in `answers`, typed per form in @pulso-concept/forms.
// RLS on with no policies: Supabase's Data API (anon/authenticated keys) can't read or write it;
// only the API, connected as the database owner, can.
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    form: leadForm("form").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    // Digits only, with or without the 55 country code.
    phone: text("phone").notNull(),
    answers: jsonb("answers").$type<LeadAnswers>().notNull(),
    status: leadStatus("status").notNull().default("new"),
    paymentStatus: paymentStatus("payment_status").notNull().default("pending"),
    notes: text("notes").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("leads_created_at_idx").on(table.createdAt.desc()),
    index("leads_form_idx").on(table.form),
    index("leads_status_idx").on(table.status),
  ],
).enableRLS();

export type Lead = typeof leads.$inferSelect;
