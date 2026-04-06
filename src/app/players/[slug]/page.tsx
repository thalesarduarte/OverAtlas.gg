import { notFound } from "next/navigation";

import { MatchCard, NewsCard } from "@/components/ui/data-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionShell } from "@/components/ui/section-shell";
import { StatCard } from "@/components/ui/stat-card";
import { getPlayerBySlug } from "@/lib/atlas-data";

export default async function PlayerDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);

  if (!player) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[36px] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
          Player Overview
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white">{player.name}</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300">
          {player.description ?? "Perfil competitivo conectado ao banco principal do OverAtlas."}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <StatCard label="Role" value={player.role ?? "Flex"} />
          <StatCard label="Região" value={player.region ?? "Global"} />
          <StatCard label="Time atual" value={player.team?.name ?? "Sem time"} />
          <StatCard label="Histórico" value={String(player.history.length)} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <SectionShell title="Histórico de equipes" description="Passagens registradas nas fontes competitivas.">
          {player.history.length === 0 ? (
            <EmptyState title="Sem histórico" description="Nenhuma passagem de equipe foi registrada ainda." />
          ) : (
            <div className="grid gap-3">
              {player.history.map((entry) => (
                <div key={entry.id} className="glass-panel rounded-[24px] p-4">
                  <p className="font-semibold text-white">{entry.team.name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {entry.role ?? player.role ?? "Flex"} · {entry.isCurrent ? "Atual" : "Anterior"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionShell>

        <SectionShell title="Rosters e torneios" description="Participações que ajudam a compor o histórico do jogador.">
          {player.rosters.length === 0 ? (
            <EmptyState title="Sem rosters" description="Nenhuma entrada de roster está vinculada a este jogador." />
          ) : (
            <div className="grid gap-3">
              {player.rosters.map((entry) => (
                <div key={entry.id} className="glass-panel rounded-[24px] p-4">
                  <p className="font-semibold text-white">{entry.team.name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {entry.tournament?.name ?? "Sem torneio específico"} · {entry.role ?? player.role ?? "Flex"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionShell>
      </div>

      <SectionShell title="Partidas relacionadas" description="Matches ligados ao time atual do jogador.">
        {player.relatedMatches.length === 0 ? (
          <EmptyState title="Sem partidas relacionadas" description="Ainda não há matches conectadas a este perfil." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {player.relatedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </SectionShell>

      <SectionShell title="Notícias relacionadas" description="Cobertura editorial ligada ao nome ou contexto do jogador.">
        {player.relatedNews.length === 0 ? (
          <EmptyState title="Sem notícias relacionadas" description="Nenhuma matéria recente menciona este jogador na base atual." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {player.relatedNews.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </SectionShell>
    </div>
  );
}
