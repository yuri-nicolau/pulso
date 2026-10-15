import { beforeEach, describe, expect, test } from "bun:test";
import { createTestApp, readJson, request, TEST_ORIGIN, TEST_PASSWORD } from "./test/setup";

const trialClass = {
  name: "João Souza",
  email: "joao@example.com",
  phone: "11 98765-4321",
  weekday: "quinta",
  hour: "19:00",
};

const contact = {
  name: "Ana Lima",
  email: "ana@example.com",
  phone: "(11) 91111-2222",
  interest: "os-dois",
  frequency: "4x",
  preferredTime: "07:00",
  trainingType: "funcional",
};

let ctx: Awaited<ReturnType<typeof createTestApp>>;
beforeEach(async () => {
  ctx = await createTestApp();
});

describe("health and CORS", () => {
  test("health is public", async () => {
    const response = await request(ctx.app, "GET", "/api/health");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  test("CORS trusts only the web origins", async () => {
    const response = await request(ctx.app, "GET", "/api/health");
    expect(response.headers.get("access-control-allow-origin")).toBe(TEST_ORIGIN);
    const foreign = await ctx.app.handle(
      new Request("http://localhost/api/health", { headers: { origin: "https://evil.example" } }),
    );
    expect(foreign.headers.get("access-control-allow-origin")).not.toBe("https://evil.example");
  });
});

describe("POST /api/admin/session", () => {
  test("the right password returns a token that opens the admin routes", async () => {
    const response = await request(ctx.app, "POST", "/api/admin/session", {
      body: { password: TEST_PASSWORD },
    });
    expect(response.status).toBe(200);
    const { token, expiresAt } = await readJson<{ token: string; expiresAt: string }>(response);
    expect(typeof expiresAt).toBe("string");
    const check = await request(ctx.app, "GET", "/api/admin/session", { token });
    expect(check.status).toBe(200);
  });

  test("a wrong password is refused, then the address is locked", async () => {
    for (let i = 0; i < 5; i++) {
      const response = await request(ctx.app, "POST", "/api/admin/session", {
        body: { password: "nope" },
      });
      expect(response.status).toBe(401);
      expect((await readJson(response)).code).toBe("WRONG_PASSWORD");
    }
    const locked = await request(ctx.app, "POST", "/api/admin/session", {
      body: { password: TEST_PASSWORD },
    });
    expect(locked.status).toBe(429);
  });

  test("checking a session without a token is refused", async () => {
    expect((await request(ctx.app, "GET", "/api/admin/session")).status).toBe(401);
  });
});

describe("public forms", () => {
  test("POST /api/leads/trial-class stores a response", async () => {
    const response = await request(ctx.app, "POST", "/api/leads/trial-class", { body: trialClass });
    expect(response.status).toBe(201);
    expect((await readJson(response)).id).toBeString();
  });

  test("POST /api/leads/contact stores a response", async () => {
    const response = await request(ctx.app, "POST", "/api/leads/contact", { body: contact });
    expect(response.status).toBe(201);
  });

  test("invalid answers are refused", async () => {
    const badDay = await request(ctx.app, "POST", "/api/leads/trial-class", {
      body: { ...trialClass, weekday: "domingo" },
    });
    expect(badDay.status).toBe(422);
    const closed = await request(ctx.app, "POST", "/api/leads/trial-class", {
      body: { ...trialClass, weekday: "sabado", hour: "19:00" },
    });
    expect(closed.status).toBe(422);
    expect((await readJson(closed)).code).toBe("INVALID_LEAD");
    const badEmail = await request(ctx.app, "POST", "/api/leads/contact", {
      body: { ...contact, email: "not-an-email" },
    });
    expect(badEmail.status).toBe(422);
  });

  test("submissions are rate limited per address", async () => {
    for (let i = 0; i < 10; i++) {
      const ok = await request(ctx.app, "POST", "/api/leads/trial-class", { body: trialClass });
      expect(ok.status).toBe(201);
    }
    const limited = await request(ctx.app, "POST", "/api/leads/trial-class", { body: trialClass });
    expect(limited.status).toBe(429);
    const other = await request(ctx.app, "POST", "/api/leads/trial-class", {
      body: trialClass,
      ip: "198.51.100.7",
    });
    expect(other.status).toBe(201);
  });
});

describe("admin leads", () => {
  test("every admin route refuses a request without a session", async () => {
    const id = "00000000-0000-4000-8000-000000000000";
    const calls = [
      request(ctx.app, "GET", "/api/admin/leads"),
      request(ctx.app, "PATCH", `/api/admin/leads/${id}`, { body: { status: "lost" } }),
      request(ctx.app, "DELETE", `/api/admin/leads/${id}`),
      request(ctx.app, "GET", "/api/admin/leads", { token: "123.forged" }),
    ];
    for (const response of await Promise.all(calls)) expect(response.status).toBe(401);
  });

  test("lists, updates and deletes responses", async () => {
    await request(ctx.app, "POST", "/api/leads/trial-class", { body: trialClass });
    await request(ctx.app, "POST", "/api/leads/contact", { body: contact });
    const token = ctx.adminToken;

    const list = await request(ctx.app, "GET", "/api/admin/leads", { token });
    expect(list.status).toBe(200);
    const leads = await readJson<{ id: string; form: string }[]>(list);
    expect(leads).toHaveLength(2);
    const id = leads.find((lead) => lead.form === "trial_class")?.id;

    const patched = await request(ctx.app, "PATCH", `/api/admin/leads/${id}`, {
      token,
      body: { status: "trial_scheduled", notes: "Confirmado por WhatsApp" },
    });
    expect(patched.status).toBe(200);
    expect(await patched.json()).toMatchObject({
      status: "trial_scheduled",
      paymentStatus: "pending",
      notes: "Confirmado por WhatsApp",
    });

    const badStatus = await request(ctx.app, "PATCH", `/api/admin/leads/${id}`, {
      token,
      body: { status: "whatever" },
    });
    expect(badStatus.status).toBe(422);

    const deleted = await request(ctx.app, "DELETE", `/api/admin/leads/${id}`, { token });
    expect(deleted.status).toBe(204);
    const missing = await request(ctx.app, "DELETE", `/api/admin/leads/${id}`, { token });
    expect(missing.status).toBe(404);
  });
});
