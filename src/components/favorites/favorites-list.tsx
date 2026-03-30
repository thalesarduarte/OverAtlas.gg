"use client";

import Link from "next/link";
import { Loader2, Star } from "lucide-react";

import { FavoriteButton } from "@/components/favorites/favorite-button";
import { useFavorites } from "@/hooks/use-favorites";

export function FavoritesList({ email }: { email: string }) {
  const favoritesQuery = useFavorites();

  if (favoritesQuery.isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-300">
        <div className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando favoritos...
        </div>
      </div>
    );
  }

  if (favoritesQuery.isError) {
    return (
      <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-sm text-red-100">
        Nao foi possivel carregar os favoritos agora.
      </div>
    );
  }

  const favorites = favoritesQuery.data?.favorites ?? [];

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-300">
        <p className="font-semibold text-white">{email}</p>
        <p className="mt-2">
          {favorites.length > 0
            ? `Voce possui ${favorites.length} item(ns) favoritado(s).`
            : "Sua lista esta vazia. Favoritos de times, jogadores e campeonatos aparecerao aqui."}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/30 p-8 text-center text-sm text-slate-400">
          <Star className="mx-auto mb-4 h-5 w-5 text-amber-300" />
          Ainda nao ha favoritos salvos nesta conta.
        </div>
      ) : null}

      {favorites.map((favorite) => (
        <article
          key={favorite.id}
          className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-300"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                {favorite.type}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {favorite.item?.title ?? favorite.refId}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {favorite.item?.subtitle ?? "Referencia sem detalhes no catalogo local."}
              </p>
              {favorite.item ? (
                <Link
                  href={favorite.item.href}
                  className="mt-4 inline-flex text-sm text-amber-300 hover:underline"
                >
                  Abrir pagina relacionada
                </Link>
              ) : null}
            </div>

            <FavoriteButton type={favorite.type} refId={favorite.refId} label="Favoritar" />
          </div>
        </article>
      ))}
    </div>
  );
}
