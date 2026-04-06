import type { LiquipediaSnapshot } from "@/lib/ingest/connectors/types";
import { liquipediaSnapshotSchema } from "@/lib/ingest/connectors/types";
import type { LiquipediaClient } from "@/lib/ingest/connectors/liquipedia/client";
import {
  mockLiquipediaMatchSummaries,
  mockLiquipediaTournaments
} from "@/lib/ingest/connectors/liquipedia/mock-data";

const logPrefix = "[liquipediaConnector/fetchTournaments]";

type LiquipediaTournamentBundle = Pick<
  LiquipediaSnapshot,
  "tournaments" | "matchSummaries"
>;

export async function fetchTournaments(
  client: LiquipediaClient
): Promise<LiquipediaTournamentBundle> {
  try {
    console.info(`${logPrefix} Starting historical tournaments fetch.`);

    if (client.shouldUseMock) {
      console.info(`${logPrefix} Using mock tournaments fallback.`);
      return liquipediaSnapshotSchema
        .pick({
          tournaments: true,
          matchSummaries: true
        })
        .parse({
          tournaments: mockLiquipediaTournaments,
          matchSummaries: mockLiquipediaMatchSummaries
        });
    }

    const tournamentRows = await client.fetchCargoRows<
      LiquipediaSnapshot["tournaments"][number]
    >(
      new URLSearchParams({
        action: "cargoquery",
        format: "json",
        tables: "Tournaments",
        fields:
          "pageId=Page, name=Name, shortName=ShortName, location=Location, startDate=StartDate, endDate=EndDate, prizePool=PrizePool, description=Overview",
        order_by: "StartDate DESC",
        limit: "50"
      }),
      logPrefix
    );

    // TODO: Expand this query to also fetch stages once the exact Liquipedia schema
    // for Overwatch is confirmed in production. Keep the request serial to respect limits.
    const matchRows = await client.fetchCargoRows<
      LiquipediaSnapshot["matchSummaries"][number]
    >(
      new URLSearchParams({
        action: "cargoquery",
        format: "json",
        tables: "MatchSchedule",
        fields:
          "pageId=Page, tournament=Tournament, phase=MatchGroup, team1=Opponent1, team2=Opponent2, winner=Winner, state=MatchStatus, date=DateTime_UTC, endDate=FinishedAt, bestOf=BestOf, score1=Score1, score2=Score2, vod=Vod",
        order_by: "DateTime_UTC DESC",
        limit: "100"
      }),
      logPrefix
    );

    const parsed = liquipediaSnapshotSchema
      .pick({
        tournaments: true,
        matchSummaries: true
      })
      .parse({
        tournaments: tournamentRows,
        matchSummaries: matchRows
      });

    console.info(
      `${logPrefix} Completed with ${parsed.tournaments.length} tournaments and ${parsed.matchSummaries.length} historical results.`
    );

    return parsed;
  } catch (error) {
    console.error(`${logPrefix} Failed to fetch tournaments. Falling back to mock.`, error);

    return liquipediaSnapshotSchema
      .pick({
        tournaments: true,
        matchSummaries: true
      })
      .parse({
        tournaments: mockLiquipediaTournaments,
        matchSummaries: mockLiquipediaMatchSummaries
      });
  }
}
