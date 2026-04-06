import { NextRequest, NextResponse } from "next/server";

import { getPlayerProfileResult } from "@/lib/profile-service";

export async function GET(request: NextRequest) {
  const battleTag = request.nextUrl.searchParams.get("battletag");

  if (!battleTag) {
    return NextResponse.json(
      { error: "Informe um BattleTag valido." },
      { status: 400 }
    );
  }

  const result = await getPlayerProfileResult(battleTag);

  if (!result.profile) {
    return NextResponse.json(
      {
        error:
          result.errorCode === "upstream_error"
            ? "Nao foi possivel consultar a OverFast agora."
            : "Perfil nao encontrado."
      },
      { status: result.errorCode === "upstream_error" ? 503 : 404 }
    );
  }

  return NextResponse.json(result.profile);
}
