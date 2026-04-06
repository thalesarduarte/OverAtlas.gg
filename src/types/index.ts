export type HeroStat = {
  heroName: string;
  role: string;
  winrate: number;
  hoursPlayed: number;
  eliminationsAvg?: number;
  deathsAvg?: number;
  damageAvg?: number;
};

export type RoleSummary = {
  role: string;
  hoursPlayed: number;
  averageWinrate: number;
};

export type MapStat = {
  mapName: string;
  mode: string;
  winrate: number;
  hoursPlayed: number;
};

export type ProfileSummary = {
  title: string;
  rankSummary: string;
  overallWinrate: number;
  totalHours: number;
};

export type PlayerProfile = {
  battleTag: string;
  displayName: string;
  title: string;
  mainRole: string;
  rankSummary: string;
  overallWinrate: number;
  totalHours: number;
  topHeroes: HeroStat[];
  summary: ProfileSummary;
  heroes: HeroStat[];
  roles: RoleSummary[];
  maps: MapStat[];
  lastUpdated: string;
  source: string;
};

export type PlayerComparison = {
  left: PlayerProfile;
  right: PlayerProfile;
};

export type ComparisonMetric = {
  key: string;
  label: string;
  leftValue: number;
  rightValue: number;
  leftDisplay: string;
  rightDisplay: string;
};

export type CompareResponse = {
  player1: PlayerProfile;
  player2: PlayerProfile;
  diffSummary: string[];
  comparisonMetrics: ComparisonMetric[];
};

export type TeamCard = {
  slug: string;
  name: string;
  region: string;
  record: string;
  standing: string;
};

export type TournamentCard = {
  slug: string;
  name: string;
  when: string;
  prizePool: string;
};

export type NewsCard = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
};

export type PlayerCard = {
  slug: string;
  name: string;
  role: string;
  team: string;
};
