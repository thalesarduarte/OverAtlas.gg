import type { Player, Prisma } from "@prisma/client";

import type { NormalizedExternalRef } from "@/lib/ingest/normalizers/schemas";
import { canonicalizeName, uniqueStrings } from "@/lib/ingest/utils/strings";

type PrismaTransaction = Prisma.TransactionClient;

type PlayerIdentity = {
  name: string;
  canonicalName?: string;
  aliases?: string[];
  externalRefs?: NormalizedExternalRef[];
};

export async function reconcilePlayer(
  tx: PrismaTransaction,
  input: PlayerIdentity
): Promise<Player | null> {
  if ((input.externalRefs?.length ?? 0) > 0) {
    const externalRef = await tx.externalRef.findFirst({
      where: {
        entityType: "PLAYER",
        OR: (input.externalRefs ?? []).map((ref) => ({
          source: ref.source,
          externalId: ref.externalId
        }))
      },
      include: {
        player: true
      }
    });

    if (externalRef?.player) {
      return externalRef.player;
    }
  }

  const canonicalName = input.canonicalName ?? canonicalizeName(input.name);
  const playerByCanonicalName = await tx.player.findUnique({
    where: {
      canonicalName
    }
  });

  if (playerByCanonicalName) {
    return playerByCanonicalName;
  }

  const aliasCanonicalNames = uniqueStrings([
    canonicalName,
    ...(input.aliases ?? []).map(canonicalizeName)
  ]);

  if (aliasCanonicalNames.length === 0) {
    return null;
  }

  const alias = await tx.playerAlias.findFirst({
    where: {
      canonicalName: {
        in: aliasCanonicalNames
      }
    },
    include: {
      player: true
    }
  });

  return alias?.player ?? null;
}
