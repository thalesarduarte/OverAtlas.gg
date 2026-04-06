import type { Route } from "next";
import { z } from "zod";

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

export function createOptimisticFavorite(favorite: {
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
    item: null
  };
}
