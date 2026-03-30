import { NextRequest, NextResponse } from "next/server";

import { getPlayerProfile } from "@/lib/profile-service";

export async function GET(request: NextRequest) {
  const battleTag = request.nextUrl.searchParams.get("battletag");

  if (!battleTag) {
    return NextResponse.json(
      { error: "Informe um BattleTag valido." },
      { status: 400 }
    );
  }

  const profile = await getPlayerProfile(battleTag);

  if (!profile) {
    return NextResponse.json(
      { error: "Perfil nao encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json(profile);
}
