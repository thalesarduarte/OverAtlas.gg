import type { OWTVSnapshot } from "@/lib/ingest/connectors/types";
import { normalizedBundleSchema } from "@/lib/ingest/normalizers/schemas";
import {
  buildAliases,
  buildEntityIdentity,
  buildExternalRef,
  buildMatchIdentity,
  toDateOrNull
} from "@/lib/ingest/normalizers/helpers";

export function normalizeOWTVSnapshot(snapshot: OWTVSnapshot) {
  const teams = snapshot.teams.map((team) => {
    const identity = buildEntityIdentity(team.title, team.knownAs ?? []);

    return {
      name: team.title,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      shortName: team.shortLabel,
      region: team.regionCode,
      logoUrl: team.logo,
      description: team.blurb,
      aliases: identity.aliases,
      externalRefs: [buildExternalRef("OWTV", "TEAM", team.key)],
      roster: (team.players ?? []).map((member) => {
        const memberIdentity = buildEntityIdentity(member.name, member.knownAs ?? []);

        return {
          name: member.name,
          canonicalName: memberIdentity.canonicalName,
          aliases: memberIdentity.aliases,
          role: member.role,
          externalRefs: [buildExternalRef("OWTV", "PLAYER", member.key)]
        };
      })
    };
  });

  const players = snapshot.players.map((player) => {
    const identity = buildEntityIdentity(player.name, player.knownAs ?? []);

    return {
      name: player.name,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      realName: player.fullName,
      region: player.regionCode,
      role: player.primaryRole,
      photoUrl: player.imageUrl,
      description: player.blurb,
      aliases: identity.aliases,
      currentTeamName: player.activeTeam,
      currentTeamAliases: player.activeTeam ? buildAliases(player.activeTeam, []) : [],
      externalRefs: [buildExternalRef("OWTV", "PLAYER", player.key)]
    };
  });

  const tournaments = snapshot.tournaments.map((tournament) => {
    const identity = buildEntityIdentity(tournament.title, tournament.knownAs ?? []);

    return {
      name: tournament.title,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      shortName: tournament.shortLabel,
      location: tournament.city,
      startDate: toDateOrNull(tournament.startsOn),
      endDate: toDateOrNull(tournament.endsOn),
      prizePool: tournament.prizePool,
      description: tournament.blurb,
      aliases: identity.aliases,
      aliasCanonicalNames: identity.aliasCanonicalNames,
      externalRefs: [buildExternalRef("OWTV", "TOURNAMENT", tournament.key)],
      stages: (tournament.phases ?? []).map((stage) => {
        const stageIdentity = buildEntityIdentity(stage.title, stage.knownAs ?? []);

        return {
          name: stage.title,
          canonicalName: stageIdentity.canonicalName,
          slug: stageIdentity.slug,
          stageType: stage.phaseType,
          order: stage.order,
          startDate: toDateOrNull(stage.startsOn),
          endDate: toDateOrNull(stage.endsOn),
          aliases: stageIdentity.aliases,
          aliasCanonicalNames: stageIdentity.aliasCanonicalNames,
          externalRefs: [buildExternalRef("OWTV", "TOURNAMENT_STAGE", stage.key)]
        };
      })
    };
  });

  const matches = snapshot.matches.map((match) => {
    const identity = buildMatchIdentity(
      match.event,
      match.leftTeam,
      match.rightTeam,
      match.startsOn
    );

    return {
      name: identity.name,
      canonicalName: identity.canonicalName,
      slug: identity.slug,
      tournamentName: match.event,
      tournamentAliases: buildAliases(match.event, match.eventAliases ?? []),
      stageName: match.phase,
      homeTeamName: match.leftTeam,
      homeTeamAliases: buildAliases(match.leftTeam, []),
      awayTeamName: match.rightTeam,
      awayTeamAliases: buildAliases(match.rightTeam, []),
      winnerTeamName: match.victor,
      status: match.status ?? "SCHEDULED",
      scheduledAt: toDateOrNull(match.startsOn),
      completedAt: toDateOrNull(match.endsOn),
      bestOf: match.bestOf,
      scoreHome: match.leftScore,
      scoreAway: match.rightScore,
      vodUrl: match.vodUrl,
      sourceLabel: "OWTV Connector",
      externalRefs: [buildExternalRef("OWTV", "MATCH", match.key)]
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
      source: "OWTV" as const,
      publishedAt: toDateOrNull(post.publishedAt),
      externalRefs: [buildExternalRef("OWTV", "NEWS_POST", post.key)]
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
