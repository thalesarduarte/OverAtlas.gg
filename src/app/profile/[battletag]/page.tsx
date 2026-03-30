import Link from "next/link";

import { HeroChart } from "@/components/stats/hero-chart";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/ui/section-shell";
import { getPlayerProfile } from "@/lib/profile-service";

export default async function ProfilePage({
  params
}: {
  params: Promise<{ battletag: string }>;
}) {
  const { battletag } = await params;
  const requestedBattleTag = decodeURIComponent(battletag);
  const profile = await getPlayerProfile(requestedBattleTag);

  if (!profile) {
    return (
      <SectionShell
        title="Perfil nao encontrado"
        description="Nao encontramos dados para esse BattleTag no cache nem na fonte mockada."
      >
        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-sm text-red-100">
          <p>
            Verifique se o BattleTag foi digitado corretamente, por exemplo:
            {" "}
            <strong>Proper#1111</strong>.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/5"
          >
            Voltar para a home
          </Link>
        </div>
      </SectionShell>
    );
  }

  return (
    <div className="space-y-6">
      <SectionShell
        title={profile.displayName}
        description="Pagina de perfil carregada via busca de BattleTag com cache de 5 minutos."
      >
        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">BattleTag</p>
            <p className="mt-2 text-xl font-bold text-white">{profile.battleTag}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Role principal</p>
            <p className="mt-2 text-xl font-bold text-white">{profile.mainRole}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Resumo</p>
            <p className="mt-2 text-xl font-bold text-white">{profile.rankSummary}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Win rate</p>
            <p className="mt-2 text-xl font-bold text-white">{profile.overallWinrate}%</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Tempo jogado</p>
            <p className="mt-2 text-xl font-bold text-white">{profile.totalHours}h</p>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        title="Herois mais jogados"
        description="Grafico inicial com os herois mais jogados, taxa de vitoria e tempo total."
      >
        <HeroChart data={profile.topHeroes} />
      </SectionShell>

      <SectionShell
        title="Detalhamento do perfil"
        description="Resumo por heroi para apoiar comparacao e leitura rapida do desempenho."
      >
        <div className="space-y-3">
          {profile.topHeroes.map((hero) => (
            <div
              key={hero.heroName}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{hero.heroName}</h3>
                  <p className="mt-1 text-sm text-slate-400">{hero.hoursPlayed}h jogadas</p>
                </div>
                <Badge>{hero.role}</Badge>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-4">
                <div>Win rate: {hero.winrate}%</div>
                <div>Eliminacoes: {hero.eliminationsAvg ?? "-"}</div>
                <div>Mortes: {hero.deathsAvg ?? "-"}</div>
                <div>Dano: {hero.damageAvg ?? "-"}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}
