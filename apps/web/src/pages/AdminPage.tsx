import { useEffect, useState } from "react";
import { Skeleton } from "../components/ui/Skeleton";
import { useLeads, useSessionCheck } from "../features/admin/api";
import { AdminLogin } from "../features/admin/components/AdminLogin";
import { LeadsDashboard } from "../features/admin/components/LeadsDashboard";
import { useAdminSession } from "../features/admin/useAdminSession";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ApiError } from "../lib/api";

function isUnauthenticated(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

/** /admin: password-protected; shows and manages the responses from every form. */
export function AdminPage() {
  useDocumentTitle("Admin | Pulso Concept");
  useNoIndex();

  const { token, signIn, signOut } = useAdminSession();
  const [expired, setExpired] = useState(false);
  const session = useSessionCheck(token);
  const leads = useLeads(session.isSuccess);

  // Session expired (or password changed on the server): back to login with a notice.
  const sessionRejected = isUnauthenticated(session.error) || isUnauthenticated(leads.error);
  useEffect(() => {
    if (!sessionRejected) return;
    setExpired(true);
    signOut();
  }, [sessionRejected, signOut]);

  if (!token) {
    return (
      <AdminLogin
        expired={expired}
        onSignedIn={(nextToken) => {
          setExpired(false);
          signIn(nextToken);
        }}
      />
    );
  }

  if (session.isPending) {
    return (
      <div
        className="flex min-h-[100svh] items-center justify-center bg-sand-100"
        role="status"
        aria-label="Verificando acesso"
      >
        <Skeleton className="h-64 w-full max-w-sm rounded-[2rem]" />
      </div>
    );
  }

  return (
    <LeadsDashboard
      leads={leads.data}
      isLoading={leads.isPending && !session.isError}
      isError={leads.isError || session.isError}
      isFetching={leads.isFetching}
      onRetry={() => {
        if (session.isError) void session.refetch();
        else void leads.refetch();
      }}
      onSignOut={signOut}
    />
  );
}

/** The admin page must not show up in search engines. */
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}
