"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Radar, Star } from "lucide-react";

import { SectionShell } from "@/components/ui/section-shell";
import { FeedResponse } from "@/lib/feed";
import { FavoriteRecord } from "@/lib/favorites";

async function fetchFeed(): Promise<FeedResponse> {
  const response = await fetch("/api/feed", {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar o feed.");
  }

  return response.json();
}

function FeedGroup({
  title,
  items,
  emptyText
}: {
  title: string;
  items: FavoriteRecord[];
  emptyText: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 text-amber-300" />
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
          {title}
        </h3>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-sm text-slate-400">
          {emptyText}
        </div>
      ) : (
        items.map((item) => (
          <Link
            key={item.id}
            href={item.item?.href ?? "/favoritos"}
            className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-amber-300/30 hover:bg-white/[0.05]"
          >
            <p className="text-sm font-semibold text-white">
              {item.item?.title ?? item.refId}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {item.item?.subtitle ?? "Conteudo salvo pelo usuario."}
            </p>
          </Link>
        ))
      )}
    </div>
  );
}

export function HomeFeed() {
  const feedQuery = useQuery({
    queryKey: ["home-feed"],
    queryFn: fetchFeed
  });

  return (
    <SectionShell
      title="Seu Feed"
      description="Uma leitura rapida do que voce ja favoritou dentro do OverAtlas."
    >
      {feedQuery.isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-300">
          <div className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Montando seu feed personalizado...
          </div>
        </div>
      ) : null}

      {feedQuery.isError ? (
        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-sm text-red-100">
          Nao foi possivel carregar o feed agora.
        </div>
      ) : null}

      {!feedQuery.isLoading && !feedQuery.isError && !feedQuery.data?.authenticated ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
          <Radar className="mx-auto h-6 w-6 text-amber-300" />
          <h3 className="mt-4 text-xl font-bold text-white">Feed personalizado bloqueado</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Entre na sua conta para ver times favoritos, jogadores salvos e campeonatos que voce acompanha.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              Criar conta
            </Link>
          </div>
        </div>
      ) : null}

      {!feedQuery.isLoading && !feedQuery.isError && feedQuery.data?.authenticated ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <FeedGroup
            title="Times favoritos"
            items={feedQuery.data.favoriteTeams}
            emptyText="Voce ainda nao favoritou times."
          />
          <FeedGroup
            title="Jogadores favoritos"
            items={feedQuery.data.favoritePlayers}
            emptyText="Voce ainda nao favoritou jogadores."
          />
          <FeedGroup
            title="Campeonatos seguidos"
            items={feedQuery.data.followedTournaments}
            emptyText="Voce ainda nao segue campeonatos."
          />
        </div>
      ) : null}
    </SectionShell>
  );
}
