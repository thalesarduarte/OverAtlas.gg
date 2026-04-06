export type OverfastPlayerSearchResult = {
  player_id: string;
  name: string;
  avatar?: string | null;
  namecard?: string | null;
  title?: string | null;
  career_url?: string | null;
  blizzard_id?: string | null;
};

export type OverfastPlayerSearchResponse = {
  total: number;
  results: OverfastPlayerSearchResult[];
};

export type OverfastCompetitiveRole = {
  division?: string | number | null;
  tier?: string | number | null;
  rank_icon?: string | null;
  tier_icon?: string | null;
  division_icon?: string | null;
};

export type OverfastSummaryPlatform = {
  season?: number | null;
  tank?: OverfastCompetitiveRole | null;
  damage?: OverfastCompetitiveRole | null;
  support?: OverfastCompetitiveRole | null;
  open?: OverfastCompetitiveRole | null;
};

export type OverfastPlayerSummaryResponse = {
  username: string;
  avatar?: string | null;
  namecard?: string | null;
  title?: string | null;
  last_updated_at?: number | null;
  competitive?: {
    pc?: OverfastSummaryPlatform | null;
    console?: OverfastSummaryPlatform | null;
  } | null;
};

export type OverfastHeroStatBlock = {
  games_played?: number | null;
  games_won?: number | null;
  games_lost?: number | null;
  time_played?: number | null;
  winrate?: number | null;
  kda?: number | null;
  average?: {
    assists?: number | null;
    damage?: number | null;
    deaths?: number | null;
    eliminations?: number | null;
    healing?: number | null;
  } | null;
  total?: {
    assists?: number | null;
    damage?: number | null;
    deaths?: number | null;
    eliminations?: number | null;
    healing?: number | null;
  } | null;
};

export type OverfastPlayerCareerResponse = Record<string, OverfastHeroStatBlock> & {
  roles?: Record<string, OverfastHeroStatBlock>;
};

export type OverfastResolvedPlayer = {
  playerId: string;
  battleTag: string;
  avatarUrl?: string | null;
  namecardUrl?: string | null;
  title?: string | null;
  careerUrl?: string | null;
};
