import { overfastFetch } from "@/lib/integrations/overfast/client";
import type { OverfastPlayerCareerResponse } from "@/lib/integrations/overfast/types";

export async function getPlayerCareer(playerId: string) {
  return overfastFetch<OverfastPlayerCareerResponse>(`/players/${encodeURIComponent(playerId)}/career`);
}
