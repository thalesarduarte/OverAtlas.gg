import type { LiquipediaSnapshot } from "@/lib/ingest/connectors/types";
import { normalizedBundleSchema } from "@/lib/ingest/normalizers/schemas";
import {
  buildAliases,
  buildEntityIdentity,
  buildExternalRef,
  buildMatchIdentity,
  toDateOrNull
} from "@/lib/ingest/normalizers/helpers";

export function normalizeLiquipediaSnapshot(snapshot: LiquipediaSnapshot) {
  const rosterEntriesByTeam = new Map<string, LiquipediaSnapshot["rosterEntries"]>();

  for (const entry of snapshot.rosterEntries) {
    const keys = [entry.team, ...(entry.teamAliases ?? [])].map((value) => value.toLowerCase());
    for (const key of keys) {
      const current = rosterEntriesByTeam.get(key) ?? [];
      current.push(entry);
      rosterEntriesByTeam.set(key, current);
    }
  }

  const teams = snapshot.teams.map((team) => {
    const identity = buildEntityIdentity(team.name, team.aliases ?? []);
    const rosterEntries = rosterEntriesByTeam.get(team.name.toLowerCase()) ?? [];

    return {
      name: team.name,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      shortName: team.acronym,
      region: team.region,
      logoUrl: team.logo,
      description: team.description,
      aliases: identity.aliases,
      externalRefs: [buildExternalRef("LIQUIPEDIA", "TEAM", team.pageId)],
      roster: rosterEntries.map((member) => {
        const memberIdentity = buildEntityIdentity(member.player, member.playerAliases ?? []);

        return {
          name: member.player,
          canonicalName: memberIdentity.canonicalName,
          aliases: memberIdentity.aliases,
          role: member.role,
          joinedAt: toDateOrNull(member.joinedAt),
          leftAt: toDateOrNull(member.leftAt),
          isActive: member.isActive,
          externalRefs: [buildExternalRef("LIQUIPEDIA", "PLAYER", member.pageId)]
        };
      })
    };
  });

  const players = snapshot.players.map((player) => {
    const identity = buildEntityIdentity(player.tag, player.aliases ?? []);
    const activeRosterEntry = snapshot.rosterEntries.find((entry) => {
      const candidates = [entry.player, ...(entry.playerAliases ?? [])].map((value) =>
        value.toLowerCase()
      );

      return candidates.includes(player.tag.toLowerCase()) && entry.isActive !== false;
    });
    const currentTeamName = activeRosterEntry?.team ?? player.team;
    const currentTeamAliases = activeRosterEntry?.teamAliases ?? [];

    return {
      name: player.tag,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      realName: player.realName,
      region: player.region,
      role: player.role,
      photoUrl: player.image,
      description: player.description,
      aliases: identity.aliases,
      currentTeamName,
      currentTeamAliases: currentTeamName
        ? buildAliases(currentTeamName, currentTeamAliases)
        : [],
      externalRefs: [buildExternalRef("LIQUIPEDIA", "PLAYER", player.pageId)]
    };
  });

  const tournaments = snapshot.tournaments.map((tournament) => {
    const identity = buildEntityIdentity(tournament.name, tournament.aliases ?? []);

    return {
      name: tournament.name,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      shortName: tournament.shortName,
      location: tournament.location,
      startDate: toDateOrNull(tournament.startDate),
      endDate: toDateOrNull(tournament.endDate),
      prizePool: tournament.prizePool,
      description: tournament.description,
      aliases: identity.aliases,
      aliasCanonicalNames: identity.aliasCanonicalNames,
      externalRefs: [buildExternalRef("LIQUIPEDIA", "TOURNAMENT", tournament.pageId)],
      stages: (tournament.stages ?? []).map((stage) => {
        const stageIdentity = buildEntityIdentity(stage.name, stage.aliases ?? []);

        return {
          name: stage.name,
          canonicalName: stageIdentity.canonicalName,
          slug: stageIdentity.slug,
          stageType: stage.stageType,
          order: stage.order,
          startDate: toDateOrNull(stage.startDate),
          endDate: toDateOrNull(stage.endDate),
          aliases: stageIdentity.aliases,
          aliasCanonicalNames: stageIdentity.aliasCanonicalNames,
          externalRefs: [buildExternalRef("LIQUIPEDIA", "TOURNAMENT_STAGE", stage.pageId)]
        };
      })
    };
  });

  const matches = snapshot.matchSummaries.map((match) => {
    const identity = buildMatchIdentity(
      match.tournament,
      match.team1,
      match.team2,
      match.date
    );

    return {
      name: identity.name,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      tournamentName: match.tournament,
      tournamentAliases: buildAliases(match.tournament, match.tournamentAliases ?? []),
      stageName: match.phase,
      homeTeamName: match.team1,
      homeTeamAliases: buildAliases(match.team1, match.team1Aliases ?? []),
      awayTeamName: match.team2,
      awayTeamAliases: buildAliases(match.team2, match.team2Aliases ?? []),
      winnerTeamName: match.winner,
      status: match.state ?? "SCHEDULED",
      scheduledAt: toDateOrNull(match.date),
      completedAt: toDateOrNull(match.endDate),
      bestOf: match.bestOf,
      scoreHome: match.score1,
      scoreAway: match.score2,
      vodUrl: match.vod,
      sourceLabel: "Liquipedia Connector",
      externalRefs: [buildExternalRef("LIQUIPEDIA", "MATCH", match.pageId)]
    };
  });

  return normalizedBundleSchema.parse({
    teams,
    players,
    tournaments,
    matches,
    newsPosts: []
  });
}
