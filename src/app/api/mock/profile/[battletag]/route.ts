import { NextResponse } from "next/server";
import { profiles } from "@/lib/mock-data";

export async function GET(_: Request, { params }: { params: Promise<{ battletag: string }> }) {
  const { battletag } = await params;
  const profile = profiles[battletag];

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}
