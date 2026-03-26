"use client";

import type { Route } from "next";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle, Loader2 } from "lucide-react";

import { SectionShell } from "@/components/ui/section-shell";
import { useToast } from "@/components/ui/toast-provider";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const callbackUrl = searchParams?.get("callbackUrl") || "/favoritos";
  const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` as Route;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Nao foi possivel criar a conta.");
      }

      showToast({
        variant: "success",
        title: "Conta criada",
        description: "Entrando automaticamente."
      });

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        redirectTo: callbackUrl
      });

      if (!signInResult?.ok) {
        router.push(
          `/login?registered=true&callbackUrl=${encodeURIComponent(callbackUrl)}` as Route
        );
        return;
      }

      router.push(callbackUrl as Route);
      router.refresh();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Nao foi possivel criar a conta.";

      setError(message);
      showToast({
        variant: "error",
        title: "Falha no cadastro",
        description: message
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SectionShell
      title="Criar conta"
      description="Cadastre-se com email e senha para salvar seus favoritos."
    >
      <div className="mx-auto max-w-lg space-y-5">
        {error ? (
          <div className="flex items-start rounded-2xl bg-red-500/10 p-4 text-sm text-red-200">
            <AlertCircle className="mr-2 mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

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
              minLength={6}
              disabled={isLoading}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-400 focus:bg-white/10"
              placeholder="Minimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-500 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Criar conta
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Ja tem conta?{" "}
          <Link href={loginHref} className="text-amber-300 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </SectionShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <SectionShell
          title="Criar conta"
          description="Cadastre-se com email e senha para salvar seus favoritos."
        >
          <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Carregando formulario...
          </div>
        </SectionShell>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
