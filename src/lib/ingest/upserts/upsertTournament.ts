import type { Tournament } from "@prisma/client";

import type { NormalizedTournament } from "@/lib/ingest/normalizers/schemas";
import {
  reconcileTournament,
  reconcileTournamentStage
} from "@/lib/ingest/reconcilers/tournament";
import {
  PrismaTransaction,
  syncExternalRefs,
  UpsertResult
} from "@/lib/ingest/upserts/utils";

export async function upsertTournament(
  tx: PrismaTransaction,
  input: NormalizedTournament
): Promise<UpsertResult<Tournament>> {
  const existing = await reconcileTournament(tx, input);

  const tournament = existing
    ? await tx.tournament.update({
        where: {
          id: existing.id
        },
        data: {
          name: input.name,
          slug: input.slug,
          canonicalName: input.canonicalName,
          shortName: input.shortName,
          location: input.location,
          startDate: input.startDate ?? null,
          endDate: input.endDate ?? null,
          prizePool: input.prizePool,
          description: input.description,
          aliases: input.aliases,
          aliasCanonicalNames: input.aliasCanonicalNames
        }
      })
    : await tx.tournament.create({
        data: {
          name: input.name,
          slug: input.slug,
          canonicalName: input.canonicalName,
          shortName: input.shortName,
          location: input.location,
          startDate: input.startDate ?? null,
          endDate: input.endDate ?? null,
          prizePool: input.prizePool,
          description: input.description,
          aliases: input.aliases,
          aliasCanonicalNames: input.aliasCanonicalNames
        }
      });

  await syncExternalRefs(tx, { tournamentId: tournament.id }, input.externalRefs);

  for (const stageInput of input.stages) {
    const existingStage = await reconcileTournamentStage(tx, {
      ...stageInput,
      tournamentId: tournament.id
    });

    const stage = existingStage
      ? await tx.tournamentStage.update({
          where: {
            id: existingStage.id
          },
          data: {
            tournamentId: tournament.id,
            name: stageInput.name,
            slug: stageInput.slug,
            canonicalName: stageInput.canonicalName,
            stageType: stageInput.stageType,
            order: stageInput.order,
            startDate: stageInput.startDate ?? null,
            endDate: stageInput.endDate ?? null,
            aliases: stageInput.aliases,
            aliasCanonicalNames: stageInput.aliasCanonicalNames
          }
        })
      : await tx.tournamentStage.create({
          data: {
            tournamentId: tournament.id,
            name: stageInput.name,
            slug: stageInput.slug,
            canonicalName: stageInput.canonicalName,
            stageType: stageInput.stageType,
            order: stageInput.order,
            startDate: stageInput.startDate ?? null,
            endDate: stageInput.endDate ?? null,
            aliases: stageInput.aliases,
            aliasCanonicalNames: stageInput.aliasCanonicalNames
          }
        });

    await syncExternalRefs(tx, { stageId: stage.id }, stageInput.externalRefs);
  }

  return {
    record: tournament,
    operation: existing ? "updated" : "created"
  };
}
