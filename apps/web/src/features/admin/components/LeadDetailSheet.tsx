import { Loader2, Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Badge } from "../../../components/ui/Badge";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { PillGroup } from "../../../components/ui/PillGroup";
import { Sheet } from "../../../components/ui/Sheet";
import { useToast } from "../../../components/ui/Toast";
import { formatPhoneDisplay, toWhatsAppNumber } from "../../../utils/phone";
import { getWhatsAppUrl } from "../../../utils/whatsapp";
import { type LeadPatch, type LeadView, useDeleteLead, useUpdateLead } from "../api";
import {
  FORM_LABELS,
  formatDateTime,
  leadAnswers,
  PAYMENT_LABELS,
  PAYMENT_ORDER,
  STATUS_LABELS,
  STATUS_ORDER,
  whatsappGreeting,
} from "../labels";

interface LeadDetailSheetProps {
  lead: LeadView | null;
  onClose: () => void;
}

const contactActionClasses =
  "flex flex-1 flex-col items-center gap-1.5 rounded-2xl bg-sand-100 px-3 py-3 text-xs font-medium text-ink transition-colors hover:bg-sand-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500";

export function LeadDetailSheet({ lead, onClose }: LeadDetailSheetProps) {
  return (
    <Sheet
      open={lead !== null}
      onClose={onClose}
      title={lead?.name ?? ""}
      subtitle={
        lead && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <Badge tone="ink">{FORM_LABELS[lead.form]}</Badge>
            <span>Recebido em {formatDateTime(lead.createdAt)}</span>
          </div>
        )
      }
    >
      {lead && <LeadDetails key={lead.id} lead={lead} onDeleted={onClose} />}
    </Sheet>
  );
}

function LeadDetails({ lead, onDeleted }: { lead: LeadView; onDeleted: () => void }) {
  const toast = useToast();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const [notes, setNotes] = useState(lead.notes);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const notesId = useId();

  // Another tab may have saved notes: follow the server value whenever it changes.
  useEffect(() => setNotes(lead.notes), [lead.notes]);

  function save(patch: LeadPatch, successMessage: string) {
    updateLead.mutate(
      { id: lead.id, patch },
      {
        onSuccess: () => toast(successMessage),
        onError: () => toast("Não foi possível salvar. Tente novamente.", "error"),
      },
    );
  }

  function handleDelete() {
    deleteLead.mutate(lead.id, {
      onSuccess: () => {
        toast("Resposta excluída");
        setConfirmingDelete(false);
        onDeleted();
      },
      onError: () => toast("Não foi possível excluir. Tente novamente.", "error"),
    });
  }

  const savingField = updateLead.isPending ? updateLead.variables?.patch : undefined;

  return (
    <div className="flex flex-col gap-8 pb-4">
      <div className="flex gap-2">
        <a
          href={getWhatsAppUrl(whatsappGreeting(lead), toWhatsAppNumber(lead.phone))}
          target="_blank"
          rel="noopener noreferrer"
          className={contactActionClasses}
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          WhatsApp
        </a>
        <a href={`tel:+${toWhatsAppNumber(lead.phone)}`} className={contactActionClasses}>
          <Phone className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          Ligar
        </a>
        <a href={`mailto:${lead.email}`} className={contactActionClasses}>
          <Mail className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          E-mail
        </a>
      </div>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          Contato
        </h3>
        <dl className="mt-3 divide-y divide-sand-200 rounded-2xl bg-sand-50 px-4">
          <DetailRow label="Telefone" value={formatPhoneDisplay(lead.phone)} />
          <DetailRow label="E-mail" value={lead.email} />
        </dl>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          Respostas
        </h3>
        <dl className="mt-3 divide-y divide-sand-200 rounded-2xl bg-sand-50 px-4">
          {leadAnswers(lead).map((item) => (
            <DetailRow key={item.question} label={item.question} value={item.answer} />
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          Acompanhamento
        </h3>

        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
            Status
            {savingField?.status && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-muted" aria-label="Salvando" />
            )}
          </p>
          <PillGroup
            name="Status"
            tone="light"
            options={STATUS_ORDER.map((status) => ({
              value: status,
              label: STATUS_LABELS[status].label,
            }))}
            value={lead.status}
            onChange={(value) =>
              value !== lead.status &&
              save({ status: value as LeadView["status"] }, "Status atualizado")
            }
            disabled={updateLead.isPending}
          />
        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
            Pagamento
            {savingField?.paymentStatus && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-muted" aria-label="Salvando" />
            )}
          </p>
          <PillGroup
            name="Pagamento"
            tone="light"
            options={PAYMENT_ORDER.map((payment) => ({
              value: payment,
              label: PAYMENT_LABELS[payment].label,
            }))}
            value={lead.paymentStatus}
            onChange={(value) =>
              value !== lead.paymentStatus &&
              save({ paymentStatus: value as LeadView["paymentStatus"] }, "Pagamento atualizado")
            }
            disabled={updateLead.isPending}
          />
        </div>

        <div>
          <label htmlFor={notesId} className="mb-2 block text-sm font-medium text-ink">
            Observações
          </label>
          <textarea
            id={notesId}
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ex.: prefere contato à noite, já treinou em outra academia…"
            className="w-full resize-y rounded-2xl border border-transparent bg-sand-100 px-4 py-3 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/80 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/15"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => save({ notes }, "Observações salvas")}
              disabled={notes === lead.notes || updateLead.isPending}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
            >
              {savingField?.notes !== undefined && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              Salvar observações
            </button>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setConfirmingDelete(true)}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Excluir resposta
      </button>

      <ConfirmDialog
        open={confirmingDelete}
        title="Excluir esta resposta?"
        description={`Os dados de ${lead.name} serão apagados de vez. Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleteLead.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="shrink-0 text-sm text-ink-muted">{label}</dt>
      <dd className="min-w-0 break-words text-right text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
