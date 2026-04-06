import {
  formatBattleTagDisplay,
  normalizeBattleTagInput,
  normalizeBattleTagSlug,
  overfastFetch
} from "@/lib/integrations/overfast/client";
import type {
  OverfastPlayerSearchResponse,
  OverfastResolvedPlayer
} from "@/lib/integrations/overfast/types";

function getSearchTerm(input: string) {
  const sanitized = normalizeBattleTagInput(input);
  if (sanitized.includes("#")) {
    const [name, discriminator] = sanitized.split("#");
    return discriminator ? `${name}-${discriminator}` : name;
  }

  return sanitized;
}

function matchesBattleTag(searchName: string, input: string) {
  return normalizeBattleTagSlug(searchName) === normalizeBattleTagSlug(input);
}

export async function searchPlayer(battleTag: string): Promise<OverfastResolvedPlayer | null> {
  const primarySearchTerm = getSearchTerm(battleTag);
  const fallbackSearchTerm = normalizeBattleTagInput(battleTag).split("#")[0] ?? primarySearchTerm;

  if (!primarySearchTerm) {
    return null;
  }

  const primaryPayload = await overfastFetch<OverfastPlayerSearchResponse>("/players", {
    name: primarySearchTerm
  });

  const payload =
    primaryPayload.total === 0 && fallbackSearchTerm && fallbackSearchTerm !== primarySearchTerm
      ? await overfastFetch<OverfastPlayerSearchResponse>("/players", {
          name: fallbackSearchTerm
        })
      : primaryPayload;

  const exactMatch =
    payload.results.find((result) => matchesBattleTag(result.name, battleTag)) ??
    payload.results.find(
      (result) => result.player_id.toLowerCase() === normalizeBattleTagSlug(battleTag)
    );

  if (!exactMatch) {
    return null;
  }

  return {
    playerId: exactMatch.player_id,
    battleTag: exactMatch.name || formatBattleTagDisplay(battleTag),
    avatarUrl: exactMatch.avatar,
    namecardUrl: exactMatch.namecard,
    title: exactMatch.title,
    careerUrl: exactMatch.career_url
  };
}
