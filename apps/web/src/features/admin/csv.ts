import { formatPhoneDisplay } from "../../utils/phone";
import type { LeadView } from "./api";
import { FORM_LABELS, formatDateTime, leadSummary, PAYMENT_LABELS, STATUS_LABELS } from "./labels";

const HEADERS = [
  "Recebido em",
  "Formulário",
  "Nome",
  "E-mail",
  "Telefone",
  "Preferência",
  "Status",
  "Pagamento",
  "Observações",
];

function cell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

/** CSV with ";" and a BOM: opens straight in Portuguese Excel with correct accents. */
export function leadsToCsv(leads: LeadView[]): string {
  const rows = leads.map((lead) => [
    formatDateTime(lead.createdAt),
    FORM_LABELS[lead.form],
    lead.name,
    lead.email,
    formatPhoneDisplay(lead.phone),
    leadSummary(lead),
    STATUS_LABELS[lead.status].label,
    PAYMENT_LABELS[lead.paymentStatus].label,
    lead.notes,
  ]);
  return `﻿${[HEADERS, ...rows].map((row) => row.map(cell).join(";")).join("\r\n")}`;
}

export function downloadCsv(content: string, fileName: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
