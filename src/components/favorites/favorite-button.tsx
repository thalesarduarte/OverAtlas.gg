"use client";

import { Loader2, Star } from "lucide-react";

import { FavoriteType } from "@/lib/favorites";
import { useFavoriteToggle } from "@/hooks/use-favorites";

type FavoriteButtonProps = {
  type: FavoriteType;
  refId: string;
  label?: string;
};

export function FavoriteButton({
  type,
  refId,
  label = "Favoritar"
}: FavoriteButtonProps) {
  const { isFavorited, isPending, toggleFavorite } = useFavoriteToggle(type, refId);

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={isPending}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        isFavorited
          ? "border-amber-300/40 bg-amber-400/15 text-amber-200"
          : "border-white/10 bg-white/5 text-slate-200 hover:border-amber-300/30 hover:bg-white/10"
      } disabled:opacity-60`}
      aria-pressed={isFavorited}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Star className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
      )}
      {isFavorited ? "Favoritado" : label}
    </button>
  );
}
