import { notFound } from "next/navigation";

import { MatchCard, NewsCard, RankingTable } from "@/components/ui/data-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionShell } from "@/components/ui/section-shell";
import { StatCard } from "@/components/ui/stat-card";
import { getTeamBySlug } from "@/lib/atlas-data";

export default async function TeamDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[36px] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
          Team Overview
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white">{team.name}</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300">
          {team.description ?? "Equipe sincronizada pelo pipeline competitivo do OverAtlas."}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Região" value={team.region ?? "Global"} />
          <StatCard label="Roster ativo" value={String(team.rosters.filter((item) => item.isActive).length)} />
          <StatCard label="Rankings" value={String(team.rankings.length)} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <SectionShell title="Roster atual" description="Jogadores ativos e contexto de lineup.">
          {team.rosters.length === 0 ? (
            <EmptyState title="Roster vazio" description="Ainda não há lineup registrado para este time." />
          ) : (
            <div className="grid gap-3">
              {team.rosters.map((entry) => (
                <div key={entry.id} className="glass-panel rounded-[24px] p-4">
                  <p className="font-semibold text-white">{entry.player.name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {entry.role ?? entry.player.role ?? "Flex"} · {entry.isActive ? "Ativo" : "Inativo"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionShell>

        <SectionShell title="Histórico de jogadores" description="Passagens registradas na base atual.">
          {team.history.length === 0 ? (
            <EmptyState title="Sem histórico" description="Nenhuma movimentação histórica registrada ainda." />
          ) : (
            <div className="grid gap-3">
              {team.history.map((entry) => (
                <div key={entry.id} className="glass-panel rounded-[24px] p-4">
                  <p className="font-semibold text-white">{entry.player.name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {entry.role ?? entry.player.role ?? "Flex"} · {entry.isCurrent ? "Atual" : "Histórico"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionShell>
      </div>

      <SectionShell title="Resultados e partidas recentes" description="Últimos confrontos ligados a este time.">
        {team.recentMatches.length === 0 ? (
          <EmptyState title="Sem partidas" description="Nenhuma partida recente foi vinculada a este time." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {team.recentMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </SectionShell>

      <SectionShell title="Rankings" description="Posições e standings mais recentes para esta organização.">
        {team.rankings.length === 0 ? (
          <EmptyState title="Sem ranking" description="Ainda não há ranking sincronizado para este time." />
        ) : (
          <RankingTable
            rankings={team.rankings.map((ranking) => ({
              id: ranking.id,
              position: ranking.position,
              points: ranking.points,
              record: ranking.record,
              team: {
                slug: team.slug,
                name: team.name
              },
              tournament: ranking.tournament
            }))}
          />
        )}
      </SectionShell>

      <SectionShell title="Notícias relacionadas" description="Cobertura editorial vinculada por contexto e nomes.">
        {team.relatedNews.length === 0 ? (
          <EmptyState title="Sem notícias relacionadas" description="Nenhuma matéria recente menciona este time na base atual." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {team.relatedNews.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </SectionShell>
    </div>
  );
}
