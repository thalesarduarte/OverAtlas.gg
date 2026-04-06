import Link from "next/link";
import { MatchStatus } from "@prisma/client";

import { FavoriteButton } from "@/components/favorites/favorite-button";
import { Badge } from "@/components/ui/badge";
import {
  formatDate,
  formatDateRange,
  formatDateTime,
  getStatusLabel,
  getStatusTone,
  getTournamentStatus
} from "@/lib/presentation";

export function TeamCard({
  team
}: {
  team: {
    slug: string;
    name: string;
    region?: string | null;
    shortName?: string | null;
    description?: string | null;
    rankings?: Array<{ position: number; tournament?: { shortName?: string | null; name: string } | null }>;
  };
}) {
  const ranking = team.rankings?.[0];

  return (
    <article className="glass-panel card-hover rounded-[30px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href={`/teams/${team.slug}`} className="text-xl font-semibold text-white">
            {team.name}
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            {team.region ?? "Global"} {team.shortName ? `· ${team.shortName}` : ""}
          </p>
        </div>
        <FavoriteButton type="TEAM" refId={team.slug} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">
        {team.description ?? "Equipe cadastrada na base competitiva do OverAtlas."}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {ranking ? (
          <Badge>{`#${ranking.position} ${ranking.tournament?.shortName ?? ranking.tournament?.name ?? ""}`}</Badge>
        ) : (
          <Badge>Sem ranking recente</Badge>
        )}
      </div>
    </article>
  );
}

export function PlayerCard({
  player
}: {
  player: {
    slug: string;
    name: string;
    role?: string | null;
    region?: string | null;
    description?: string | null;
    team?: { name: string } | null;
  };
}) {
  return (
    <article className="glass-panel card-hover rounded-[30px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href={`/players/${player.slug}`} className="text-xl font-semibold text-white">
            {player.name}
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            {player.role ?? "Flex"} · {player.team?.name ?? "Sem time atual"}
          </p>
        </div>
        <FavoriteButton type="PLAYER" refId={player.slug} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">
        {player.description ?? `${player.region ?? "Global"} · jogador listado na base competitiva.`}
      </p>
    </article>
  );
}

export function TournamentCard({
  tournament
}: {
  tournament: {
    slug: string;
    name: string;
    shortName?: string | null;
    prizePool?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    description?: string | null;
  };
}) {
  const status = getTournamentStatus(tournament.startDate, tournament.endDate);

  return (
    <article className="glass-panel card-hover rounded-[30px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href={`/tournaments/${tournament.slug}`} className="text-xl font-semibold text-white">
            {tournament.name}
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            {formatDateRange(tournament.startDate, tournament.endDate)}
          </p>
        </div>
        <FavoriteButton type="TOURNAMENT" refId={tournament.slug} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{getStatusLabel(status)}</Badge>
        {tournament.prizePool ? <Badge>{tournament.prizePool}</Badge> : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">
        {tournament.description ?? "Campeonato sincronizado pelas fontes competitivas do OverAtlas."}
      </p>
    </article>
  );
}

export function MatchCard({
  match
}: {
  match: {
    slug: string;
    status: MatchStatus;
    scheduledAt?: Date | null;
    scoreHome?: number | null;
    scoreAway?: number | null;
    homeTeam?: { name: string } | null;
    awayTeam?: { name: string } | null;
    tournament?: { name: string } | null;
    stage?: { name: string } | null;
  };
}) {
  return (
    <article className="glass-panel card-hover rounded-[30px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href={`/matches/${match.slug}`} className="text-lg font-semibold text-white">
            {match.homeTeam?.name ?? "TBD"} vs {match.awayTeam?.name ?? "TBD"}
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            {match.tournament?.name ?? "Torneio a confirmar"}
            {match.stage ? ` · ${match.stage.name}` : ""}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(match.status)}`}
        >
          {getStatusLabel(match.status)}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
        <span>{formatDateTime(match.scheduledAt)}</span>
        <span>
          {match.scoreHome ?? "-"} : {match.scoreAway ?? "-"}
        </span>
      </div>
    </article>
  );
}

export function NewsCard({
  post
}: {
  post: {
    slug: string;
    title: string;
    excerpt?: string | null;
    tag?: string | null;
    publishedAt?: Date | null;
  };
}) {
  return (
    <article className="glass-panel card-hover rounded-[30px] p-5">
      <div className="flex flex-wrap items-center gap-2">
        {post.tag ? <Badge>{post.tag}</Badge> : null}
        <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
          {formatDate(post.publishedAt)}
        </span>
      </div>
      <Link href={`/news/${post.slug}`} className="mt-4 block text-lg font-semibold text-white">
        {post.title}
      </Link>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {post.excerpt ?? "Cobertura recente sincronizada pelas fontes editoriais do OverAtlas."}
      </p>
    </article>
  );
}

export function RankingTable({
  rankings
}: {
  rankings: Array<{
    id: string;
    position: number;
    points?: number | null;
    record?: string | null;
    team: { slug: string; name: string };
    tournament?: { name: string } | null;
  }>;
}) {
  return (
    <div className="glass-panel overflow-hidden rounded-[30px]">
      <div className="grid grid-cols-[72px,1fr,120px,160px] gap-3 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.25em] text-slate-500">
        <span>Pos</span>
        <span>Time</span>
        <span>Pontos</span>
        <span>Record</span>
      </div>
      <div className="divide-y divide-white/5">
        {rankings.map((ranking) => (
          <div key={ranking.id} className="grid grid-cols-[72px,1fr,120px,160px] gap-3 px-5 py-4 text-sm text-slate-200">
            <span className="font-semibold text-white">#{ranking.position}</span>
            <div>
              <Link href={`/teams/${ranking.team.slug}`} className="font-semibold text-white">
                {ranking.team.name}
              </Link>
              {ranking.tournament ? (
                <p className="mt-1 text-xs text-slate-500">{ranking.tournament.name}</p>
              ) : null}
            </div>
            <span>{ranking.points ?? "-"}</span>
            <span>{ranking.record ?? "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
