import { notFound } from "next/navigation";

import { MatchCard, NewsCard, PlayerCard, TeamCard, TournamentCard } from "@/components/ui/data-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionShell } from "@/components/ui/section-shell";
import { getNewsPostBySlug, listNews } from "@/lib/atlas-data";
import { formatDate } from "@/lib/presentation";

export default async function NewsDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const moreNews = await listNews({ page: 1, pageSize: 4 });

  return (
    <div className="space-y-6">
      <article className="glass-panel rounded-[36px] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
          {post.tag ?? "News"} · {formatDate(post.publishedAt)}
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold text-white">{post.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
          {post.excerpt ?? "Sem resumo estruturado para esta notícia."}
        </p>
        <div className="mt-8 rounded-[28px] border border-white/10 bg-slate-950/50 p-5 text-sm leading-7 text-slate-300">
          {post.body ?? "Conteúdo completo ainda não foi enriquecido por parser externo. TODO: estruturar body por blocos quando a integração editorial estiver finalizada."}
        </div>
      </article>

      <SectionShell title="Entidades relacionadas" description="Times, jogadores, torneios e partidas detectados a partir do conteúdo.">
        <div className="grid gap-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Times
            </h3>
            {post.relatedEntities.teams.length === 0 ? (
              <EmptyState title="Sem times relacionados" description="Nenhum time foi inferido no conteúdo desta matéria." />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {post.relatedEntities.teams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Jogadores
            </h3>
            {post.relatedEntities.players.length === 0 ? (
              <EmptyState title="Sem jogadores relacionados" description="Nenhum jogador foi inferido no conteúdo desta matéria." />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {post.relatedEntities.players.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Torneios
            </h3>
            {post.relatedEntities.tournaments.length === 0 ? (
              <EmptyState title="Sem torneios relacionados" description="Nenhum torneio foi inferido no conteúdo desta matéria." />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {post.relatedEntities.tournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Partidas
            </h3>
            {post.relatedEntities.matches.length === 0 ? (
              <EmptyState title="Sem partidas relacionadas" description="Nenhuma partida foi inferida no conteúdo desta matéria." />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {post.relatedEntities.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionShell>

      <SectionShell title="Mais notícias" description="Continue explorando o editorial sincronizado do produto.">
        <div className="grid gap-4 lg:grid-cols-2">
          {moreNews.items
            .filter((item) => item.slug !== post.slug)
            .slice(0, 4)
            .map((item) => (
              <NewsCard key={item.id} post={item} />
            ))}
        </div>
      </SectionShell>
    </div>
  );
}
