import { ApiError, api, unwrap } from "../lib/api";

export type LeadPayload = Parameters<typeof api.leads.contact.post>[0];

export class LeadSubmissionError extends Error {}

/** Sends the landing page contact form to the API (admin panel). */
export async function submitLead(payload: LeadPayload): Promise<void> {
  try {
    await unwrap(api.leads.contact.post(payload));
  } catch (error) {
    throw new LeadSubmissionError(submissionErrorMessage(error));
  }
}

/** pt-BR message for a submission failure on any public form. */
export function submissionErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return "Algo deu errado. Tente novamente em instantes.";
  if (error.status === 0) {
    return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
  }
  if (error.status === 429) {
    return "Recebemos muitos envios a partir da sua conexão. Tente novamente mais tarde.";
  }
  if (error.status === 422) return "Confira os dados preenchidos e tente novamente.";
  return "O servidor recusou o envio. Tente novamente em instantes.";
}
