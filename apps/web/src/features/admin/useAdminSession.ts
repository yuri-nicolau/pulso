import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { readAdminToken, writeAdminToken } from "../../lib/admin-token";

/** Admin session token, kept on the device until it expires or the admin signs out. */
export function useAdminSession() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => readAdminToken());

  const signIn = useCallback((nextToken: string) => {
    writeAdminToken(nextToken);
    setToken(nextToken);
  }, []);

  const signOut = useCallback(() => {
    writeAdminToken(null);
    setToken(null);
    queryClient.removeQueries({ queryKey: ["admin"] });
  }, [queryClient]);

  return { token, signIn, signOut };
}
