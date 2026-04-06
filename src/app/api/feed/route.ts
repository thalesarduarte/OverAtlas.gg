import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { FeedResponse } from "@/lib/feed";
import { createResolvedFavorite } from "@/lib/favorites.server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json<FeedResponse>({
      authenticated: false,
      favoriteTeams: [],
      favoritePlayers: [],
      followedTournaments: []
    });
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const resolvedFavorites = await Promise.all(favorites.map(createResolvedFavorite));

  return NextResponse.json<FeedResponse>({
    authenticated: true,
    favoriteTeams: resolvedFavorites.filter((item) => item.type === "TEAM"),
    favoritePlayers: resolvedFavorites.filter((item) => item.type === "PLAYER"),
    followedTournaments: resolvedFavorites.filter((item) => item.type === "TOURNAMENT")
  });
}
