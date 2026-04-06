import type { Team } from "@prisma/client";

import type { NormalizedTeam } from "@/lib/ingest/normalizers/schemas";
import { reconcileTeam } from "@/lib/ingest/reconcilers/team";
import {
  PrismaTransaction,
  resolveOrCreateTournament,
  syncExternalRefs,
  syncTeamAliases,
  syncTeamRoster,
  UpsertResult
} from "@/lib/ingest/upserts/utils";

export async function upsertTeam(
  tx: PrismaTransaction,
  input: NormalizedTeam
): Promise<UpsertResult<Team>> {
  const existing = await reconcileTeam(tx, input);
  const source = input.externalRefs[0]?.source;

  const team = existing
    ? await tx.team.update({
        where: {
          id: existing.id
        },
        data: {
          name: input.name,
          slug: input.slug,
          canonicalName: input.canonicalName,
          shortName: input.shortName,
          region: input.region,
          logoUrl: input.logoUrl,
          description: input.description
        }
      })
    : await tx.team.create({
        data: {
          name: input.name,
          slug: input.slug,
          canonicalName: input.canonicalName,
          shortName: input.shortName,
          region: input.region,
          logoUrl: input.logoUrl,
          description: input.description
        }
      });

  await syncTeamAliases(tx, team.id, [input.name, ...input.aliases], source);
  await syncExternalRefs(tx, { teamId: team.id }, input.externalRefs);
  await syncTeamRoster(tx, team.id, input.roster);

  if (input.ranking) {
    const tournament = input.ranking.tournamentName
      ? await resolveOrCreateTournament(tx, {
          name: input.ranking.tournamentName,
          aliases: input.ranking.tournamentAliases
        })
      : null;

    const existingRanking = await tx.teamRanking.findFirst({
      where: {
        teamId: team.id,
        tournamentId: tournament?.id ?? null,
        source: source ?? "MANUAL"
      }
    });

    const ranking = existingRanking
      ? await tx.teamRanking.update({
          where: {
            id: existingRanking.id
          },
          data: {
            position: input.ranking.position,
            points: input.ranking.points,
            wins: input.ranking.wins,
            losses: input.ranking.losses,
            draws: input.ranking.draws,
            record: input.ranking.record,
            sourceLabel: input.ranking.sourceLabel
          }
        })
      : await tx.teamRanking.create({
          data: {
            teamId: team.id,
            tournamentId: tournament?.id ?? null,
            source: source ?? "MANUAL",
            position: input.ranking.position,
            points: input.ranking.points,
            wins: input.ranking.wins,
            losses: input.ranking.losses,
            draws: input.ranking.draws,
            record: input.ranking.record,
            sourceLabel: input.ranking.sourceLabel
          }
        });

    await syncExternalRefs(tx, { rankingId: ranking.id }, input.ranking.externalRefs);
  }

  return {
    record: team,
    operation: existing ? "updated" : "created"
  };
}
