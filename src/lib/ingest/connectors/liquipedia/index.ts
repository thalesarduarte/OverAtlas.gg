import type {
  IngestConnector,
  LiquipediaSnapshot
} from "@/lib/ingest/connectors/types";
import { liquipediaSnapshotSchema } from "@/lib/ingest/connectors/types";
import { createLiquipediaClient } from "@/lib/ingest/connectors/liquipedia/client";
import { fetchPlayers } from "@/lib/ingest/connectors/liquipedia/fetchPlayers";
import { fetchRosters } from "@/lib/ingest/connectors/liquipedia/fetchRosters";
import { fetchTeams } from "@/lib/ingest/connectors/liquipedia/fetchTeams";
import { fetchTournaments } from "@/lib/ingest/connectors/liquipedia/fetchTournaments";

const logPrefix = "[liquipediaConnector]";

export const liquipediaConnector: IngestConnector<LiquipediaSnapshot> = {
  source: "LIQUIPEDIA",
  async fetchSnapshot() {
    try {
      console.info(`${logPrefix} Starting Liquipedia snapshot.`);

      const client = createLiquipediaClient();

      // Keep these requests in series to stay conservative with community-run infra.
      const tournamentsBundle = await fetchTournaments(client);
      const teams = await fetchTeams(client);
      const players = await fetchPlayers(client);
      const rosterEntries = await fetchRosters(client);

      const snapshot = liquipediaSnapshotSchema.parse({
        tournaments: tournamentsBundle.tournaments,
        teams,
        players,
        rosterEntries,
        matchSummaries: tournamentsBundle.matchSummaries
      });

      console.info(
        `${logPrefix} Snapshot ready with ${snapshot.tournaments.length} tournaments, ${snapshot.teams.length} teams, ${snapshot.players.length} players and ${snapshot.matchSummaries.length} results.`
      );

      return snapshot;
    } catch (error) {
      console.error(`${logPrefix} Snapshot build failed.`, error);
      throw new Error("Liquipedia connector snapshot failed.");
    }
  }
};
