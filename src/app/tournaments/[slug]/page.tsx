import { notFound } from "next/navigation";

import { MatchCard, NewsCard, RankingTable, TeamCard } from "@/components/ui/data-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionShell } from "@/components/ui/section-shell";
import { StatCard } from "@/components/ui/stat-card";
import { getTournamentBySlug } from "@/lib/atlas-data";
import { formatDateRange } from "@/lib/presentation";

export default async function TournamentDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = await getTournamentBySlug(slug);

  if (!tournament) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[36px] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
          Tournament Overview
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white">{tournament.name}</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300">
          {tournament.description ?? "Campeonato sincronizado pelas fontes principais do ecossistema."}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <StatCard label="Status" value={tournament.derivedStatus} />
          <StatCard label="Período" value={formatDateRange(tournament.startDate, tournament.endDate)} />
          <StatCard label="Prize pool" value={tournament.prizePool ?? "A confirmar"} />
          <StatCard label="Local" value={tournament.location ?? "A confirmar"} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <SectionShell title="Estágios" description="Estrutura de fases e ordem competitiva.">
          {tournament.stages.length === 0 ? (
            <EmptyState title="Sem estágios" description="A estrutura de fases ainda não foi sincronizada." />
          ) : (
            <div className="grid gap-3">
              {tournament.stages.map((stage) => (
                <div key={stage.id} className="glass-panel rounded-[24px] p-4">
                  <p className="font-semibold text-white">{stage.name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {stage.stageType ?? "Fase"} · Ordem {stage.order ?? "-"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionShell>

        <SectionShell title="Participantes e standings" description="Equipes registradas via rankings e resultados.">
          {tournament.rankings.length === 0 ? (
            <EmptyState title="Sem standings" description="Nenhum ranking foi vinculado a este torneio ainda." />
          ) : (
            <RankingTable
              rankings={tournament.rankings.map((ranking) => ({
                id: ranking.id,
                position: ranking.position,
                points: ranking.points,
                record: ranking.record,
                team: ranking.team,
                tournament
              }))}
            />
          )}
        </SectionShell>
      </div>

      <SectionShell title="Times participantes" description="Organizações ligadas ao torneio por ranking e roster.">
        {tournament.participants.length === 0 ? (
          <EmptyState title="Sem participantes" description="Ainda não há times claramente associados a este torneio." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {tournament.participants.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </SectionShell>

      <SectionShell title="Partidas" description="Agenda e resultados do torneio.">
        {tournament.matches.length === 0 ? (
          <EmptyState title="Sem partidas" description="A agenda deste torneio ainda não foi sincronizada." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {tournament.matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </SectionShell>

      <SectionShell title="Notícias relacionadas" description="Cobertura editorial ligada ao torneio.">
        {tournament.relatedNews.length === 0 ? (
          <EmptyState title="Sem notícias relacionadas" description="Nenhuma matéria recente menciona este torneio na base atual." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {tournament.relatedNews.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </SectionShell>
    </div>
  );
}
