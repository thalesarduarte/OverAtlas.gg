import { overfastFetch } from "@/lib/integrations/overfast/client";
import type { OverfastPlayerSummaryResponse } from "@/lib/integrations/overfast/types";

export async function getPlayerSummary(playerId: string) {
  return overfastFetch<OverfastPlayerSummaryResponse>(`/players/${encodeURIComponent(playerId)}/summary`);
}
