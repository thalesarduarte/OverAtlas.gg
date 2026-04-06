import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function requireAdminSyncAccess(request: NextRequest) {
  const expectedToken = process.env.SYNC_ADMIN_TOKEN;
  const providedToken =
    request.headers.get("x-sync-token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (expectedToken && providedToken === expectedToken) {
    return null;
  }

  const session = await auth();
  if (session?.user?.id) {
    return null;
  }

  return NextResponse.json(
    { error: "Acesso administrativo necessario para executar sync." },
    { status: 401 }
  );
}
