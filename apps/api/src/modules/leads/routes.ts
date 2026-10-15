import type { Database } from "@pulso-concept/db";
import { Elysia } from "elysia";
import type { AttemptLimiter } from "../../lib/attempts";
import { clientIp } from "../../lib/client-ip";
import type { SessionTokens } from "../../lib/session";
import { requireAdmin } from "../iam/services";
import { contactLeadBody, leadParams, leadPatchBody, trialClassLeadBody } from "./schemas";
import {
  createContactLead,
  createTrialClassLead,
  deleteLead,
  guardSubmissionRate,
  listLeads,
  updateLead,
} from "./services";

interface LeadsRoutesDeps {
  db: Database;
  tokens: SessionTokens;
  submissionLimiter: AttemptLimiter;
}

// The public forms: anyone can submit, rate limited per address.
function publicRoutes({ db, submissionLimiter }: LeadsRoutesDeps) {
  return new Elysia({ prefix: "/leads" })
    .onBeforeHandle(({ request, server }) =>
      guardSubmissionRate(submissionLimiter, clientIp(request, server)),
    )
    .post(
      "/contact",
      ({ body, status }) => createContactLead(db, body).then((r) => status(201, r)),
      {
        body: contactLeadBody,
      },
    )
    .post(
      "/trial-class",
      ({ body, status }) => createTrialClassLead(db, body).then((r) => status(201, r)),
      { body: trialClassLeadBody },
    );
}

// The admin page: every route needs an admin session.
function adminRoutes({ db, tokens }: LeadsRoutesDeps) {
  return new Elysia({ prefix: "/admin/leads" })
    .onBeforeHandle(({ headers }) => requireAdmin(tokens, headers.authorization))
    .get("", () => listLeads(db))
    .patch("/:id", ({ params, body }) => updateLead(db, params.id, body), {
      params: leadParams,
      body: leadPatchBody,
    })
    .delete(
      "/:id",
      async ({ params, status }) => {
        await deleteLead(db, params.id);
        return status(204, null);
      },
      { params: leadParams },
    );
}

export function leadsRoutes(deps: LeadsRoutesDeps) {
  return new Elysia().use(publicRoutes(deps)).use(adminRoutes(deps));
}
