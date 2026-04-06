"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createOptimisticFavorite,
  FavoriteRecord,
  FavoritesResponse,
  FavoriteType
} from "@/lib/favorites";
import { useToast } from "@/components/ui/toast-provider";

export const favoritesQueryKey = ["favorites"];

async function fetchFavorites(): Promise<FavoritesResponse> {
  const response = await fetch("/api/favorites", {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar os favoritos.");
  }

  return response.json();
}

async function mutateFavorite(
  method: "POST" | "DELETE",
  payload: { type: FavoriteType; refId: string }
) {
  const response = await fetch("/api/favorites", {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nao foi possivel atualizar o favorito.");
  }

  return data;
}

function updateFavoritesCache(
  current: FavoritesResponse | undefined,
  nextFavorite: FavoriteRecord,
  mode: "add" | "remove"
): FavoritesResponse | undefined {
  if (!current) {
    return current;
  }

  const favorites =
    mode === "add"
      ? [
          nextFavorite,
          ...current.favorites.filter(
            (favorite) =>
              !(favorite.type === nextFavorite.type && favorite.refId === nextFavorite.refId)
          )
        ]
      : current.favorites.filter(
          (favorite) =>
            !(favorite.type === nextFavorite.type && favorite.refId === nextFavorite.refId)
        );

  return {
    ...current,
    favorites
  };
}

export function useFavorites() {
  return useQuery({
    queryKey: favoritesQueryKey,
    queryFn: fetchFavorites
  });
}

export function useFavoriteToggle(type: FavoriteType, refId: string) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const favoritesQuery = useFavorites();

  const favorite = favoritesQuery.data?.favorites.find(
    (item) => item.type === type && item.refId === refId
  );
  const isAuthenticated = favoritesQuery.data?.authenticated ?? false;
  const isFavorited = Boolean(favorite);

  const mutation = useMutation({
    mutationFn: async (mode: "add" | "remove") =>
      mutateFavorite(mode === "add" ? "POST" : "DELETE", { type, refId }),
    onMutate: async (mode) => {
      await queryClient.cancelQueries({ queryKey: favoritesQueryKey });

      const previous = queryClient.getQueryData<FavoritesResponse>(favoritesQueryKey);
      const optimisticFavorite = createOptimisticFavorite({
        id: favorite?.id ?? `temp-${type}-${refId}`,
        type,
        refId,
        createdAt: new Date().toISOString()
      });

      queryClient.setQueryData<FavoritesResponse | undefined>(
        favoritesQueryKey,
        updateFavoritesCache(previous, optimisticFavorite, mode)
      );

      return { previous };
    },
    onError: (error, mode, context) => {
      if (context?.previous) {
        queryClient.setQueryData(favoritesQueryKey, context.previous);
      }

      showToast({
        variant: "error",
        title: mode === "add" ? "Falha ao favoritar" : "Falha ao remover",
        description:
          error instanceof Error ? error.message : "Nao foi possivel atualizar o favorito."
      });
    },
    onSuccess: (_data, mode) => {
      showToast({
        variant: "success",
        title: mode === "add" ? "Favorito salvo" : "Favorito removido",
        description:
          mode === "add"
            ? "Sua lista foi atualizada."
            : "O item saiu da sua lista de favoritos."
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: favoritesQueryKey });
    }
  });

  function toggleFavorite() {
    if (!isAuthenticated) {
      showToast({
        variant: "error",
        title: "Login necessario",
        description: "Entre na sua conta para favoritar itens."
      });
      return;
    }

    mutation.mutate(isFavorited ? "remove" : "add");
  }

  return {
    favorite: favorite ?? createOptimisticFavorite({
      id: `preview-${type}-${refId}`,
      type,
      refId,
      createdAt: new Date().toISOString()
    }),
    isAuthenticated,
    isFavorited,
    isLoading: favoritesQuery.isLoading,
    isPending: mutation.isPending,
    toggleFavorite
  };
}
