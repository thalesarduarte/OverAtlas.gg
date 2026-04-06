import Link from "next/link";
import { ArrowRight, Radar, Swords } from "lucide-react";

import { ProfileSearch } from "@/components/layout/profile-search";
import { HomeFeed } from "@/components/sections/home-feed";
import { TeamCard, PlayerCard, TournamentCard, MatchCard, NewsCard, RankingTable } from "@/components/ui/data-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionShell } from "@/components/ui/section-shell";
import { StatCard } from "@/components/ui/stat-card";
import { getHomeDashboardData } from "@/lib/atlas-data";

export default async function HomePage() {
  const dashboard = await getHomeDashboardData();

  return (
    <div className="space-y-8">
      <section className="glass-panel overflow-hidden rounded-[36px] p-6 md:p-8 xl:p-10">
        <div className="grid gap-10 xl:grid-cols-[1.25fr,0.75fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
              Overwatch Esports Intelligence
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl xl:text-6xl">
              O hub principal para acompanhar o ecossistema competitivo de Overwatch.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              Times, jogadores, rankings, partidas, notícias e perfis em uma experiência
              de produto pensada para parecer pronta, não improvisada.
            </p>
            <div className="mt-8 max-w-2xl">
              <ProfileSearch />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                Comparar perfis
                <Swords className="h-4 w-4" />
              </Link>
              <Link
                href="/tournaments"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/5"
              >
                Explorar campeonatos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <StatCard
              label="Eventos sincronizados"
              value={String(dashboard.featuredTournaments.length)}
              helper="Baseada nas fontes official, Liquipedia e OWTV."
            />
            <StatCard
              label="Partidas em foco"
              value={String(dashboard.featuredMatches.length)}
              helper="Ao vivo, próximas e recentes, em um só painel."
            />
            <StatCard
              label="Editorial recente"
              value={String(dashboard.latestNews.length)}
              helper="Notícias unificadas para navegar sem sair do produto."
            />
          </div>
        </div>
      </section>

      <HomeFeed />

      <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <SectionShell
          title="Campeonatos em destaque"
          description="Calendário principal da temporada e eventos mais quentes da base."
        >
          {dashboard.featuredTournaments.length === 0 ? (
            <EmptyState
              title="Nenhum campeonato sincronizado ainda"
              description="Execute um sync administrativo para popular o calendário principal."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {dashboard.featuredTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </SectionShell>

        <SectionShell
          title="Standings e rankings"
          description="Leitura rápida das equipes com melhor posição na base atual."
        >
          {dashboard.rankings.length === 0 ? (
            <EmptyState
              title="Sem rankings disponíveis"
              description="Os rankings entram automaticamente conforme as fontes de ingestão sincronizam."
            />
          ) : (
            <RankingTable rankings={dashboard.rankings} />
          )}
        </SectionShell>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <SectionShell
          title="Partidas em destaque"
          description="Ao vivo ou agendadas em breve, com acesso direto para a página da match."
        >
          {dashboard.featuredMatches.length === 0 ? (
            <EmptyState
              title="Nenhuma partida disponível"
              description="As partidas aparecerão aqui conforme os conectores abastecem a agenda."
            />
          ) : (
            <div className="grid gap-4">
              {dashboard.featuredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </SectionShell>

        <SectionShell
          title="Cobertura recente"
          description="Notícias e recaps sincronizados no banco e exibidos como produto editorial real."
        >
          {dashboard.latestNews.length === 0 ? (
            <EmptyState
              title="Nenhuma notícia ainda"
              description="As fontes editoriais alimentam este bloco assim que o sync roda."
            />
          ) : (
            <div className="grid gap-4">
              {dashboard.latestNews.slice(0, 4).map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </SectionShell>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <SectionShell
          title="Times populares"
          description="Organizações com histórico, rankings e páginas individuais navegáveis."
        >
          {dashboard.featuredTeams.length === 0 ? (
            <EmptyState
              title="Sem times na base"
              description="Rode os syncs para começar a explorar os times sincronizados."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {dashboard.featuredTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </SectionShell>

        <SectionShell
          title="Jogadores em destaque"
          description="Perfis competitivos conectados às equipes e ao histórico armazenado."
        >
          {dashboard.featuredPlayers.length === 0 ? (
            <EmptyState
              title="Sem jogadores disponíveis"
              description="Os jogadores aparecem aqui conforme roster e histórico entram na base."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {dashboard.featuredPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </SectionShell>
      </div>

      <SectionShell
        title="Explorar perfis de Overwatch"
        description="Ferramentas rápidas para tracker de perfil, comparação e leitura da base competitiva."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/profile/Proper%231111"
            className="glass-panel card-hover rounded-[28px] p-5"
          >
            <Radar className="h-5 w-5 text-cyan-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">Buscar BattleTag</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Abra perfis, gráficos e resumo competitivo em uma tela focada em performance.
            </p>
          </Link>
          <Link href="/compare" className="glass-panel card-hover rounded-[28px] p-5">
            <Swords className="h-5 w-5 text-cyan-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">Comparar jogadores</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Diferenças lado a lado com métricas, gráficos e leitura rápida de vantagem.
            </p>
          </Link>
          <Link href="/teams" className="glass-panel card-hover rounded-[28px] p-5">
            <ArrowRight className="h-5 w-5 text-cyan-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">Entrar na wiki viva</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Times, jogadores, torneios, matches e editorial navegando direto do banco.
            </p>
          </Link>
        </div>
      </SectionShell>
    </div>
  );
}
