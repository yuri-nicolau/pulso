import {
  ChevronRight,
  Copy,
  Download,
  Inbox,
  LogOut,
  RefreshCw,
  Search,
  SearchX,
} from "lucide-react";
import { useMemo, useState } from "react";
import logoExtenso from "../../../assets/optimized/logo-extenso01.png";
import { BADGE_DOTS, Badge } from "../../../components/ui/Badge";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Select } from "../../../components/ui/Select";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { formatPhoneDisplay } from "../../../utils/phone";
import type { FormKey, LeadStatus, LeadView, PaymentStatus } from "../api";
import { downloadCsv, leadsToCsv } from "../csv";
import {
  FORM_LABELS,
  FORM_ORDER,
  formatDateTime,
  leadSummary,
  PAYMENT_LABELS,
  PAYMENT_ORDER,
  STATUS_LABELS,
  STATUS_ORDER,
} from "../labels";
import { LeadDetailSheet } from "./LeadDetailSheet";

interface Filters {
  form: FormKey | "all";
  status: LeadStatus | "all";
  payment: PaymentStatus | "all";
  search: string;
}

const NO_FILTERS: Filters = { form: "all", status: "all", payment: "all", search: "" };

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function matches(lead: LeadView, filters: Filters): boolean {
  if (filters.form !== "all" && lead.form !== filters.form) return false;
  if (filters.status !== "all" && lead.status !== filters.status) return false;
  if (filters.payment !== "all" && lead.paymentStatus !== filters.payment) return false;
  const query = normalize(filters.search.trim());
  if (!query) return true;
  const digits = query.replaceAll(/\D/g, "");
  return (
    normalize(lead.name).includes(query) ||
    lead.email.includes(query) ||
    (digits.length >= 3 && lead.phone.includes(digits))
  );
}

interface LeadsDashboardProps {
  leads: LeadView[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
  onSignOut: () => void;
}

export function LeadsDashboard({
  leads,
  isLoading,
  isError,
  isFetching,
  onRetry,
  onSignOut,
}: LeadsDashboardProps) {
  const toast = useToast();
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const allLeads = leads ?? [];
  const visible = useMemo(
    () => allLeads.filter((lead) => matches(lead, filters)),
    [allLeads, filters],
  );
  const selected = allLeads.find((lead) => lead.id === selectedId) ?? null;
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(NO_FILTERS);

  const stats = [
    { label: "Respostas", value: allLeads.length, filter: NO_FILTERS },
    {
      label: "Novos",
      value: allLeads.filter((lead) => lead.status === "new").length,
      filter: { ...NO_FILTERS, status: "new" as const },
    },
    {
      label: "Aulas agendadas",
      value: allLeads.filter((lead) => lead.status === "trial_scheduled").length,
      filter: { ...NO_FILTERS, status: "trial_scheduled" as const },
    },
    {
      label: "Matriculados",
      value: allLeads.filter((lead) => lead.status === "enrolled").length,
      filter: { ...NO_FILTERS, status: "enrolled" as const },
    },
    {
      label: "Pagamento pendente",
      value: allLeads.filter(
        (lead) => lead.status === "enrolled" && lead.paymentStatus === "pending",
      ).length,
      filter: { ...NO_FILTERS, status: "enrolled" as const, payment: "pending" as const },
    },
  ];

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  // Faceted count: how many responses this option would show, with the other filters kept.
  function countWith<K extends "form" | "status" | "payment">(key: K, value: Filters[K]) {
    return allLeads.filter((lead) => matches(lead, { ...filters, [key]: value })).length;
  }

  async function copyFormLink() {
    const link = `${window.location.origin}/aula-experimental`;
    try {
      await navigator.clipboard.writeText(link);
      toast("Link do formulário copiado");
    } catch {
      toast(link);
    }
  }

  function exportCsv() {
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(leadsToCsv(visible), `pulso-concept-respostas-${date}.csv`);
  }

  return (
    <div className="min-h-[100svh] bg-sand-100">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
          <div className="flex items-center gap-3">
            <img src={logoExtenso} alt="Pulso Concept" className="h-auto w-32 sm:w-40" />
            <span className="hidden rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-white sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRetry}
              aria-label="Atualizar respostas"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-2 rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-sand-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-display-md font-medium text-ink">Respostas</h1>
            <p className="mt-1 text-ink-muted">
              Acompanhe cada contato dos formulários até a matrícula.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyFormLink}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-sand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copiar link do formulário
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={visible.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Exportar planilha
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, index) => {
            const active = JSON.stringify(filters) === JSON.stringify(stat.filter) && index > 0;
            return (
              <button
                key={stat.label}
                type="button"
                onClick={() => setFilters(stat.filter)}
                aria-pressed={active}
                className={`flex flex-col items-start gap-1 rounded-3xl p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:p-5 ${
                  active ? "bg-ink text-white" : "bg-white text-ink hover:-translate-y-0.5"
                } ${index === 0 ? "col-span-2 sm:col-span-1" : ""}`}
              >
                <span className={`text-sm ${active ? "text-white/80" : "text-ink-muted"}`}>
                  {stat.label}
                </span>
                {isLoading ? (
                  <Skeleton className="h-9 w-12" />
                ) : (
                  <span className="font-display text-4xl font-medium">{stat.value}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-white p-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Buscar por nome, e-mail ou telefone"
              aria-label="Buscar por nome, e-mail ou telefone"
              className="w-full rounded-full bg-sand-100 py-2.5 pl-11 pr-4 text-sm text-ink outline-none transition-all placeholder:text-ink-muted focus:bg-white focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              label="Formulário"
              value={filters.form}
              resetValue="all"
              onChange={(value) => updateFilter("form", value)}
              options={[
                { value: "all", label: "Todos os formulários", count: countWith("form", "all") },
                ...FORM_ORDER.map((form) => ({
                  value: form,
                  label: FORM_LABELS[form],
                  count: countWith("form", form),
                })),
              ]}
            />
            <Select
              label="Status"
              value={filters.status}
              resetValue="all"
              onChange={(value) => updateFilter("status", value)}
              options={[
                { value: "all", label: "Todos os status", count: countWith("status", "all") },
                ...STATUS_ORDER.map((status) => ({
                  value: status,
                  label: STATUS_LABELS[status].label,
                  dotClassName: BADGE_DOTS[STATUS_LABELS[status].tone],
                  count: countWith("status", status),
                })),
              ]}
            />
            <Select
              label="Pagamento"
              value={filters.payment}
              resetValue="all"
              onChange={(value) => updateFilter("payment", value)}
              options={[
                {
                  value: "all",
                  label: "Todos os pagamentos",
                  count: countWith("payment", "all"),
                },
                ...PAYMENT_ORDER.map((payment) => ({
                  value: payment,
                  label: PAYMENT_LABELS[payment].label,
                  dotClassName: BADGE_DOTS[PAYMENT_LABELS[payment].tone],
                  count: countWith("payment", payment),
                })),
              ]}
            />
            {hasFilters && (
              <button
                type="button"
                onClick={() => setFilters(NO_FILTERS)}
                className="min-h-10 rounded-full px-3 text-sm font-medium text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        <section className="mt-4 overflow-hidden rounded-3xl bg-white">
          {isLoading ? (
            <ListSkeleton />
          ) : isError ? (
            <EmptyState
              icon={RefreshCw}
              title="Não foi possível carregar"
              description="Verifique sua conexão e tente de novo."
              action={
                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-soft"
                >
                  Tentar novamente
                </button>
              }
            />
          ) : allLeads.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Nenhuma resposta ainda"
              description="Assim que alguém preencher um formulário do site, a resposta aparece aqui."
              action={
                <button
                  type="button"
                  onClick={copyFormLink}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-soft"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  Copiar link do formulário
                </button>
              }
            />
          ) : visible.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Nenhuma resposta encontrada"
              description="Nenhuma resposta combina com a busca e os filtros escolhidos."
              action={
                <button
                  type="button"
                  onClick={() => setFilters(NO_FILTERS)}
                  className="rounded-full bg-sand-100 px-5 py-2.5 text-sm font-medium text-ink hover:bg-sand-200"
                >
                  Limpar filtros
                </button>
              }
            />
          ) : (
            <>
              <p className="px-5 pb-1 pt-4 text-xs text-ink-muted">
                {visible.length === 1 ? "1 resposta" : `${visible.length} respostas`}
                {hasFilters && " com os filtros atuais"}
              </p>
              <LeadsTable leads={visible} onOpen={setSelectedId} />
              <LeadsCards leads={visible} onOpen={setSelectedId} />
            </>
          )}
        </section>
      </main>

      <LeadDetailSheet lead={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}

interface LeadListProps {
  leads: LeadView[];
  onOpen: (id: string) => void;
}

function LeadsTable({ leads, onOpen }: LeadListProps) {
  return (
    <table className="hidden w-full text-left text-sm md:table">
      <thead>
        <tr className="text-xs uppercase tracking-[0.12em] text-ink-muted">
          <th className="px-5 py-3 font-medium">Nome</th>
          <th className="px-3 py-3 font-medium">Preferência</th>
          <th className="hidden px-3 py-3 font-medium lg:table-cell">Recebido em</th>
          <th className="px-3 py-3 font-medium">Status</th>
          <th className="px-3 py-3 font-medium">Pagamento</th>
          <th className="w-10 px-3 py-3">
            <span className="sr-only">Abrir</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr
            key={lead.id}
            onClick={() => onOpen(lead.id)}
            className="group cursor-pointer border-t border-sand-100 transition-colors hover:bg-sand-50"
          >
            <td className="px-5 py-4">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen(lead.id);
                }}
                className="text-left font-medium text-ink focus:outline-none focus-visible:underline"
              >
                {lead.name}
              </button>
              <p className="mt-0.5 text-xs text-ink-muted">{formatPhoneDisplay(lead.phone)}</p>
            </td>
            <td className="px-3 py-4">
              <p className="text-xs font-medium text-ink-muted">{FORM_LABELS[lead.form]}</p>
              <p className="mt-0.5 text-ink">{leadSummary(lead)}</p>
            </td>
            <td className="hidden whitespace-nowrap px-3 py-4 text-ink-muted lg:table-cell">
              {formatDateTime(lead.createdAt)}
            </td>
            <td className="px-3 py-4">
              <Badge tone={STATUS_LABELS[lead.status].tone}>
                {STATUS_LABELS[lead.status].label}
              </Badge>
            </td>
            <td className="px-3 py-4">
              <Badge tone={PAYMENT_LABELS[lead.paymentStatus].tone}>
                {PAYMENT_LABELS[lead.paymentStatus].label}
              </Badge>
            </td>
            <td className="px-3 py-4 text-ink-muted">
              <ChevronRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LeadsCards({ leads, onOpen }: LeadListProps) {
  return (
    <ul className="flex flex-col md:hidden">
      {leads.map((lead) => (
        <li key={lead.id} className="border-t border-sand-100 first:border-t-0">
          <button
            type="button"
            onClick={() => onOpen(lead.id)}
            className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors active:bg-sand-50"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-medium text-ink">{lead.name}</p>
                <span className="shrink-0 text-xs text-ink-muted">
                  {formatDateTime(lead.createdAt).slice(0, 5)}
                </span>
              </div>
              <p className="mt-0.5 text-xs font-medium text-ink-muted">{FORM_LABELS[lead.form]}</p>
              <p className="mt-1 text-sm text-ink">{leadSummary(lead)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={STATUS_LABELS[lead.status].tone}>
                  {STATUS_LABELS[lead.status].label}
                </Badge>
                <Badge tone={PAYMENT_LABELS[lead.paymentStatus].tone}>
                  {PAYMENT_LABELS[lead.paymentStatus].label}
                </Badge>
              </div>
            </div>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5" role="status" aria-label="Carregando respostas">
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="hidden h-6 w-16 rounded-full sm:block" />
        </div>
      ))}
    </div>
  );
}
