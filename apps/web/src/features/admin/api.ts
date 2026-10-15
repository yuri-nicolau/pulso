import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, unwrap } from "../../lib/api";

const fetchLeads = () => unwrap(api.admin.leads.get());

export type LeadView = Awaited<ReturnType<typeof fetchLeads>>[number];
export type LeadStatus = LeadView["status"];
export type PaymentStatus = LeadView["paymentStatus"];
export type FormKey = LeadView["form"];
export type LeadPatch = Parameters<ReturnType<typeof api.admin.leads>["patch"]>[0];

export const leadsQueryKey = ["admin", "leads"] as const;

export function useLeads(enabled: boolean) {
  return useQuery({ queryKey: leadsQueryKey, queryFn: fetchLeads, enabled });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: LeadPatch }) =>
      unwrap(api.admin.leads({ id }).patch(patch)),
    onSuccess: (updated) => {
      queryClient.setQueryData<LeadView[]>(leadsQueryKey, (current) =>
        current?.map((lead) => (lead.id === updated.id ? updated : lead)),
      );
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await unwrap(api.admin.leads({ id }).delete());
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<LeadView[]>(leadsQueryKey, (current) =>
        current?.filter((lead) => lead.id !== id),
      );
    },
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: (password: string) => unwrap(api.admin.session.post({ password })),
  });
}

// Confirms a stored token is still valid before showing data.
export function useSessionCheck(token: string | null) {
  return useQuery({
    queryKey: ["admin", "session", token],
    queryFn: () => unwrap(api.admin.session.get()),
    enabled: token !== null,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
