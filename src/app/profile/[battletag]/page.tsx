import Link from "next/link";

import { HeroChart } from "@/components/stats/hero-chart";
import { ProfilePerformanceCharts } from "@/components/stats/profile-performance-charts";
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
        description="Nao encontramos dados para esse BattleTag nem no cache local nem na OverFast."
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
        description="Perfil carregado via OverFast com cache em banco e fallback para o ultimo cache valido."
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
            <p className="text-sm text-slate-400">Fonte</p>
            <p className="mt-2 text-xl font-bold text-white">{profile.source}</p>
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
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">
          Ultima atualizacao: {new Date(profile.lastUpdated).toLocaleString("pt-BR")}
        </div>
      </SectionShell>

      <SectionShell
        title="Painel de desempenho"
        description="Leitura visual do desempenho por heroi, volume de jogo e distribuicao por role."
      >
        <ProfilePerformanceCharts data={profile.topHeroes} />
      </SectionShell>

      <SectionShell
        title="Recorte rapido de winrate"
        description="Leitura condensada do winrate dos herois mais usados."
      >
        <HeroChart data={profile.topHeroes} />
      </SectionShell>

      <SectionShell
        title="Detalhamento do perfil"
        description="Resumo por heroi para apoiar comparacao e leitura rapida do desempenho."
      >
        {profile.topHeroes.length > 0 ? (
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
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
            A OverFast nao retornou herois suficientes para montar este recorte.
          </div>
        )}
      </SectionShell>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <SectionShell
          title="Resumo por role"
          description="Distribuicao das roles jogadas no perfil atual."
        >
          {profile.roles.length > 0 ? (
            <div className="grid gap-3">
              {profile.roles.map((role) => (
                <div
                  key={role.role}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300"
                >
                  <p className="font-semibold text-white">{role.role}</p>
                  <p className="mt-2">
                    {role.hoursPlayed}h · {role.averageWinrate}% de winrate medio
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
              Ainda nao ha distribuicao por role disponivel para este perfil.
            </div>
          )}
        </SectionShell>

        <SectionShell
          title="Recorte por mapas"
          description="A OverFast nao documenta um recorte por mapa neste payload, entao este bloco fica pronto para uma fonte futura mais detalhada."
        >
          {profile.maps.length > 0 ? (
            <div className="grid gap-3">
              {profile.maps.map((map) => (
                <div
                  key={map.mapName}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300"
                >
                  <p className="font-semibold text-white">{map.mapName}</p>
                  <p className="mt-2">
                    {map.mode} · {map.winrate}% · {map.hoursPlayed}h
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
              Ainda nao ha um recorte por mapa disponivel para este perfil.
            </div>
          )}
        </SectionShell>
      </div>
    </div>
  );
}
