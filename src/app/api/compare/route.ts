import { NextRequest, NextResponse } from "next/server";

import { comparePlayerProfiles } from "@/lib/profile-service";
import { CompareResponse } from "@/types";

export async function GET(request: NextRequest) {
  const player1 = request.nextUrl.searchParams.get("player1");
  const player2 = request.nextUrl.searchParams.get("player2");

  if (!player1 || !player2) {
    return NextResponse.json(
      { error: "Informe dois BattleTags para comparar." },
      { status: 400 }
    );
  }

  const result = await comparePlayerProfiles(player1, player2);

  if (!result.comparison) {
    const hasUpstreamError =
      result.errors.left === "upstream_error" || result.errors.right === "upstream_error";

    return NextResponse.json(
      {
        error: hasUpstreamError
          ? "Nao foi possivel consultar a OverFast para comparar os perfis agora."
          : "Um ou ambos os perfis nao foram encontrados."
      },
      { status: hasUpstreamError ? 503 : 404 }
    );
  }

  return NextResponse.json<CompareResponse>(result.comparison);
}
