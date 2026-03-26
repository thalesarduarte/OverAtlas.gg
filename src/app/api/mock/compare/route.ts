import { NextResponse } from "next/server";
import { profiles, sampleComparison } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const left = searchParams.get("left") ?? "thales-1234";
  const right = searchParams.get("right") ?? "proper-1111";

  return NextResponse.json({
    left: profiles[left] ?? sampleComparison.left,
    right: profiles[right] ?? sampleComparison.right
  });
}
