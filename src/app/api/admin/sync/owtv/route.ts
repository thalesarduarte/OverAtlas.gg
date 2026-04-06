import { NextRequest, NextResponse } from "next/server";

import { syncOWTV } from "@/lib/ingest/jobs/syncOWTV";
import { requireAdminSyncAccess } from "@/lib/ingest/utils/admin";

export async function POST(request: NextRequest) {
  const unauthorizedResponse = await requireAdminSyncAccess(request);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const result = await syncOWTV();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Falha ao sincronizar OWTV."
      },
      { status: 500 }
    );
  }
}
