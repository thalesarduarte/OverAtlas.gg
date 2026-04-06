import type { Player } from "@prisma/client";

import type { NormalizedPlayer } from "@/lib/ingest/normalizers/schemas";
import { reconcilePlayer } from "@/lib/ingest/reconcilers/player";
import {
  resolveOrCreateTeam,
  PrismaTransaction,
  syncExternalRefs,
  syncPlayerAliases,
  UpsertResult
} from "@/lib/ingest/upserts/utils";

export async function upsertPlayer(
  tx: PrismaTransaction,
  input: NormalizedPlayer
): Promise<UpsertResult<Player>> {
  const existing = await reconcilePlayer(tx, input);
  const source = input.externalRefs[0]?.source;
  const team = input.currentTeamName
    ? await resolveOrCreateTeam(tx, input.currentTeamName, input.currentTeamAliases)
    : null;

  const player = existing
    ? await tx.player.update({
        where: {
          id: existing.id
        },
        data: {
          name: input.name,
          slug: input.slug,
          canonicalName: input.canonicalName,
          realName: input.realName,
          region: input.region,
          role: input.role,
          photoUrl: input.photoUrl,
          description: input.description,
          teamId: team?.id ?? null
        }
      })
    : await tx.player.create({
        data: {
          name: input.name,
          slug: input.slug,
          canonicalName: input.canonicalName,
          realName: input.realName,
          region: input.region,
          role: input.role,
          photoUrl: input.photoUrl,
          description: input.description,
          teamId: team?.id ?? null
        }
      });

  await syncPlayerAliases(tx, player.id, [input.name, ...input.aliases], source);
  await syncExternalRefs(tx, { playerId: player.id }, input.externalRefs);

  if (team) {
    await tx.playerTeamHistory.updateMany({
      where: {
        playerId: player.id,
        isCurrent: true,
        teamId: {
          not: team.id
        }
      },
      data: {
        isCurrent: false,
        endDate: new Date()
      }
    });

    const existingHistory = await tx.playerTeamHistory.findFirst({
      where: {
        playerId: player.id,
        teamId: team.id,
        isCurrent: true
      }
    });

    if (!existingHistory) {
      await tx.playerTeamHistory.create({
        data: {
          playerId: player.id,
          teamId: team.id,
          role: input.role,
          isCurrent: true,
          source
        }
      });
    }
  }

  return {
    record: player,
    operation: existing ? "updated" : "created"
  };
}
