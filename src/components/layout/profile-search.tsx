"use client";

import type { Route } from "next";
import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/components/ui/toast-provider";

export function ProfileSearch() {
  const router = useRouter();
  const { showToast } = useToast();

  const [battleTag, setBattleTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedBattleTag = battleTag.trim();

    if (!trimmedBattleTag) {
      showToast({
        variant: "error",
        title: "BattleTag obrigatorio",
        description: "Digite algo como Player#1234 para buscar."
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/profile?battletag=${encodeURIComponent(trimmedBattleTag)}`,
        {
          method: "GET",
          cache: "no-store"
        }
      );

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };

        throw new Error(data.error || "Nao foi possivel encontrar esse perfil.");
      }

      router.push(`/profile/${encodeURIComponent(trimmedBattleTag)}` as Route);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Perfil nao encontrado",
        description:
          error instanceof Error ? error.message : "Nao foi possivel buscar esse perfil."
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center justify-center">
      <div className="glass-panel flex w-full max-w-2xl items-center gap-2 rounded-full px-3 py-2">
        <Search className="h-4 w-4 text-cyan-300" />
        <input
          type="text"
          value={battleTag}
          onChange={(event) => setBattleTag(event.target.value)}
          placeholder="Buscar BattleTag (ex: Proper#1111)"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-3 py-1.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Buscar
        </button>
      </div>
    </form>
  );
}
