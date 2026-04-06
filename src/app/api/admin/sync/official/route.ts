import { NextRequest, NextResponse } from "next/server";

import { syncOfficial } from "@/lib/ingest/jobs/syncOfficial";
import { requireAdminSyncAccess } from "@/lib/ingest/utils/admin";

export async function POST(request: NextRequest) {
  const unauthorizedResponse = await requireAdminSyncAccess(request);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const result = await syncOfficial();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Falha ao sincronizar fonte oficial."
      },
      { status: 500 }
    );
  }
}
