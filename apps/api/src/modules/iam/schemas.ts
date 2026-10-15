import { t } from "elysia";

export const signInBody = t.Object({ password: t.String({ minLength: 1, maxLength: 200 }) });
