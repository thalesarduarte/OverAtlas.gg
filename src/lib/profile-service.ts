import { getPlayerCareer } from "@/lib/integrations/overfast/getPlayerCareer";
import { getPlayerSummary } from "@/lib/integrations/overfast/getPlayerSummary";
import {
  formatBattleTagDisplay,
  normalizeBattleTagSlug,
  OverfastApiError
} from "@/lib/integrations/overfast/client";
import { searchPlayer } from "@/lib/integrations/overfast/searchPlayer";
import { profiles } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { normalizeOverfastProfile } from "@/lib/services/profile/normalizeOverfastProfile";
import type { ComparisonMetric, HeroStat, PlayerProfile, RoleSummary } from "@/types";

const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000;

type CachedProfileWithHeroes = Awaited<
  ReturnType<typeof prisma.cachedProfile.findUnique>
> & {
  heroStats?: Array<{
    heroName: string;
    role: string;
    winrate: number;
    hoursPlayed: number;
    eliminationsAvg: number | null;
    deathsAvg: number | null;
    damageAvg: number | null;
  }>;
};

type ProfileProvider = {
  name: string;
  getProfile: (battleTag: string) => Promise<PlayerProfile | null>;
};

type ProfileLookupResult = {
  profile: PlayerProfile | null;
  source: "fresh-cache" | "provider" | "stale-cache" | "not-found" | "upstream-error";
  errorCode?: "not_found" | "upstream_error";
};

export function normalizeBattleTag(input: string) {
  return normalizeBattleTagSlug(input);
}

function buildRoleSummary(heroes: HeroStat[]): RoleSummary[] {
  const grouped = new Map<string, { hours: number; winrate: number; count: number }>();

  for (const hero of heroes) {
    const current = grouped.get(hero.role) ?? { hours: 0, winrate: 0, count: 0 };
    current.hours += hero.hoursPlayed;
    current.winrate += hero.winrate;
    current.count += 1;
    grouped.set(hero.role, current);
  }

  return Array.from(grouped.entries())
    .map(([role, value]) => ({
      role,
      hoursPlayed: Number(value.hours.toFixed(1)),
      averageWinrate: Number((value.winrate / value.count).toFixed(1))
    }))
    .sort((left, right) => right.hoursPlayed - left.hoursPlayed);
}

function buildMapSummary(heroes: HeroStat[]) {
  const templates = [
    { mapName: "Lijiang Tower", mode: "Control", hero: heroes[0] },
    { mapName: "Circuit Royal", mode: "Escort", hero: heroes[1] ?? heroes[0] },
    { mapName: "Colosseo", mode: "Push", hero: heroes[2] ?? heroes[0] }
  ];

  return templates
    .filter((template) => template.hero)
    .map((template, index) => ({
      mapName: template.mapName,
      mode: template.mode,
      winrate: Math.max(35, Math.min(78, template.hero?.winrate ?? 50)),
      hoursPlayed: Number(((template.hero?.hoursPlayed ?? 10) / (index + 1.5)).toFixed(1))
    }));
}

function deriveMainRole(
  heroes: Array<{
    role: string;
    hoursPlayed: number;
  }>
) {
  return heroes.slice().sort((left, right) => right.hoursPlayed - left.hoursPlayed)[0]?.role ?? "Flex";
}

function enrichProfile(
  base: Omit<PlayerProfile, "summary" | "heroes" | "roles" | "maps" | "lastUpdated" | "source">,
  lastUpdated: Date,
  source: string
): PlayerProfile {
  const heroes = base.topHeroes
    .slice()
    .sort((left, right) => right.hoursPlayed - left.hoursPlayed);

  return {
    ...base,
    topHeroes: heroes,
    heroes,
    summary: {
      title: base.title,
      rankSummary: base.rankSummary,
      overallWinrate: base.overallWinrate,
      totalHours: base.totalHours
    },
    roles: buildRoleSummary(heroes),
    maps: buildMapSummary(heroes),
    lastUpdated: lastUpdated.toISOString(),
    source
  };
}

function mapCachedProfileToPlayerProfile(
  cachedProfile: CachedProfileWithHeroes,
  requestedBattleTag: string,
  source: "cache" | "cache-fallback" = "cache"
) {
  if (!cachedProfile || !cachedProfile.heroStats) {
    return null;
  }

  return enrichProfile(
    {
      battleTag: formatBattleTagDisplay(requestedBattleTag || cachedProfile.battleTag),
      displayName: cachedProfile.playerName,
      title: cachedProfile.title ?? "Competitive Profile",
      mainRole: cachedProfile.roleSummary ?? deriveMainRole(cachedProfile.heroStats),
      rankSummary: cachedProfile.rankSummary ?? "Sem rank informado",
      overallWinrate: cachedProfile.overallWinrate ?? 0,
      totalHours: cachedProfile.totalHours ?? 0,
      topHeroes: cachedProfile.heroStats
        .slice()
        .sort((left, right) => right.hoursPlayed - left.hoursPlayed)
        .map((hero) => ({
          heroName: hero.heroName,
          role: hero.role,
          winrate: hero.winrate,
          hoursPlayed: hero.hoursPlayed,
          eliminationsAvg: hero.eliminationsAvg ?? undefined,
          deathsAvg: hero.deathsAvg ?? undefined,
          damageAvg: hero.damageAvg ?? undefined
        }))
    },
    cachedProfile.updatedAt,
    source
  );
}

async function upsertCachedProfile(normalizedBattleTag: string, profile: PlayerProfile) {
  return prisma.cachedProfile.upsert({
    where: {
      battleTag: normalizedBattleTag
    },
    update: {
      playerName: profile.displayName,
      title: profile.title,
      roleSummary: profile.mainRole,
      overallWinrate: profile.overallWinrate,
      totalHours: profile.totalHours,
      rankSummary: profile.rankSummary,
      heroStats: {
        deleteMany: {},
        create: profile.heroes.map((hero) => ({
          heroName: hero.heroName,
          role: hero.role,
          winrate: hero.winrate,
          hoursPlayed: hero.hoursPlayed,
          eliminationsAvg: hero.eliminationsAvg,
          deathsAvg: hero.deathsAvg,
          damageAvg: hero.damageAvg
        }))
      }
    },
    create: {
      battleTag: normalizedBattleTag,
      playerName: profile.displayName,
      title: profile.title,
      roleSummary: profile.mainRole,
      overallWinrate: profile.overallWinrate,
      totalHours: profile.totalHours,
      rankSummary: profile.rankSummary,
      heroStats: {
        create: profile.heroes.map((hero) => ({
          heroName: hero.heroName,
          role: hero.role,
          winrate: hero.winrate,
          hoursPlayed: hero.hoursPlayed,
          eliminationsAvg: hero.eliminationsAvg,
          deathsAvg: hero.deathsAvg,
          damageAvg: hero.damageAvg
        }))
      }
    },
    include: {
      heroStats: true
    }
  });
}

const overfastProvider: ProfileProvider = {
  name: "overfast",
  async getProfile(battleTag) {
    const normalizedBattleTag = normalizeBattleTag(battleTag);

    if (!normalizedBattleTag) {
      return null;
    }

    const directPlayer = {
      playerId: normalizedBattleTag,
      battleTag: formatBattleTagDisplay(battleTag)
    };

    try {
      const [summary, career] = await Promise.all([
        getPlayerSummary(directPlayer.playerId),
        getPlayerCareer(directPlayer.playerId)
      ]);

      return normalizeOverfastProfile({
        battleTag: directPlayer.battleTag,
        player: directPlayer,
        summary,
        career,
        fetchedAt: new Date()
      });
    } catch (error) {
      if (!(error instanceof OverfastApiError) || error.code !== "not_found") {
        throw error;
      }
    }

    const resolvedPlayer = await searchPlayer(battleTag);

    if (!resolvedPlayer) {
      return null;
    }

    const [summary, career] = await Promise.all([
      getPlayerSummary(resolvedPlayer.playerId),
      getPlayerCareer(resolvedPlayer.playerId)
    ]);

    return normalizeOverfastProfile({
      battleTag: formatBattleTagDisplay(battleTag),
      player: resolvedPlayer,
      summary,
      career,
      fetchedAt: new Date()
    });
  }
};

const mockProvider: ProfileProvider = {
  name: "mock-provider",
  async getProfile(battleTag) {
    const normalizedBattleTag = normalizeBattleTag(battleTag);
    const profile = profiles[normalizedBattleTag];

    if (!profile) {
      return null;
    }

    return enrichProfile(
      {
        ...profile,
        mainRole: profile.mainRole || deriveMainRole(profile.topHeroes)
      },
      new Date(),
      "mock-provider"
    );
  }
};

const profileProviders: ProfileProvider[] = [overfastProvider, mockProvider];

async function fetchFromProviders(battleTag: string) {
  let sawUpstreamError = false;

  for (const provider of profileProviders) {
    try {
      const profile = await provider.getProfile(battleTag);

      if (profile) {
        console.info(`[profile-service] Profile resolved by ${provider.name}`);
        return {
          profile,
          errorCode: undefined
        } as const;
      }
    } catch (error) {
      console.error(`[profile-service] Provider failed: ${provider.name}`, error);

      if (error instanceof OverfastApiError && error.code === "not_found") {
        continue;
      }

      sawUpstreamError = true;
    }
  }

  return {
    profile: null,
    errorCode: sawUpstreamError ? "upstream_error" : "not_found"
  } as const;
}

export async function getPlayerProfileResult(battleTag: string): Promise<ProfileLookupResult> {
  const normalizedBattleTag = normalizeBattleTag(battleTag);

  if (!normalizedBattleTag) {
    return {
      profile: null,
      source: "not-found",
      errorCode: "not_found"
    };
  }

  const cachedProfile = await prisma.cachedProfile.findUnique({
    where: {
      battleTag: normalizedBattleTag
    },
    include: {
      heroStats: true
    }
  });

  const freshCache =
    cachedProfile &&
    Date.now() - new Date(cachedProfile.updatedAt).getTime() < PROFILE_CACHE_TTL_MS
      ? mapCachedProfileToPlayerProfile(cachedProfile, battleTag, "cache")
      : null;

  if (freshCache) {
    console.info("[profile-service] Returning fresh cached profile");
    return {
      profile: freshCache,
      source: "fresh-cache"
    };
  }

  const providerResult = await fetchFromProviders(battleTag);

  if (providerResult.profile) {
    await upsertCachedProfile(normalizedBattleTag, providerResult.profile);
    return {
      profile: providerResult.profile,
      source: "provider"
    };
  }

  if (cachedProfile) {
    console.warn("[profile-service] Provider unavailable, falling back to stale cache");
    return {
      profile: mapCachedProfileToPlayerProfile(cachedProfile, battleTag, "cache-fallback"),
      source: "stale-cache",
      errorCode: providerResult.errorCode
    };
  }

  return {
    profile: null,
    source: providerResult.errorCode === "upstream_error" ? "upstream-error" : "not-found",
    errorCode: providerResult.errorCode
  };
}

export async function getPlayerProfile(battleTag: string) {
  const result = await getPlayerProfileResult(battleTag);
  return result.profile;
}

export async function comparePlayerProfiles(player1: string, player2: string) {
  const [leftResult, rightResult] = await Promise.all([
    getPlayerProfileResult(player1),
    getPlayerProfileResult(player2)
  ]);

  if (!leftResult.profile || !rightResult.profile) {
    return {
      comparison: null,
      errors: {
        left: leftResult.errorCode,
        right: rightResult.errorCode
      }
    } as const;
  }

  const left = leftResult.profile;
  const right = rightResult.profile;

  const comparisonMetrics: ComparisonMetric[] = [
    {
      key: "winrate",
      label: "Win rate geral",
      leftValue: left.overallWinrate,
      rightValue: right.overallWinrate,
      leftDisplay: `${left.overallWinrate}%`,
      rightDisplay: `${right.overallWinrate}%`
    },
    {
      key: "hours",
      label: "Horas totais",
      leftValue: left.totalHours,
      rightValue: right.totalHours,
      leftDisplay: `${left.totalHours}h`,
      rightDisplay: `${right.totalHours}h`
    },
    {
      key: "heroWinrate",
      label: "Heroi principal",
      leftValue: left.heroes[0]?.winrate ?? 0,
      rightValue: right.heroes[0]?.winrate ?? 0,
      leftDisplay: left.heroes[0]?.heroName ?? "-",
      rightDisplay: right.heroes[0]?.heroName ?? "-"
    }
  ];

  const diffSummary = [
    left.overallWinrate >= right.overallWinrate
      ? `${left.displayName} lidera em winrate geral.`
      : `${right.displayName} lidera em winrate geral.`,
    left.totalHours >= right.totalHours
      ? `${left.displayName} tem mais volume de jogo recente.`
      : `${right.displayName} tem mais volume de jogo recente.`,
    left.mainRole === right.mainRole
      ? "Os dois perfis compartilham a mesma role principal."
      : `As roles principais divergem: ${left.mainRole} vs ${right.mainRole}.`
  ];

  return {
    comparison: {
      player1: left,
      player2: right,
      diffSummary,
      comparisonMetrics
    },
    errors: {
      left: leftResult.errorCode,
      right: rightResult.errorCode
    }
  } as const;
}
