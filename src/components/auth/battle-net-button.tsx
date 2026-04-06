"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2, Shield } from "lucide-react";

import { useToast } from "@/components/ui/toast-provider";

type BattleNetButtonProps = {
  mode: "login" | "connect";
  enabled: boolean;
  connectedBattleTag?: string | null;
  redirectTo: string;
};

export function BattleNetButton({
  mode,
  enabled,
  connectedBattleTag,
  redirectTo
}: BattleNetButtonProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isConnected = Boolean(connectedBattleTag);

  async function handleClick() {
    if (!enabled) {
      showToast({
        variant: "error",
        title: "Battle.net indisponivel",
        description: "Configure AUTH_BATTLENET_ID e AUTH_BATTLENET_SECRET para habilitar."
      });
      return;
    }

    if (mode === "connect" && isConnected) {
      showToast({
        variant: "success",
        title: "Conta conectada",
        description: `BattleTag atual: ${connectedBattleTag}`
      });
      return;
    }

    setIsLoading(true);

    try {
      await signIn("battlenet", {
        redirectTo
      });
    } catch {
      showToast({
        variant: "error",
        title: "Falha ao abrir Battle.net",
        description: "Nao foi possivel iniciar o login com Battle.net."
      });
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || !enabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:opacity-60 ${
        isConnected
          ? "border border-sky-400/30 bg-sky-500/10 text-sky-100"
          : "bg-sky-500 px-5 text-white hover:bg-sky-400"
      }`}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
      {!enabled
        ? "Battle.net indisponivel"
        : mode === "login"
          ? "Entrar com Battle.net"
          : isConnected
            ? "Battle.net conectado"
            : "Conectar Battle.net"}
    </button>
  );
}
