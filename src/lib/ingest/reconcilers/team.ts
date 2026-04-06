import type { Prisma, Team } from "@prisma/client";

import type { NormalizedExternalRef } from "@/lib/ingest/normalizers/schemas";
import { canonicalizeName, uniqueStrings } from "@/lib/ingest/utils/strings";

type PrismaTransaction = Prisma.TransactionClient;

type TeamIdentity = {
  name: string;
  canonicalName?: string;
  aliases?: string[];
  externalRefs?: NormalizedExternalRef[];
};

export async function reconcileTeam(
  tx: PrismaTransaction,
  input: TeamIdentity
): Promise<Team | null> {
  if ((input.externalRefs?.length ?? 0) > 0) {
    const externalRef = await tx.externalRef.findFirst({
      where: {
        entityType: "TEAM",
        OR: (input.externalRefs ?? []).map((ref) => ({
          source: ref.source,
          externalId: ref.externalId
        }))
      },
      include: {
        team: true
      }
    });

    if (externalRef?.team) {
      return externalRef.team;
    }
  }

  const canonicalName = input.canonicalName ?? canonicalizeName(input.name);
  const teamByCanonicalName = await tx.team.findUnique({
    where: {
      canonicalName
    }
  });

  if (teamByCanonicalName) {
    return teamByCanonicalName;
  }

  const aliasCanonicalNames = uniqueStrings([
    canonicalName,
    ...(input.aliases ?? []).map(canonicalizeName)
  ]);

  if (aliasCanonicalNames.length === 0) {
    return null;
  }

  const alias = await tx.teamAlias.findFirst({
    where: {
      canonicalName: {
        in: aliasCanonicalNames
      }
    },
    include: {
      team: true
    }
  });

  return alias?.team ?? null;
}
