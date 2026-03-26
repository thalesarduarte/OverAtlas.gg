import { notFound } from "next/navigation";
import { HeroChart } from "@/components/stats/hero-chart";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/ui/section-shell";
import { profiles } from "@/lib/mock-data";

export default async function ProfilePage({ params }: { params: Promise<{ battleTag: string }> }) {
  const { battleTag } = await params;
  const profile = profiles[battleTag];

  if (!profile) notFound();

  return (
    <div className="space-y-6">
      <SectionShell title={profile.displayName} description="Página de perfil para BattleTag buscada dentro da plataforma.">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">BattleTag</p>
            <p className="mt-2 text-xl font-bold text-white">{profile.battleTag}</p>
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
            <p className="text-sm text-slate-400">Horas</p>
            <p className="mt-2 text-xl font-bold text-white">{profile.totalHours}h</p>
          </div>
        </div>
      </SectionShell>

      <SectionShell title="Top heroes" description="Gráfico inicial usando Recharts para win rate por herói.">
        <HeroChart data={profile.topHeroes} />
      </SectionShell>

      <SectionShell title="Detalhamento do perfil" description="Tabela compacta para futuras métricas por mapa, role, temporada e média por 10 minutos.">
        <div className="space-y-3">
          {profile.topHeroes.map((hero) => (
            <div key={hero.heroName} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{hero.heroName}</h3>
                  <p className="mt-1 text-sm text-slate-400">{hero.hoursPlayed}h jogadas</p>
                </div>
                <Badge>{hero.role}</Badge>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-4 text-sm text-slate-300">
                <div>Win rate: {hero.winrate}%</div>
                <div>Eliminações: {hero.eliminationsAvg ?? "-"}</div>
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
