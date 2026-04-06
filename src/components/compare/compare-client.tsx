"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { ComparisonGrid } from "@/components/stats/comparison-grid";
import { CompareMetricsChart } from "@/components/stats/compare-metrics-chart";
import { HeroChart } from "@/components/stats/hero-chart";
import { SectionShell } from "@/components/ui/section-shell";
import { useToast } from "@/components/ui/toast-provider";
import { CompareResponse, PlayerComparison } from "@/types";

type CompareClientProps = {
  initialComparison: PlayerComparison;
  initialDiffSummary: string[];
  initialPlayer1: string;
  initialPlayer2: string;
};

function ComparisonCard({
  label,
  profile,
  isLeading
}: {
  label: string;
  profile: PlayerComparison["left"];
  isLeading: boolean;
}) {
  return (
    <article
      className={`rounded-3xl border p-5 transition duration-300 ${
        isLeading
          ? "border-emerald-400/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/5"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <h3 className="mt-3 text-2xl font-bold text-white">{profile.displayName}</h3>
      <p className="mt-1 text-sm text-slate-400">{profile.battleTag}</p>

      <div className="mt-5 grid gap-3 text-sm text-slate-200">
        <div className="rounded-2xl bg-black/20 px-4 py-3">
          <span className="text-slate-400">Role principal</span>
          <p className="mt-1 font-semibold text-white">{profile.mainRole}</p>
        </div>
        <div className="rounded-2xl bg-black/20 px-4 py-3">
          <span className="text-slate-400">Winrate</span>
          <p className="mt-1 font-semibold text-white">{profile.overallWinrate}%</p>
        </div>
        <div className="rounded-2xl bg-black/20 px-4 py-3">
          <span className="text-slate-400">Tempo jogado</span>
          <p className="mt-1 font-semibold text-white">{profile.totalHours}h</p>
        </div>
        <div className="rounded-2xl bg-black/20 px-4 py-3">
          <span className="text-slate-400">Heroi principal</span>
          <p className="mt-1 font-semibold text-white">{profile.topHeroes[0]?.heroName ?? "-"}</p>
        </div>
      </div>
    </article>
  );
}

function CompareSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((item) => (
          <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="mt-4 h-8 w-40 rounded bg-white/10" />
            <div className="mt-2 h-4 w-32 rounded bg-white/10" />
            <div className="mt-6 grid gap-3">
              {[0, 1, 2, 3].map((metric) => (
                <div key={metric} className="h-16 rounded-2xl bg-white/10" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="h-56 rounded-3xl border border-white/10 bg-white/[0.03]" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-3xl border border-white/10 bg-white/[0.03]" />
        <div className="h-80 rounded-3xl border border-white/10 bg-white/[0.03]" />
      </div>
    </div>
  );
}

export function CompareClient({
  initialComparison,
  initialDiffSummary,
  initialPlayer1,
  initialPlayer2
}: CompareClientProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [player1, setPlayer1] = useState(initialPlayer1);
  const [player2, setPlayer2] = useState(initialPlayer2);
  const [comparison, setComparison] = useState<PlayerComparison>(initialComparison);
  const [diffSummary, setDiffSummary] = useState<string[]>(initialDiffSummary);
  const [isLoading, setIsLoading] = useState(false);

  const leftLeading =
    comparison.left.overallWinrate + comparison.left.totalHours >
    comparison.right.overallWinrate + comparison.right.totalHours;
  const rightLeading =
    comparison.right.overallWinrate + comparison.right.totalHours >
    comparison.left.overallWinrate + comparison.left.totalHours;

  async function handleCompare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!player1.trim() || !player2.trim()) {
      showToast({
        variant: "error",
        title: "BattleTags obrigatorios",
        description: "Preencha os dois jogadores antes de comparar."
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/compare?player1=${encodeURIComponent(player1.trim())}&player2=${encodeURIComponent(player2.trim())}`,
        {
          method: "GET",
          cache: "no-store"
        }
      );

      const data = (await response.json()) as CompareResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Nao foi possivel comparar esses perfis.");
      }

      setComparison({
        left: data.player1,
        right: data.player2
      });
      setDiffSummary(data.diffSummary ?? []);

      router.replace(
        `/compare?player1=${encodeURIComponent(player1.trim())}&player2=${encodeURIComponent(player2.trim())}` as Route
      );
    } catch (error) {
      showToast({
        variant: "error",
        title: "Comparacao indisponivel",
        description:
          error instanceof Error ? error.message : "Nao foi possivel comparar os perfis."
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionShell
        title="Comparacao de jogadores"
        description="Digite dois BattleTags para comparar winrate, herois principais, tempo jogado e role principal."
      >
        <form onSubmit={handleCompare} className="grid gap-3 lg:grid-cols-[1fr,1fr,auto]">
          <input
            type="text"
            value={player1}
            onChange={(event) => setPlayer1(event.target.value)}
            placeholder="Primeiro BattleTag (ex: Thales#1234)"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-400 focus:bg-white/10"
            disabled={isLoading}
          />
          <input
            type="text"
            value={player2}
            onChange={(event) => setPlayer2(event.target.value)}
            placeholder="Segundo BattleTag (ex: Proper#1111)"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-400 focus:bg-white/10"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Comparar
          </button>
        </form>
      </SectionShell>

      {isLoading ? (
        <CompareSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <ComparisonCard
              label="Jogador 1"
              profile={comparison.left}
              isLeading={leftLeading}
            />
            <ComparisonCard
              label="Jogador 2"
              profile={comparison.right}
              isLeading={rightLeading}
            />
          </div>

          <SectionShell
            title="Resumo comparativo"
            description="Quem estiver melhor em winrate e volume de jogo ganha destaque visual."
          >
            <ComparisonGrid comparison={comparison} />
            {diffSummary.length > 0 ? (
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {diffSummary.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            ) : null}
          </SectionShell>

          <SectionShell
            title="Graficos comparativos"
            description="Visualizacao lado a lado para winrate e tempo jogado usando Recharts."
          >
            <CompareMetricsChart
              leftLabel={comparison.left.displayName}
              rightLabel={comparison.right.displayName}
              leftWinrate={comparison.left.overallWinrate}
              rightWinrate={comparison.right.overallWinrate}
              leftHours={comparison.left.totalHours}
              rightHours={comparison.right.totalHours}
            />
          </SectionShell>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionShell
              title={comparison.left.displayName}
              description={`Herois mais jogados de ${comparison.left.battleTag}`}
            >
              <HeroChart data={comparison.left.topHeroes} />
            </SectionShell>
            <SectionShell
              title={comparison.right.displayName}
              description={`Herois mais jogados de ${comparison.right.battleTag}`}
            >
              <HeroChart data={comparison.right.topHeroes} />
            </SectionShell>
          </div>
        </div>
      )}
    </div>
  );
}
