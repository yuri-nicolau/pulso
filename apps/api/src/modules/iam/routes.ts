import { Elysia } from "elysia";
import { clientIp } from "../../lib/client-ip";
import { signInBody } from "./schemas";
import { type IamContext, requireAdmin, signIn } from "./services";

export function iamRoutes({ iam }: { iam: IamContext }) {
  return (
    new Elysia({ prefix: "/admin/session" })
      .post(
        "",
        ({ body, request, server }) => signIn(iam, body.password, clientIp(request, server)),
        {
          body: signInBody,
        },
      )
      // Lets the admin page check a stored session before showing data.
      .get("", ({ headers }) => {
        requireAdmin(iam.tokens, headers.authorization);
        return { authenticated: true as const };
      })
  );
}
