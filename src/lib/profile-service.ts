import { prisma } from "@/lib/prisma";
import { profiles } from "@/lib/mock-data";
import { PlayerProfile } from "@/types";

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

function sanitizeBattleTag(input: string) {
  return decodeURIComponent(input).trim().replace(/\s+/g, "");
}

export function normalizeBattleTag(input: string) {
  const sanitized = sanitizeBattleTag(input);

  if (!sanitized) {
    return "";
  }

  if (sanitized.includes("#")) {
    const [name, discriminator] = sanitized.split("#");
    return `${name.toLowerCase()}-${discriminator.toLowerCase()}`;
  }

  return sanitized.toLowerCase();
}

function formatBattleTagForDisplay(input: string) {
  const sanitized = sanitizeBattleTag(input);

  if (!sanitized) {
    return "";
  }

  if (sanitized.includes("#")) {
    return sanitized;
  }

  const parts = sanitized.split("-");

  if (parts.length < 2) {
    return sanitized;
  }

  const discriminator = parts.at(-1);
  const name = parts.slice(0, -1).join("-");

  return `${name}#${discriminator}`;
}

function deriveMainRole(profile: Pick<PlayerProfile, "topHeroes">) {
  return (
    profile.topHeroes
      .slice()
      .sort((left, right) => right.hoursPlayed - left.hoursPlayed)[0]?.role ?? "Flex"
  );
}

function mapCachedProfileToPlayerProfile(
  cachedProfile: CachedProfileWithHeroes,
  requestedBattleTag: string
): PlayerProfile | null {
  if (!cachedProfile || !cachedProfile.heroStats) {
    return null;
  }

  return {
    battleTag: formatBattleTagForDisplay(requestedBattleTag || cachedProfile.battleTag),
    displayName: cachedProfile.playerName,
    title: cachedProfile.title ?? "Competitive Profile",
    mainRole: cachedProfile.roleSummary ?? "Flex",
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
  };
}

function getMockProfile(normalizedBattleTag: string) {
  const profile = profiles[normalizedBattleTag];

  if (!profile) {
    return null;
  }

  return {
    ...profile,
    mainRole: profile.mainRole || deriveMainRole(profile)
  };
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
        create: profile.topHeroes.map((hero) => ({
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
        create: profile.topHeroes.map((hero) => ({
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

export async function getPlayerProfile(battleTag: string) {
  const normalizedBattleTag = normalizeBattleTag(battleTag);

  if (!normalizedBattleTag) {
    return null;
  }

  const cachedProfile = await prisma.cachedProfile.findUnique({
    where: {
      battleTag: normalizedBattleTag
    },
    include: {
      heroStats: true
    }
  });

  if (
    cachedProfile &&
    Date.now() - new Date(cachedProfile.updatedAt).getTime() < PROFILE_CACHE_TTL_MS
  ) {
    return mapCachedProfileToPlayerProfile(cachedProfile, battleTag);
  }

  const mockProfile = getMockProfile(normalizedBattleTag);

  if (!mockProfile) {
    return null;
  }

  const refreshedCache = await upsertCachedProfile(normalizedBattleTag, mockProfile);

  return mapCachedProfileToPlayerProfile(refreshedCache, mockProfile.battleTag);
}
