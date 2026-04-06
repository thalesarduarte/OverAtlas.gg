"use client";

import type { Route } from "next";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle, Loader2 } from "lucide-react";

import { BattleNetButton } from "@/components/auth/battle-net-button";
import { SectionShell } from "@/components/ui/section-shell";
import { useToast } from "@/components/ui/toast-provider";

function getErrorMessage(code?: string) {
  switch (code) {
    case "user_not_found":
      return "Usuario nao existe.";
    case "invalid_password":
      return "Senha invalida.";
    default:
      return "Nao foi possivel entrar com essas credenciais.";
  }
}

function LoginContent({ battleNetEnabled }: { battleNetEnabled: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const callbackUrl = searchParams?.get("callbackUrl") || "/favoritos";
  const registerHref = `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` as Route;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasShownRegisteredToast = useRef(false);

  useEffect(() => {
    if (searchParams?.get("registered") === "true" && !hasShownRegisteredToast.current) {
      hasShownRegisteredToast.current = true;
      showToast({
        variant: "success",
        title: "Conta criada",
        description: "Agora faca login para continuar."
      });
    }
  }, [searchParams, showToast]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        redirectTo: callbackUrl
      });

      if (!result?.ok) {
        const message = getErrorMessage(result?.code);

        setError(message);
        showToast({
          variant: "error",
          title: "Falha no login",
          description: message
        });
        return;
      }

      showToast({
        variant: "success",
        title: "Login realizado",
        description: "Redirecionando para sua area autenticada."
      });
      router.push(callbackUrl as Route);
      router.refresh();
    } catch {
      const message = "Ocorreu um erro inesperado ao entrar.";

      setError(message);
      showToast({
        variant: "error",
        title: "Falha no login",
        description: message
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SectionShell
      title="Entrar"
      description="Use seu email e senha ou continue com Battle.net para acessar favoritos e configuracoes."
    >
      <div className="mx-auto max-w-lg space-y-5">
        {error ? (
          <div className="flex items-start rounded-2xl bg-red-500/10 p-4 text-sm text-red-200">
            <AlertCircle className="mr-2 mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        <BattleNetButton
          mode="login"
          enabled={battleNetEnabled}
          redirectTo={callbackUrl}
        />

        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
          <span className="h-px flex-1 bg-white/10" />
          ou
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-400 focus:bg-white/10"
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
              minLength={6}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-400 focus:bg-white/10"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-500 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Ainda nao tem conta?{" "}
          <Link href={registerHref} className="text-amber-300 hover:underline">
            Criar agora
          </Link>
        </p>
      </div>
    </SectionShell>
  );
}

export function LoginForm({ battleNetEnabled }: { battleNetEnabled: boolean }) {
  return (
    <Suspense
      fallback={
        <SectionShell
          title="Entrar"
          description="Use seu email e senha para acessar favoritos e configuracoes."
        >
          <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Carregando formulario...
          </div>
        </SectionShell>
      }
    >
      <LoginContent battleNetEnabled={battleNetEnabled} />
    </Suspense>
  );
}
