import type { Route } from "next";
import { z } from "zod";

import { featuredPlayers, featuredTeams, tournaments } from "@/lib/mock-data";

export const favoriteTypes = ["TEAM", "PLAYER", "TOURNAMENT"] as const;

export const favoriteTypeSchema = z.enum(favoriteTypes);

export type FavoriteType = (typeof favoriteTypes)[number];

export type FavoriteCatalogItem = {
  type: FavoriteType;
  refId: string;
  title: string;
  subtitle: string;
  href: Route;
};

export type FavoriteRecord = {
  id: string;
  userId?: string;
  type: FavoriteType;
  refId: string;
  createdAt: string;
  item: FavoriteCatalogItem | null;
};

export type FavoritesResponse = {
  authenticated: boolean;
  favorites: FavoriteRecord[];
};

export const favoritePayloadSchema = z.object({
  type: favoriteTypeSchema,
  refId: z.string().trim().min(1)
});

export function resolveFavoriteItem(type: FavoriteType, refId: string): FavoriteCatalogItem | null {
  if (type === "TEAM") {
    const team = featuredTeams.find((item) => item.slug === refId);

    if (!team) {
      return null;
    }

    return {
      type,
      refId,
      title: team.name,
      subtitle: `${team.region} · ${team.record}`,
      href: "/teams"
    };
  }

  if (type === "PLAYER") {
    const player = featuredPlayers.find((item) => item.slug === refId);

    if (!player) {
      return null;
    }

    return {
      type,
      refId,
      title: player.name,
      subtitle: `${player.role} · ${player.team}`,
      href: "/players"
    };
  }

  const tournament = tournaments.find((item) => item.slug === refId);

  if (!tournament) {
    return null;
  }

  return {
    type,
    refId,
    title: tournament.name,
    subtitle: `${tournament.when} · ${tournament.prizePool}`,
    href: "/tournaments"
  };
}

export function createResolvedFavorite(favorite: {
  id: string;
  userId?: string;
  type: FavoriteType;
  refId: string;
  createdAt: Date | string;
}): FavoriteRecord {
  return {
    id: favorite.id,
    userId: favorite.userId,
    type: favorite.type,
    refId: favorite.refId,
    createdAt:
      typeof favorite.createdAt === "string"
        ? favorite.createdAt
        : favorite.createdAt.toISOString(),
    item: resolveFavoriteItem(favorite.type, favorite.refId)
  };
}
