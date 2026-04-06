import type { Match } from "@prisma/client";

import type { NormalizedMatch } from "@/lib/ingest/normalizers/schemas";
import { reconcileMatch } from "@/lib/ingest/reconcilers/match";
import {
  PrismaTransaction,
  resolveOrCreateTeam,
  resolveOrCreateTournament,
  resolveStageForTournament,
  syncExternalRefs,
  UpsertResult
} from "@/lib/ingest/upserts/utils";

export async function upsertMatch(
  tx: PrismaTransaction,
  input: NormalizedMatch
): Promise<UpsertResult<Match>> {
  const existing = await reconcileMatch(tx, input);
  const tournament = await resolveOrCreateTournament(tx, {
    name: input.tournamentName,
    aliases: input.tournamentAliases
  });
  const stage = input.stageName
    ? await resolveStageForTournament(tx, tournament.id, {
        name: input.stageName,
        aliases: []
      })
    : null;
  const homeTeam = await resolveOrCreateTeam(tx, input.homeTeamName, input.homeTeamAliases);
  const awayTeam = await resolveOrCreateTeam(tx, input.awayTeamName, input.awayTeamAliases);
  const winnerTeam = input.winnerTeamName
    ? await resolveOrCreateTeam(tx, input.winnerTeamName, [])
    : null;

  const match = existing
    ? await tx.match.update({
        where: {
          id: existing.id
        },
        data: {
          name: input.name,
          slug: input.slug,
          canonicalName: input.canonicalName,
          tournamentId: tournament.id,
          stageId: stage?.id ?? null,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          winnerTeamId: winnerTeam?.id ?? null,
          status: input.status,
          scheduledAt: input.scheduledAt ?? null,
          completedAt: input.completedAt ?? null,
          bestOf: input.bestOf,
          scoreHome: input.scoreHome,
          scoreAway: input.scoreAway,
          vodUrl: input.vodUrl,
          sourceLabel: input.sourceLabel
        }
      })
    : await tx.match.create({
        data: {
          name: input.name,
          slug: input.slug,
          canonicalName: input.canonicalName,
          tournamentId: tournament.id,
          stageId: stage?.id ?? null,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          winnerTeamId: winnerTeam?.id ?? null,
          status: input.status,
          scheduledAt: input.scheduledAt ?? null,
          completedAt: input.completedAt ?? null,
          bestOf: input.bestOf,
          scoreHome: input.scoreHome,
          scoreAway: input.scoreAway,
          vodUrl: input.vodUrl,
          sourceLabel: input.sourceLabel
        }
      });

  await syncExternalRefs(tx, { matchId: match.id }, input.externalRefs);

  return {
    record: match,
    operation: existing ? "updated" : "created"
  };
}
