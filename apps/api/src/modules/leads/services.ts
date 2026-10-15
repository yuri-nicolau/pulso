import {
  type Database,
  type Lead,
  type LeadStatus,
  leads,
  type PaymentStatus,
} from "@pulso-concept/db";
import {
  type ContactAnswers,
  type FormKey,
  isTrialClassHourAvailable,
  isValidPhone,
  type LeadAnswers,
  normalizePhone,
  type TrialClassAnswers,
} from "@pulso-concept/forms";
import { desc, eq } from "drizzle-orm";
import type { AttemptLimiter } from "../../lib/attempts";
import { DomainError } from "../../lib/errors";

// Public submissions allowed per address in the window (spam guard; a family sharing one
// connection still fits).
export const SUBMISSION_MAX_PER_WINDOW = 10;
export const SUBMISSION_WINDOW_MS = 60 * 60 * 1000;

// The admin list returns everything at once (a studio's volume), newest first, up to this cap.
export const LEAD_LIST_LIMIT = 2000;

export class LeadNotFoundError extends DomainError {
  readonly code = "LEAD_NOT_FOUND";
  readonly status = 404;

  constructor() {
    super("Form response not found");
  }
}

export class InvalidLeadError extends DomainError {
  readonly code = "INVALID_LEAD";
  readonly status = 422;
}

export class TooManySubmissionsError extends DomainError {
  readonly code = "TOO_MANY_SUBMISSIONS";
  readonly status = 429;

  constructor() {
    super("Too many submissions, try again later");
  }
}

export interface ContactFields {
  name: string;
  email: string;
  phone: string;
}

export type ContactLeadInput = ContactFields & ContactAnswers;
export type TrialClassLeadInput = ContactFields & TrialClassAnswers;

export interface LeadPatch {
  status?: LeadStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
}

// What the admin page sees: every column but the internal `updatedAt`.
export interface LeadView {
  id: string;
  form: FormKey;
  name: string;
  email: string;
  phone: string;
  answers: LeadAnswers;
  status: LeadStatus;
  paymentStatus: PaymentStatus;
  notes: string;
  createdAt: string;
}

function toView(lead: Lead): LeadView {
  return {
    id: lead.id,
    form: lead.form,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    answers: lead.answers,
    status: lead.status,
    paymentStatus: lead.paymentStatus,
    notes: lead.notes,
    createdAt: lead.createdAt.toISOString(),
  };
}

function cleanContactFields({ name, email, phone }: ContactFields): ContactFields {
  const cleanName = name.trim().replaceAll(/\s+/g, " ");
  if (cleanName.length < 2) throw new InvalidLeadError("Name is too short");
  if (!isValidPhone(phone)) throw new InvalidLeadError("Invalid phone number");
  return { name: cleanName, email: email.trim().toLowerCase(), phone: normalizePhone(phone) };
}

export function guardSubmissionRate(limiter: AttemptLimiter, address: string): void {
  if (!limiter.allowed(address)) throw new TooManySubmissionsError();
  limiter.record(address);
}

async function insertLead(
  db: Database,
  form: FormKey,
  fields: ContactFields,
  answers: LeadAnswers,
): Promise<{ id: string }> {
  const [row] = await db
    .insert(leads)
    .values({ form, ...fields, answers })
    .returning({ id: leads.id });
  if (!row) throw new Error("Insert returned no row");
  return row;
}

export async function createContactLead(db: Database, input: ContactLeadInput) {
  const fields = cleanContactFields(input);
  // Weight training only has a free schedule: no class time. Every other interest picks one.
  const freeSchedule = input.interest === "academia";
  if (freeSchedule && input.preferredTime !== null) {
    throw new InvalidLeadError("Weight training has no class time");
  }
  if (!freeSchedule && input.preferredTime === null) {
    throw new InvalidLeadError("A class time is required");
  }
  const answers: ContactAnswers = {
    interest: input.interest,
    frequency: input.frequency,
    preferredTime: input.preferredTime,
    trainingType: freeSchedule ? "musculacao" : input.trainingType,
  };
  return insertLead(db, "contact", fields, answers);
}

export async function createTrialClassLead(db: Database, input: TrialClassLeadInput) {
  const fields = cleanContactFields(input);
  if (!isTrialClassHourAvailable(input.weekday, input.hour)) {
    throw new InvalidLeadError("The studio is closed in that period");
  }
  const answers: TrialClassAnswers = { weekday: input.weekday, hour: input.hour };
  return insertLead(db, "trial_class", fields, answers);
}

export async function listLeads(db: Database): Promise<LeadView[]> {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(LEAD_LIST_LIMIT);
  return rows.map(toView);
}

export async function updateLead(db: Database, id: string, patch: LeadPatch): Promise<LeadView> {
  const changes = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined),
  ) as LeadPatch;
  if (Object.keys(changes).length === 0) throw new InvalidLeadError("Nothing to update");
  const [row] = await db.update(leads).set(changes).where(eq(leads.id, id)).returning();
  if (!row) throw new LeadNotFoundError();
  return toView(row);
}

export async function deleteLead(db: Database, id: string): Promise<void> {
  const [row] = await db.delete(leads).where(eq(leads.id, id)).returning({ id: leads.id });
  if (!row) throw new LeadNotFoundError();
}
