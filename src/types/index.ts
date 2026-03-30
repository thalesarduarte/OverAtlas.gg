export type HeroStat = {
  heroName: string;
  role: string;
  winrate: number;
  hoursPlayed: number;
  eliminationsAvg?: number;
  deathsAvg?: number;
  damageAvg?: number;
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
};

export type PlayerComparison = {
  left: PlayerProfile;
  right: PlayerProfile;
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
