import { PlayerProfile, PlayerComparison, TeamCard, TournamentCard, NewsCard, PlayerCard } from "@/types";

export const featuredTeams: TeamCard[] = [
  {
    slug: "crazy-raccoon",
    name: "Crazy Raccoon",
    region: "APAC",
    record: "18-4",
    standing: "Top 2"
  },
  {
    slug: "team-falcons",
    name: "Team Falcons",
    region: "EMEA",
    record: "16-6",
    standing: "Top 4"
  },
  {
    slug: "spacestation-gaming",
    name: "Spacestation Gaming",
    region: "NA",
    record: "15-7",
    standing: "Top 5"
  }
];

export const featuredPlayers: PlayerCard[] = [
  { slug: "proper", name: "Proper", role: "DPS", team: "Falcons" },
  { slug: "shu", name: "Shu", role: "Support", team: "Crazy Raccoon" },
  { slug: "hanbin", name: "Hanbin", role: "Tank", team: "Falcons" }
];

export const tournaments: TournamentCard[] = [
  { slug: "owcs-stage-1", name: "OWCS Stage 1", when: "Mar 29 - Apr 12", prizePool: "$250k" },
  { slug: "faceit-open", name: "Faceit Open Series", when: "Apr 04 - Apr 18", prizePool: "$25k" },
  { slug: "world-finals", name: "World Finals Qualifier", when: "May 08 - May 19", prizePool: "$100k" }
];

export const news: NewsCard[] = [
  {
    slug: "owcs-preview",
    title: "OWCS entra na fase decisiva com favoritos pressionados",
    excerpt: "Panorama rápido com favoritos, underdogs e confrontos mais aguardados.",
    tag: "Esports"
  },
  {
    slug: "meta-shift",
    title: "Mudança de meta reacende picks agressivos no DPS",
    excerpt: "Veja como a nova composição mexe com os mapas de controle e push.",
    tag: "Meta"
  },
  {
    slug: "support-guide",
    title: "Guia para entender impacto real de supports no competitivo",
    excerpt: "Comparativos de uptime, pick rate e sinergias por composição.",
    tag: "Guia"
  }
];

export const profiles: Record<string, PlayerProfile> = {
  "thales-1234": {
    battleTag: "Thales#1234",
    displayName: "Thales",
    title: "Flex DPS",
    mainRole: "DPS",
    rankSummary: "Diamond 2 / DPS",
    overallWinrate: 56,
    totalHours: 182,
    topHeroes: [
      { heroName: "Soldier: 76", role: "DPS", winrate: 58, hoursPlayed: 42, eliminationsAvg: 22.1, deathsAvg: 5.2, damageAvg: 9380 },
      { heroName: "Cassidy", role: "DPS", winrate: 55, hoursPlayed: 31, eliminationsAvg: 19.2, deathsAvg: 5.8, damageAvg: 8610 },
      { heroName: "Sojourn", role: "DPS", winrate: 53, hoursPlayed: 24, eliminationsAvg: 18.1, deathsAvg: 6.1, damageAvg: 9050 }
    ],
    summary: {
      title: "Flex DPS",
      rankSummary: "Diamond 2 / DPS",
      overallWinrate: 56,
      totalHours: 182
    },
    heroes: [
      { heroName: "Soldier: 76", role: "DPS", winrate: 58, hoursPlayed: 42, eliminationsAvg: 22.1, deathsAvg: 5.2, damageAvg: 9380 },
      { heroName: "Cassidy", role: "DPS", winrate: 55, hoursPlayed: 31, eliminationsAvg: 19.2, deathsAvg: 5.8, damageAvg: 8610 },
      { heroName: "Sojourn", role: "DPS", winrate: 53, hoursPlayed: 24, eliminationsAvg: 18.1, deathsAvg: 6.1, damageAvg: 9050 }
    ],
    roles: [
      { role: "DPS", hoursPlayed: 140, averageWinrate: 56 },
      { role: "Support", hoursPlayed: 42, averageWinrate: 49 }
    ],
    maps: [
      { mapName: "Circuit Royal", mode: "Escort", winrate: 61, hoursPlayed: 15 },
      { mapName: "Colosseo", mode: "Push", winrate: 54, hoursPlayed: 12 },
      { mapName: "Lijiang Tower", mode: "Control", winrate: 57, hoursPlayed: 9 }
    ],
    lastUpdated: new Date("2026-03-30T20:00:00.000Z").toISOString(),
    source: "mock-cache"
  },
  "proper-1111": {
    battleTag: "Proper#1111",
    displayName: "Proper",
    title: "Elite DPS",
    mainRole: "DPS",
    rankSummary: "Champion / DPS",
    overallWinrate: 64,
    totalHours: 346,
    topHeroes: [
      { heroName: "Tracer", role: "DPS", winrate: 66, hoursPlayed: 61, eliminationsAvg: 24.4, deathsAvg: 4.7, damageAvg: 8420 },
      { heroName: "Genji", role: "DPS", winrate: 62, hoursPlayed: 49, eliminationsAvg: 22.7, deathsAvg: 5.0, damageAvg: 7710 },
      { heroName: "Sojourn", role: "DPS", winrate: 63, hoursPlayed: 37, eliminationsAvg: 20.8, deathsAvg: 5.1, damageAvg: 9820 }
    ],
    summary: {
      title: "Elite DPS",
      rankSummary: "Champion / DPS",
      overallWinrate: 64,
      totalHours: 346
    },
    heroes: [
      { heroName: "Tracer", role: "DPS", winrate: 66, hoursPlayed: 61, eliminationsAvg: 24.4, deathsAvg: 4.7, damageAvg: 8420 },
      { heroName: "Genji", role: "DPS", winrate: 62, hoursPlayed: 49, eliminationsAvg: 22.7, deathsAvg: 5.0, damageAvg: 7710 },
      { heroName: "Sojourn", role: "DPS", winrate: 63, hoursPlayed: 37, eliminationsAvg: 20.8, deathsAvg: 5.1, damageAvg: 9820 }
    ],
    roles: [
      { role: "DPS", hoursPlayed: 280, averageWinrate: 64 },
      { role: "Tank", hoursPlayed: 66, averageWinrate: 58 }
    ],
    maps: [
      { mapName: "Esperanca", mode: "Push", winrate: 68, hoursPlayed: 21 },
      { mapName: "Shambali Monastery", mode: "Escort", winrate: 65, hoursPlayed: 17 },
      { mapName: "Ilios", mode: "Control", winrate: 62, hoursPlayed: 14 }
    ],
    lastUpdated: new Date("2026-03-30T20:00:00.000Z").toISOString(),
    source: "mock-cache"
  }
};

export const sampleComparison: PlayerComparison = {
  left: profiles["thales-1234"],
  right: profiles["proper-1111"]
};
