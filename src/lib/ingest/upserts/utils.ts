import type { Prisma } from "@prisma/client";

import type {
  NormalizedExternalRef,
  NormalizedNewsPost,
  NormalizedPlayer,
  NormalizedTournament,
  NormalizedTournamentStage
} from "@/lib/ingest/normalizers/schemas";
import { reconcilePlayer } from "@/lib/ingest/reconcilers/player";
import { reconcileTeam } from "@/lib/ingest/reconcilers/team";
import {
  reconcileTournament,
  reconcileTournamentStage
} from "@/lib/ingest/reconcilers/tournament";
import {
  canonicalizeName,
  slugify,
  uniqueStrings
} from "@/lib/ingest/utils/strings";

export type PrismaTransaction = Prisma.TransactionClient;
export type UpsertOperation = "created" | "updated";
export type UpsertResult<T> = {
  record: T;
  operation: UpsertOperation;
};

function toExternalRefData(
  ref: NormalizedExternalRef,
  entityLink:
    | { teamId: string }
    | { playerId: string }
    | { tournamentId: string }
    | { stageId: string }
    | { matchId: string }
    | { rankingId: string }
    | { newsPostId: string }
) {
  return {
    source: ref.source,
    entityType: ref.entityType,
    externalId: ref.externalId,
    url: ref.url,
    metadata: ref.metadata,
    ...entityLink
  };
}

export async function syncExternalRefs(
  tx: PrismaTransaction,
  entityLink:
    | { teamId: string }
    | { playerId: string }
    | { tournamentId: string }
    | { stageId: string }
    | { matchId: string }
    | { rankingId: string }
    | { newsPostId: string },
  refs: NormalizedExternalRef[]
) {
  for (const ref of refs) {
    await tx.externalRef.upsert({
      where: {
        source_entityType_externalId: {
          source: ref.source,
          entityType: ref.entityType,
          externalId: ref.externalId
        }
      },
      update: toExternalRefData(ref, entityLink),
      create: toExternalRefData(ref, entityLink)
    });
  }
}

export async function syncTeamAliases(
  tx: PrismaTransaction,
  teamId: string,
  aliases: string[],
  source?: NormalizedExternalRef["source"]
) {
  for (const alias of uniqueStrings(aliases)) {
    await tx.teamAlias.upsert({
      where: {
        teamId_value: {
          teamId,
          value: alias
        }
      },
      update: {
        canonicalName: canonicalizeName(alias),
        source
      },
      create: {
        teamId,
        value: alias,
        canonicalName: canonicalizeName(alias),
        source
      }
    });
  }
}

export async function syncPlayerAliases(
  tx: PrismaTransaction,
  playerId: string,
  aliases: string[],
  source?: NormalizedExternalRef["source"]
) {
  for (const alias of uniqueStrings(aliases)) {
    await tx.playerAlias.upsert({
      where: {
        playerId_value: {
          playerId,
          value: alias
        }
      },
      update: {
        canonicalName: canonicalizeName(alias),
        source
      },
      create: {
        playerId,
        value: alias,
        canonicalName: canonicalizeName(alias),
        source
      }
    });
  }
}

export async function resolveOrCreateTeam(
  tx: PrismaTransaction,
  name: string,
  aliases: string[] = []
) {
  const existing = await reconcileTeam(tx, {
    name,
    aliases
  });

  if (existing) {
    return existing;
  }

  return tx.team.create({
    data: {
      name,
      slug: slugify(name),
      canonicalName: canonicalizeName(name)
    }
  });
}

export async function resolveOrCreatePlayer(
  tx: PrismaTransaction,
  player: Pick<NormalizedPlayer, "name" | "aliases" | "role">
) {
  const existing = await reconcilePlayer(tx, player);

  if (existing) {
    return existing;
  }

  return tx.player.create({
    data: {
      name: player.name,
      slug: slugify(player.name),
      canonicalName: canonicalizeName(player.name),
      role: player.role
    }
  });
}

export async function resolveOrCreateTournament(
  tx: PrismaTransaction,
  tournament: Pick<NormalizedTournament, "name" | "aliases">
) {
  const existing = await reconcileTournament(tx, tournament);

  if (existing) {
    return existing;
  }

  return tx.tournament.create({
    data: {
      name: tournament.name,
      slug: slugify(tournament.name),
      canonicalName: canonicalizeName(tournament.name),
      aliases: uniqueStrings(tournament.aliases),
      aliasCanonicalNames: uniqueStrings(
        [tournament.name, ...tournament.aliases].map(canonicalizeName)
      )
    }
  });
}

export async function resolveNewsPost(
  tx: PrismaTransaction,
  newsPost: Pick<NormalizedNewsPost, "title" | "canonicalName" | "externalRefs">
) {
  if (newsPost.externalRefs.length > 0) {
    const externalRef = await tx.externalRef.findFirst({
      where: {
        entityType: "NEWS_POST",
        OR: newsPost.externalRefs.map((ref) => ({
          source: ref.source,
          externalId: ref.externalId
        }))
      },
      include: {
        newsPost: true
      }
    });

    if (externalRef?.newsPost) {
      return externalRef.newsPost;
    }
  }

  return tx.newsPost.findUnique({
    where: {
      canonicalName: newsPost.canonicalName
    }
  });
}

export async function resolveStageForTournament(
  tx: PrismaTransaction,
  tournamentId: string,
  stage: Pick<NormalizedTournamentStage, "name" | "aliases">
) {
  return reconcileTournamentStage(tx, {
    ...stage,
    tournamentId
  });
}

export async function syncTeamRoster(
  tx: PrismaTransaction,
  teamId: string,
  roster: Array<{
    name: string;
    aliases: string[];
    role?: string;
    joinedAt?: Date | null;
    leftAt?: Date | null;
    isActive?: boolean;
    externalRefs: NormalizedExternalRef[];
  }>
) {
  for (const member of roster) {
    const player = await resolveOrCreatePlayer(tx, member);

    await syncPlayerAliases(
      tx,
      player.id,
      [member.name, ...member.aliases],
      member.externalRefs[0]?.source
    );
    await syncExternalRefs(tx, { playerId: player.id }, member.externalRefs);

    const existingRoster = await tx.roster.findFirst({
      where: {
        teamId,
        playerId: player.id,
        tournamentId: null
      }
    });

    if (existingRoster) {
      await tx.roster.update({
        where: {
          id: existingRoster.id
        },
        data: {
          role: member.role,
          isActive: member.isActive ?? true,
          joinedAt: member.joinedAt ?? existingRoster.joinedAt,
          leftAt: member.leftAt ?? null
        }
      });
    } else {
      await tx.roster.create({
        data: {
          teamId,
          playerId: player.id,
          role: member.role,
          isActive: member.isActive ?? true,
          joinedAt: member.joinedAt ?? null,
          leftAt: member.leftAt ?? null
        }
      });
    }
  }
}
