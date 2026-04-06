import type { Match, Prisma } from "@prisma/client";

import type { NormalizedExternalRef } from "@/lib/ingest/normalizers/schemas";
import { canonicalizeName } from "@/lib/ingest/utils/strings";

type PrismaTransaction = Prisma.TransactionClient;

type MatchIdentity = {
  name: string;
  canonicalName?: string;
  externalRefs?: NormalizedExternalRef[];
};

export async function reconcileMatch(
  tx: PrismaTransaction,
  input: MatchIdentity
): Promise<Match | null> {
  if ((input.externalRefs?.length ?? 0) > 0) {
    const externalRef = await tx.externalRef.findFirst({
      where: {
        entityType: "MATCH",
        OR: (input.externalRefs ?? []).map((ref) => ({
          source: ref.source,
          externalId: ref.externalId
        }))
      },
      include: {
        match: true
      }
    });

    if (externalRef?.match) {
      return externalRef.match;
    }
  }

  return tx.match.findUnique({
    where: {
      canonicalName: input.canonicalName ?? canonicalizeName(input.name)
    }
  });
}
