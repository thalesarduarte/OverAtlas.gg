import type { OfficialSnapshot } from "@/lib/ingest/connectors/types";
import { normalizedBundleSchema } from "@/lib/ingest/normalizers/schemas";
import {
  buildAliases,
  buildEntityIdentity,
  buildExternalRef,
  buildMatchIdentity,
  toDateOrNull
} from "@/lib/ingest/normalizers/helpers";

export function normalizeOfficialSnapshot(snapshot: OfficialSnapshot) {
  const rankingsByTeam = new Map(
    snapshot.rankings.map((ranking) => [ranking.teamName.toLowerCase(), ranking] as const)
  );

  const teams = snapshot.teams.map((team) => {
    const identity = buildEntityIdentity(team.displayName, team.aliases ?? []);
    const ranking =
      rankingsByTeam.get(team.displayName.toLowerCase()) ??
      (team.aliases ?? [])
        .map((alias) => rankingsByTeam.get(alias.toLowerCase()))
        .find(Boolean);

    return {
      name: team.displayName,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      shortName: team.shortName,
      region: team.region,
      logoUrl: team.logoUrl,
      description: team.summary,
      aliases: identity.aliases,
      externalRefs: [buildExternalRef("OFFICIAL", "TEAM", team.id)],
      ranking: ranking
        ? {
            position: ranking.position,
            tournamentName: ranking.tournamentName,
            tournamentAliases: ranking.tournamentName ? buildAliases(ranking.tournamentName, []) : [],
            points: ranking.points,
            wins: ranking.wins,
            losses: ranking.losses,
            draws: ranking.draws,
            record: ranking.record,
            sourceLabel: "Official Rankings",
            externalRefs: [buildExternalRef("OFFICIAL", "TEAM_RANKING", ranking.id)]
          }
        : undefined,
      roster: (team.roster ?? []).map((member) => {
        const memberIdentity = buildEntityIdentity(member.handle, member.aliases ?? []);

        return {
          name: member.handle,
          canonicalName: memberIdentity.canonicalName,
          aliases: memberIdentity.aliases,
          role: member.role,
          externalRefs: [buildExternalRef("OFFICIAL", "PLAYER", member.id)]
        };
      })
    };
  });

  const players = snapshot.players.map((player) => {
    const identity = buildEntityIdentity(player.handle, player.aliases ?? []);

    return {
      name: player.handle,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      realName: player.realName,
      region: player.region,
      role: player.role,
      photoUrl: player.photoUrl,
      description: player.summary,
      aliases: identity.aliases,
      currentTeamName: player.currentTeam,
      currentTeamAliases: player.currentTeam ? buildAliases(player.currentTeam, []) : [],
      externalRefs: [buildExternalRef("OFFICIAL", "PLAYER", player.id)]
    };
  });

  const tournaments = snapshot.tournaments.map((tournament) => {
    const identity = buildEntityIdentity(tournament.displayName, tournament.aliases ?? []);

    return {
      name: tournament.displayName,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      shortName: tournament.shortName,
      location: tournament.location,
      startDate: toDateOrNull(tournament.startDate),
      endDate: toDateOrNull(tournament.endDate),
      prizePool: tournament.prizePool,
      description: tournament.summary,
      aliases: identity.aliases,
      aliasCanonicalNames: identity.aliasCanonicalNames,
      externalRefs: [buildExternalRef("OFFICIAL", "TOURNAMENT", tournament.id)],
      stages: (tournament.stages ?? []).map((stage) => {
        const stageIdentity = buildEntityIdentity(stage.name, stage.aliases ?? []);

        return {
          name: stage.name,
          canonicalName: stageIdentity.canonicalName,
          slug: stageIdentity.slug,
          stageType: stage.type,
          order: stage.order,
          startDate: toDateOrNull(stage.startDate),
          endDate: toDateOrNull(stage.endDate),
          aliases: stageIdentity.aliases,
          aliasCanonicalNames: stageIdentity.aliasCanonicalNames,
          externalRefs: [buildExternalRef("OFFICIAL", "TOURNAMENT_STAGE", stage.id)]
        };
      })
    };
  });

  const matches = snapshot.matches.map((match) => {
    const identity = buildMatchIdentity(
      match.tournamentName,
      match.homeTeam,
      match.awayTeam,
      match.scheduledAt
    );

    return {
      name: identity.name,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      tournamentName: match.tournamentName,
      tournamentAliases: buildAliases(match.tournamentName, match.tournamentAliases ?? []),
      stageName: match.stageName,
      homeTeamName: match.homeTeam,
      homeTeamAliases: buildAliases(match.homeTeam, []),
      awayTeamName: match.awayTeam,
      awayTeamAliases: buildAliases(match.awayTeam, []),
      winnerTeamName: match.winnerTeam,
      status: match.status ?? "SCHEDULED",
      scheduledAt: toDateOrNull(match.scheduledAt),
      completedAt: toDateOrNull(match.completedAt),
      bestOf: match.bestOf,
      scoreHome: match.scoreHome,
      scoreAway: match.scoreAway,
      vodUrl: match.vodUrl,
      sourceLabel: "Official Connector",
      externalRefs: [buildExternalRef("OFFICIAL", "MATCH", match.id)]
    };
  });

  const newsPosts = snapshot.newsPosts.map((post) => {
    const identity = buildEntityIdentity(post.title, []);

    return {
      title: post.title,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      excerpt: post.excerpt,
      body: post.body,
      tag: post.tag,
      url: post.url,
      imageUrl: post.imageUrl,
      source: "OFFICIAL" as const,
      publishedAt: toDateOrNull(post.publishedAt),
      externalRefs: [buildExternalRef("OFFICIAL", "NEWS_POST", post.id)]
    };
  });

  return normalizedBundleSchema.parse({
    teams,
    players,
    tournaments,
    matches,
    newsPosts
  });
}
