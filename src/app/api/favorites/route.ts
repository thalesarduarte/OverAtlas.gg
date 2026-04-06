import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  favoritePayloadSchema,
  FavoritesResponse
} from "@/lib/favorites";
import { createResolvedFavorite } from "@/lib/favorites.server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json<FavoritesResponse>({
      authenticated: false,
      favorites: []
    });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  const resolvedFavorites = await Promise.all(favorites.map(createResolvedFavorite));

  return NextResponse.json<FavoritesResponse>({
    authenticated: true,
    favorites: resolvedFavorites
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json(
      { message: "Voce precisa estar logado para favoritar." },
      { status: 401 }
    );
  }

  try {
    const payload = favoritePayloadSchema.parse(await request.json());

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_type_refId: {
          userId,
          type: payload.type,
          refId: payload.refId
        }
      },
      update: {},
      create: {
        userId,
        type: payload.type,
        refId: payload.refId
      }
    });

    return NextResponse.json({
      message: "Favorito adicionado com sucesso.",
      favorite: await createResolvedFavorite(favorite)
    });
  } catch {
    return NextResponse.json(
      { message: "Nao foi possivel adicionar o favorito." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json(
      { message: "Voce precisa estar logado para remover favoritos." },
      { status: 401 }
    );
  }

  try {
    const payload = favoritePayloadSchema.parse(await request.json());

    await prisma.favorite.deleteMany({
      where: {
        userId,
        type: payload.type,
        refId: payload.refId
      }
    });

    return NextResponse.json({
      message: "Favorito removido com sucesso."
    });
  } catch {
    return NextResponse.json(
      { message: "Nao foi possivel remover o favorito." },
      { status: 400 }
    );
  }
}
