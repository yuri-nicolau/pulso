import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { type FormEvent, useId, useState } from "react";
import logoExtenso from "../../../assets/optimized/logo-extenso01.png";
import marcaLaranja from "../../../assets/optimized/marca-laranja.png";
import { ApiError } from "../../../lib/api";
import { useSignIn } from "../api";

interface AdminLoginProps {
  onSignedIn: (token: string) => void;
  /** Notice shown when the previous session expired. */
  expired?: boolean;
}

function signInErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 401) return "Senha incorreta.";
  if (error instanceof ApiError && error.status === 429) {
    return "Muitas tentativas erradas. Aguarde 15 minutos e tente novamente.";
  }
  if (error instanceof ApiError && error.status === 0) {
    return "Não foi possível conectar ao servidor. Verifique sua conexão.";
  }
  return "Não foi possível entrar. Tente novamente em instantes.";
}

export function AdminLogin({ onSignedIn, expired = false }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const signIn = useSignIn();
  const inputId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password) return;
    signIn.mutate(password, { onSuccess: ({ token }) => onSignedIn(token) });
  }

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-sand-100 px-4 py-12">
      <img
        src={marcaLaranja}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 w-[28rem] -rotate-12 select-none opacity-[0.08]"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-premium"
      >
        <img src={logoExtenso} alt="Pulso Concept" className="h-auto w-40" />

        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
          <LockKeyhole className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-medium text-ink">Área administrativa</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Digite a senha para acompanhar as respostas dos formulários.
        </p>

        {expired && !signIn.isError && (
          <p className="mt-4 rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-900">
            Sua sessão expirou. Entre novamente.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-ink">
              Senha
            </label>
            <div className="relative">
              <input
                id={inputId}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={signIn.isPending}
                aria-invalid={signIn.isError || undefined}
                className="w-full rounded-2xl border border-transparent bg-sand-100 py-3 pl-4 pr-12 text-base text-ink outline-none transition-all duration-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/15 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-sand-200 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {signIn.isError && (
            <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
              {signInErrorMessage(signIn.error)}
            </p>
          )}

          <button
            type="submit"
            disabled={signIn.isPending || !password}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-base font-medium text-white transition-all duration-300 hover:bg-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
          >
            {signIn.isPending && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
            Entrar
          </button>
        </form>
      </motion.div>
    </main>
  );
}
