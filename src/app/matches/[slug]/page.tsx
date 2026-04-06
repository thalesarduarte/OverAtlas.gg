import { notFound } from "next/navigation";

import { NewsCard } from "@/components/ui/data-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionShell } from "@/components/ui/section-shell";
import { StatCard } from "@/components/ui/stat-card";
import { getMatchBySlug } from "@/lib/atlas-data";
import { formatDateTime } from "@/lib/presentation";

export default async function MatchDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const match = await getMatchBySlug(slug);

  if (!match) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[36px] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Match Overview</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">
          {match.homeTeam?.name ?? "TBD"} vs {match.awayTeam?.name ?? "TBD"}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300">
          {match.tournament?.name ?? "Torneio a confirmar"}
          {match.stage ? ` · ${match.stage.name}` : ""}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <StatCard label="Status" value={match.status} />
          <StatCard label="Data" value={formatDateTime(match.scheduledAt)} />
          <StatCard label="Score" value={`${match.scoreHome ?? "-"} : ${match.scoreAway ?? "-"}`} />
          <StatCard label="Best of" value={match.bestOf ? `Bo${match.bestOf}` : "N/A"} />
        </div>
      </section>

      <SectionShell title="Detalhes da partida" description="Contexto principal para leitura rápida do confronto.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Time da esquerda" value={match.homeTeam?.name ?? "TBD"} />
          <StatCard label="Time da direita" value={match.awayTeam?.name ?? "TBD"} />
          <StatCard label="Vencedor" value={match.winnerTeam?.name ?? "A definir"} />
          <StatCard label="VOD" value={match.vodUrl ? "Disponível" : "Indisponível"} />
        </div>
      </SectionShell>

      <SectionShell title="Notícias relacionadas" description="Cobertura editorial ligada ao torneio ou aos times do confronto.">
        {match.relatedNews.length === 0 ? (
          <EmptyState title="Sem notícias relacionadas" description="Nenhuma notícia relacionada foi encontrada para esta partida." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {match.relatedNews.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </SectionShell>
    </div>
  );
}
