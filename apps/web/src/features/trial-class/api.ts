import { useMutation } from "@tanstack/react-query";
import { api, unwrap } from "../../lib/api";

export type TrialClassPayload = Parameters<(typeof api.leads)["trial-class"]["post"]>[0];

export function useSubmitTrialClass() {
  return useMutation({
    mutationFn: (payload: TrialClassPayload) => unwrap(api.leads["trial-class"].post(payload)),
  });
}
