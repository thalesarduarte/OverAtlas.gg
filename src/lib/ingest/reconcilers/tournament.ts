import type { Prisma, Tournament, TournamentStage } from "@prisma/client";

import type { NormalizedExternalRef } from "@/lib/ingest/normalizers/schemas";
import { canonicalizeName, uniqueStrings } from "@/lib/ingest/utils/strings";

type PrismaTransaction = Prisma.TransactionClient;

type TournamentIdentity = {
  name: string;
  canonicalName?: string;
  aliases?: string[];
  externalRefs?: NormalizedExternalRef[];
};

type StageIdentity = {
  name: string;
  canonicalName?: string;
  aliases?: string[];
  externalRefs?: NormalizedExternalRef[];
  tournamentId?: string;
};

export async function reconcileTournament(
  tx: PrismaTransaction,
  input: TournamentIdentity
): Promise<Tournament | null> {
  if ((input.externalRefs?.length ?? 0) > 0) {
    const externalRef = await tx.externalRef.findFirst({
      where: {
        entityType: "TOURNAMENT",
        OR: (input.externalRefs ?? []).map((ref) => ({
          source: ref.source,
          externalId: ref.externalId
        }))
      },
      include: {
        tournament: true
      }
    });

    if (externalRef?.tournament) {
      return externalRef.tournament;
    }
  }

  const canonicalName = input.canonicalName ?? canonicalizeName(input.name);
  const tournamentByCanonicalName = await tx.tournament.findUnique({
    where: {
      canonicalName
    }
  });

  if (tournamentByCanonicalName) {
    return tournamentByCanonicalName;
  }

  const aliasCanonicalNames = uniqueStrings([
    canonicalName,
    ...(input.aliases ?? []).map(canonicalizeName)
  ]);

  if (aliasCanonicalNames.length === 0) {
    return null;
  }

  return tx.tournament.findFirst({
    where: {
      aliasCanonicalNames: {
        hasSome: aliasCanonicalNames
      }
    }
  });
}

export async function reconcileTournamentStage(
  tx: PrismaTransaction,
  input: StageIdentity
): Promise<TournamentStage | null> {
  if ((input.externalRefs?.length ?? 0) > 0) {
    const externalRef = await tx.externalRef.findFirst({
      where: {
        entityType: "TOURNAMENT_STAGE",
        OR: (input.externalRefs ?? []).map((ref) => ({
          source: ref.source,
          externalId: ref.externalId
        }))
      },
      include: {
        stage: true
      }
    });

    if (externalRef?.stage) {
      return externalRef.stage;
    }
  }

  const canonicalName = input.canonicalName ?? canonicalizeName(input.name);
  const where = input.tournamentId
    ? { canonicalName, tournamentId: input.tournamentId }
    : { canonicalName };

  const stageByCanonicalName = await tx.tournamentStage.findFirst({
    where
  });

  if (stageByCanonicalName) {
    return stageByCanonicalName;
  }

  const aliasCanonicalNames = uniqueStrings([
    canonicalName,
    ...(input.aliases ?? []).map(canonicalizeName)
  ]);

  if (aliasCanonicalNames.length === 0) {
    return null;
  }

  return tx.tournamentStage.findFirst({
    where: {
      ...(input.tournamentId ? { tournamentId: input.tournamentId } : {}),
      aliasCanonicalNames: {
        hasSome: aliasCanonicalNames
      }
    }
  });
}
