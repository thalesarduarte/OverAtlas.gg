import { NextRequest, NextResponse } from "next/server";

import { syncLiquipedia } from "@/lib/ingest/jobs/syncLiquipedia";
import { requireAdminSyncAccess } from "@/lib/ingest/utils/admin";

export async function POST(request: NextRequest) {
  const unauthorizedResponse = await requireAdminSyncAccess(request);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const result = await syncLiquipedia();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Falha ao sincronizar Liquipedia."
      },
      { status: 500 }
    );
  }
}
