import type { ClassType, Interest } from "./schedule";

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  interest: Interest;
  frequency: string;
  preferredTime: string;
  trainingType: ClassType;
}

export class LeadSubmissionError extends Error {}

/**
 * Envia os dados do formulário de contato para o Web App do Google Apps
 * Script, que grava a linha na planilha (Google Sheets) e dispara o e-mail
 * de notificação.
 *
 * Usamos `Content-Type: text/plain` de propósito: o Apps Script não trata
 * o preflight OPTIONS do CORS, então evitar `application/json` mantém a
 * requisição "simple" e livre de preflight.
 */
export async function submitLead(payload: LeadPayload): Promise<void> {
  const endpoint = import.meta.env.VITE_GOOGLE_SCRIPT_URL as
    | string
    | undefined;

  if (!endpoint) {
    throw new LeadSubmissionError(
      "VITE_GOOGLE_SCRIPT_URL não configurada. Defina a URL do Web App do Google Apps Script no .env.",
    );
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new LeadSubmissionError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    );
  }

  if (!response.ok) {
    throw new LeadSubmissionError(
      "O servidor recusou o envio. Tente novamente em instantes.",
    );
  }

  const result = await response.json().catch(() => null);
  if (!result || result.status !== "success") {
    throw new LeadSubmissionError(
      "Não foi possível confirmar o envio. Tente novamente em instantes.",
    );
  }
}
