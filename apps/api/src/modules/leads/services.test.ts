import { beforeEach, describe, expect, test } from "bun:test";
import type { Database } from "@pulso-concept/db";
import type { TrialClassAnswers } from "@pulso-concept/forms";
import { createAttemptLimiter } from "../../lib/attempts";
import { createTestDb } from "../../test/setup";
import {
  createContactLead,
  createTrialClassLead,
  deleteLead,
  guardSubmissionRate,
  InvalidLeadError,
  LeadNotFoundError,
  listLeads,
  TooManySubmissionsError,
  updateLead,
} from "./services";

const person = {
  name: "  Maria   da Silva ",
  email: " Maria@Example.COM ",
  phone: "(11) 91234-5678",
};
const MISSING_ID = "00000000-0000-4000-8000-000000000000";

let db: Database;
beforeEach(async () => {
  db = await createTestDb();
});

describe("createTrialClassLead", () => {
  test("stores cleaned contact fields and the chosen period", async () => {
    await createTrialClassLead(db, { ...person, weekdays: ["terca"], hours: ["07:00"] });
    const [lead] = await listLeads(db);
    expect(lead).toMatchObject({
      form: "trial_class",
      name: "Maria da Silva",
      email: "maria@example.com",
      phone: "11912345678",
      answers: { weekdays: ["terca"], hours: ["07:00"] },
      status: "new",
      paymentStatus: "pending",
      notes: "",
    });
  });

  test("stores several days and periods, sorted and without repeats", async () => {
    await createTrialClassLead(db, {
      ...person,
      weekdays: ["sexta", "segunda", "sexta"],
      hours: ["18:00", "07:00", "07:00"],
    });
    const [lead] = await listLeads(db);
    expect(lead?.answers).toEqual({ weekdays: ["segunda", "sexta"], hours: ["07:00", "18:00"] });
  });

  test("accepts the first and last periods of the day", async () => {
    await createTrialClassLead(db, { ...person, weekdays: ["sabado"], hours: ["05:00", "20:00"] });
    expect(await listLeads(db)).toHaveLength(1);
  });

  test("refuses an invalid email even if it passes the schema", async () => {
    expect(
      createTrialClassLead(db, {
        ...person,
        email: "maria@example.c",
        weekdays: ["segunda"],
        hours: ["06:00"],
      }),
    ).rejects.toThrow(InvalidLeadError);
  });

  test("refuses a period when the studio is closed", async () => {
    expect(
      createTrialClassLead(db, { ...person, weekdays: ["sabado"], hours: ["21:00"] }),
    ).rejects.toThrow(InvalidLeadError);
  });

  test("refuses an invalid phone or a blank name", async () => {
    const answers: TrialClassAnswers = { weekdays: ["segunda"], hours: ["06:00"] };
    expect(createTrialClassLead(db, { ...person, ...answers, phone: "1234" })).rejects.toThrow(
      InvalidLeadError,
    );
    expect(createTrialClassLead(db, { ...person, ...answers, name: "   " })).rejects.toThrow(
      InvalidLeadError,
    );
  });
});

describe("createContactLead", () => {
  test("stores a class time for functional training", async () => {
    await createContactLead(db, {
      ...person,
      interest: "funcional",
      frequency: "3x",
      preferredTime: "18:00",
      trainingType: "funcional",
    });
    const [lead] = await listLeads(db);
    expect(lead?.answers).toEqual({
      interest: "funcional",
      frequency: "3x",
      preferredTime: "18:00",
      trainingType: "funcional",
    });
  });

  test("weight training has no class time and is always musculacao", async () => {
    await createContactLead(db, {
      ...person,
      interest: "academia",
      frequency: "2x",
      preferredTime: null,
      trainingType: "hiit",
    });
    const [lead] = await listLeads(db);
    expect(lead?.answers).toMatchObject({ preferredTime: null, trainingType: "musculacao" });
  });

  test("refuses a missing or unexpected class time", async () => {
    const base = { ...person, frequency: "1x", trainingType: "funcional" } as const;
    expect(
      createContactLead(db, { ...base, interest: "funcional", preferredTime: null }),
    ).rejects.toThrow(InvalidLeadError);
    expect(
      createContactLead(db, { ...base, interest: "academia", preferredTime: "18:00" }),
    ).rejects.toThrow(InvalidLeadError);
  });
});

describe("listLeads", () => {
  test("returns the newest first, without internal columns", async () => {
    await createTrialClassLead(db, {
      ...person,
      name: "Primeira",
      weekdays: ["segunda"],
      hours: ["06:00"],
    });
    await Bun.sleep(5);
    await createTrialClassLead(db, {
      ...person,
      name: "Segunda",
      weekdays: ["segunda"],
      hours: ["06:00"],
    });
    const result = await listLeads(db);
    expect(result.map((lead) => lead.name)).toEqual(["Segunda", "Primeira"]);
    expect(result[0]).not.toHaveProperty("updatedAt");
    expect(typeof result[0]?.createdAt).toBe("string");
  });
});

describe("updateLead / deleteLead", () => {
  test("updates the pipeline status, payment and notes", async () => {
    const { id } = await createTrialClassLead(db, {
      ...person,
      weekdays: ["quarta"],
      hours: ["12:00"],
    });
    const updated = await updateLead(db, id, { status: "enrolled", paymentStatus: "paid" });
    expect(updated).toMatchObject({ status: "enrolled", paymentStatus: "paid", notes: "" });
    const noted = await updateLead(db, id, { notes: "Prefere WhatsApp" });
    expect(noted).toMatchObject({ status: "enrolled", notes: "Prefere WhatsApp" });
  });

  test("refuses an empty patch and unknown ids", async () => {
    const { id } = await createTrialClassLead(db, {
      ...person,
      weekdays: ["quarta"],
      hours: ["12:00"],
    });
    expect(updateLead(db, id, {})).rejects.toThrow(InvalidLeadError);
    expect(updateLead(db, MISSING_ID, { status: "lost" })).rejects.toThrow(LeadNotFoundError);
    expect(deleteLead(db, MISSING_ID)).rejects.toThrow(LeadNotFoundError);
  });

  test("deletes a response", async () => {
    const { id } = await createTrialClassLead(db, {
      ...person,
      weekdays: ["quarta"],
      hours: ["12:00"],
    });
    await deleteLead(db, id);
    expect(await listLeads(db)).toEqual([]);
  });
});

test("guardSubmissionRate counts every submission per address", () => {
  const limiter = createAttemptLimiter(2, 60_000);
  guardSubmissionRate(limiter, "a");
  guardSubmissionRate(limiter, "a");
  expect(() => guardSubmissionRate(limiter, "a")).toThrow(TooManySubmissionsError);
  expect(() => guardSubmissionRate(limiter, "b")).not.toThrow();
});
