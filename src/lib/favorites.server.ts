import "server-only";

import type { Route } from "next";

import type { FavoriteCatalogItem, FavoriteRecord, FavoriteType } from "@/lib/favorites";
import { prisma } from "@/lib/prisma";

export async function resolveFavoriteItem(
  type: FavoriteType,
  refId: string
): Promise<FavoriteCatalogItem | null> {
  if (type === "TEAM") {
    const team = await prisma.team.findUnique({
      where: { slug: refId },
      include: {
        rankings: {
          include: {
            tournament: true
          },
          orderBy: [{ updatedAt: "desc" }, { position: "asc" }],
          take: 1
        }
      }
    });

    if (!team) {
      return null;
    }

    const rankingLabel = team.rankings[0]
      ? `#${team.rankings[0].position} ${team.rankings[0].tournament?.shortName ?? team.rankings[0].tournament?.name ?? ""}`.trim()
      : "Sem ranking recente";

    return {
      type,
      refId,
      title: team.name,
      subtitle: `${team.region ?? "Global"} · ${rankingLabel}`,
      href: `/teams/${team.slug}` as Route
    };
  }

  if (type === "PLAYER") {
    const player = await prisma.player.findUnique({
      where: { slug: refId },
      include: {
        team: true
      }
    });

    if (!player) {
      return null;
    }

    return {
      type,
      refId,
      title: player.name,
      subtitle: `${player.role ?? "Flex"} · ${player.team?.name ?? "Sem time atual"}`,
      href: `/players/${player.slug}` as Route
    };
  }

  const tournament = await prisma.tournament.findUnique({
    where: { slug: refId }
  });

  if (!tournament) {
    return null;
  }

  const dateLabel =
    tournament.startDate && tournament.endDate
      ? `${tournament.startDate.toLocaleDateString("pt-BR")} - ${tournament.endDate.toLocaleDateString("pt-BR")}`
      : "Datas a confirmar";

  return {
    type,
    refId,
    title: tournament.name,
    subtitle: `${dateLabel} · ${tournament.prizePool ?? "Prize pool a confirmar"}`,
    href: `/tournaments/${tournament.slug}` as Route
  };
}

export async function createResolvedFavorite(favorite: {
  id: string;
  userId?: string;
  type: FavoriteType;
  refId: string;
  createdAt: Date | string;
}): Promise<FavoriteRecord> {
  return {
    id: favorite.id,
    userId: favorite.userId,
    type: favorite.type,
    refId: favorite.refId,
    createdAt:
      typeof favorite.createdAt === "string"
        ? favorite.createdAt
        : favorite.createdAt.toISOString(),
    item: await resolveFavoriteItem(favorite.type, favorite.refId)
  };
}
