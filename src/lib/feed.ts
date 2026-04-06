import { FavoriteRecord } from "@/lib/favorites";

export type FeedResponse = {
  authenticated: boolean;
  favoriteTeams: FavoriteRecord[];
  favoritePlayers: FavoriteRecord[];
  followedTournaments: FavoriteRecord[];
};
