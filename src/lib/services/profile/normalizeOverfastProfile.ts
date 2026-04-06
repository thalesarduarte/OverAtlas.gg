import type {
  OverfastHeroStatBlock,
  OverfastPlayerCareerResponse,
  OverfastPlayerSummaryResponse,
  OverfastResolvedPlayer
} from "@/lib/integrations/overfast/types";
import type { HeroStat, PlayerProfile, RoleSummary } from "@/types";

const HERO_CATALOG: Record<string, { name: string; role: string }> = {
  ana: { name: "Ana", role: "Support" },
  ashe: { name: "Ashe", role: "DPS" },
  baptiste: { name: "Baptiste", role: "Support" },
  bastion: { name: "Bastion", role: "DPS" },
  brigitte: { name: "Brigitte", role: "Support" },
  cassidy: { name: "Cassidy", role: "DPS" },
  doomfist: { name: "Doomfist", role: "Tank" },
  "d.va": { name: "D.Va", role: "Tank" },
  dva: { name: "D.Va", role: "Tank" },
  echo: { name: "Echo", role: "DPS" },
  freja: { name: "Freja", role: "DPS" },
  genji: { name: "Genji", role: "DPS" },
  hanzo: { name: "Hanzo", role: "DPS" },
  hazard: { name: "Hazard", role: "Tank" },
  illari: { name: "Illari", role: "Support" },
  "junker-queen": { name: "Junker Queen", role: "Tank" },
  junkrat: { name: "Junkrat", role: "DPS" },
  juno: { name: "Juno", role: "Support" },
  kiriko: { name: "Kiriko", role: "Support" },
  lifeweaver: { name: "Lifeweaver", role: "Support" },
  lucio: { name: "Lucio", role: "Support" },
  mauga: { name: "Mauga", role: "Tank" },
  mei: { name: "Mei", role: "DPS" },
  mercy: { name: "Mercy", role: "Support" },
  moira: { name: "Moira", role: "Support" },
  orisa: { name: "Orisa", role: "Tank" },
  pharah: { name: "Pharah", role: "DPS" },
  ramattra: { name: "Ramattra", role: "Tank" },
  reaper: { name: "Reaper", role: "DPS" },
  reinhardt: { name: "Reinhardt", role: "Tank" },
  roadhog: { name: "Roadhog", role: "Tank" },
  sigma: { name: "Sigma", role: "Tank" },
  sojourn: { name: "Sojourn", role: "DPS" },
  "soldier-76": { name: "Soldier: 76", role: "DPS" },
  sombra: { name: "Sombra", role: "DPS" },
  symmetra: { name: "Symmetra", role: "DPS" },
  torbjorn: { name: "Torbjorn", role: "DPS" },
  tracer: { name: "Tracer", role: "DPS" },
  venture: { name: "Venture", role: "DPS" },
  widowmaker: { name: "Widowmaker", role: "DPS" },
  winston: { name: "Winston", role: "Tank" },
  "wrecking-ball": { name: "Wrecking Ball", role: "Tank" },
  zarya: { name: "Zarya", role: "Tank" },
  zenyatta: { name: "Zenyatta", role: "Support" }
};

function roundToSingleDecimal(value: number) {
  return Number(value.toFixed(1));
}

function humanizeKey(key: string) {
  return key
    .split(/[-_]/)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function getHeroMetadata(heroKey: string) {
  const normalizedKey = heroKey.toLowerCase();
  return (
    HERO_CATALOG[normalizedKey] ?? {
      name: humanizeKey(normalizedKey),
      role: "Flex"
    }
  );
}

function buildRankSummary(summary: OverfastPlayerSummaryResponse) {
  const platforms = [summary.competitive?.pc, summary.competitive?.console];

  for (const platform of platforms) {
    if (!platform) {
      continue;
    }

    const roles = [
      { label: "Tank", value: platform.tank },
      { label: "Damage", value: platform.damage },
      { label: "Support", value: platform.support },
      { label: "Open Queue", value: platform.open }
    ];

    const rankedRole = roles.find((entry) => entry.value);

    if (!rankedRole) {
      continue;
    }

    const tier = rankedRole.value?.tier;
    const division = rankedRole.value?.division;
    const seasonLabel = platform.season ? `S${platform.season}` : "Competitivo";
    const rankPieces = [tier, division].filter(Boolean).join(" ");

    return `${seasonLabel} / ${rankedRole.label}${rankPieces ? ` / ${rankPieces}` : ""}`;
  }

  return "Sem rank competitivo visivel";
}

function isStatsBlock(entry: unknown): entry is OverfastHeroStatBlock {
  return Boolean(entry && typeof entry === "object");
}

function buildHeroes(career: OverfastPlayerCareerResponse) {
  const heroes = Object.entries(career)
    .filter(([heroKey]) => heroKey !== "all-heroes" && heroKey !== "roles")
    .map(([heroKey, heroStats]) => {
      if (!isStatsBlock(heroStats)) {
        return null;
      }

      const metadata = getHeroMetadata(heroKey);

      return {
        heroName: metadata.name,
        role: metadata.role,
        winrate:
          typeof heroStats.winrate === "number" ? roundToSingleDecimal(heroStats.winrate) : 0,
        hoursPlayed: roundToSingleDecimal((heroStats.time_played ?? 0) / 3600),
        eliminationsAvg:
          typeof heroStats.average?.eliminations === "number"
            ? roundToSingleDecimal(heroStats.average.eliminations)
            : undefined,
        deathsAvg:
          typeof heroStats.average?.deaths === "number"
            ? roundToSingleDecimal(heroStats.average.deaths)
            : undefined,
        damageAvg:
          typeof heroStats.average?.damage === "number"
            ? roundToSingleDecimal(heroStats.average.damage)
            : undefined
      } as HeroStat;
    })
    .filter((hero) => Boolean(hero && hero.hoursPlayed > 0)) as HeroStat[];

  return heroes.sort((left, right) => right.hoursPlayed - left.hoursPlayed);
}

function buildRoleSummary(
  heroes: HeroStat[],
  roleBlocks?: Record<string, OverfastHeroStatBlock>
): RoleSummary[] {
  if (roleBlocks) {
    const directRoles = Object.entries(roleBlocks)
      .map(([roleKey, stats]) => ({
        role: humanizeKey(roleKey),
        hoursPlayed: roundToSingleDecimal((stats.time_played ?? 0) / 3600),
        averageWinrate:
          typeof stats.winrate === "number" ? roundToSingleDecimal(stats.winrate) : 0
      }))
      .filter((role) => role.hoursPlayed > 0)
      .sort((left, right) => right.hoursPlayed - left.hoursPlayed);

    if (directRoles.length > 0) {
      return directRoles;
    }
  }

  const grouped = new Map<string, { hours: number; winrate: number; count: number }>();

  heroes.forEach((hero) => {
    const current = grouped.get(hero.role) ?? { hours: 0, winrate: 0, count: 0 };
    current.hours += hero.hoursPlayed;
    current.winrate += hero.winrate;
    current.count += 1;
    grouped.set(hero.role, current);
  });

  return Array.from(grouped.entries())
    .map(([role, value]) => ({
      role,
      hoursPlayed: roundToSingleDecimal(value.hours),
      averageWinrate: roundToSingleDecimal(value.winrate / value.count)
    }))
    .sort((left, right) => right.hoursPlayed - left.hoursPlayed);
}

export function normalizeOverfastProfile({
  battleTag,
  player,
  summary,
  career,
  fetchedAt = new Date()
}: {
  battleTag: string;
  player: OverfastResolvedPlayer;
  summary: OverfastPlayerSummaryResponse;
  career: OverfastPlayerCareerResponse;
  fetchedAt?: Date;
}): PlayerProfile {
  const heroes = buildHeroes(career);
  const overallStats = career["all-heroes"];
  const totalHours = roundToSingleDecimal(((overallStats?.time_played ?? 0) as number) / 3600);
  const overallWinrate =
    typeof overallStats?.winrate === "number" ? roundToSingleDecimal(overallStats.winrate) : 0;
  const roles = buildRoleSummary(heroes, career.roles);
  const mainRole = roles[0]?.role ?? heroes[0]?.role ?? "Flex";
  const profileUpdatedAt =
    typeof summary.last_updated_at === "number"
      ? new Date(summary.last_updated_at * 1000)
      : fetchedAt;
  const rankSummary = buildRankSummary(summary);

  return {
    battleTag: player.battleTag || battleTag,
    displayName: summary.username || battleTag.split("#")[0] || battleTag,
    title: summary.title ?? player.title ?? "Competitive Profile",
    mainRole,
    rankSummary,
    overallWinrate,
    totalHours,
    topHeroes: heroes.slice(0, 8),
    summary: {
      title: summary.title ?? player.title ?? "Competitive Profile",
      rankSummary,
      overallWinrate,
      totalHours
    },
    heroes,
    roles,
    // OverFast does not expose a documented per-map breakdown on the player summary/career endpoints.
    // Keep the field present so the UI stays stable and a richer future source can fill it in.
    maps: [],
    lastUpdated: profileUpdatedAt.toISOString(),
    source: "overfast"
  };
}
