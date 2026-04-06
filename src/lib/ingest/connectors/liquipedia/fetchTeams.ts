import type { LiquipediaSnapshot } from "@/lib/ingest/connectors/types";
import { liquipediaSnapshotSchema } from "@/lib/ingest/connectors/types";
import type { LiquipediaClient } from "@/lib/ingest/connectors/liquipedia/client";
import { mockLiquipediaTeams } from "@/lib/ingest/connectors/liquipedia/mock-data";

const logPrefix = "[liquipediaConnector/fetchTeams]";

export async function fetchTeams(
  client: LiquipediaClient
): Promise<LiquipediaSnapshot["teams"]> {
  try {
    console.info(`${logPrefix} Starting teams page fetch.`);

    if (client.shouldUseMock) {
      console.info(`${logPrefix} Using mock teams fallback.`);
      return liquipediaSnapshotSchema.pick({ teams: true }).parse({
        teams: mockLiquipediaTeams
      }).teams;
    }

    const rows = await client.fetchCargoRows<LiquipediaSnapshot["teams"][number]>(
      new URLSearchParams({
        action: "cargoquery",
        format: "json",
        tables: "Teams",
        fields:
          "pageId=Page, name=Name, acronym=Short, region=Region, logo=Image, description=Overview",
        order_by: "Name ASC",
        limit: "100"
      }),
      logPrefix
    );

    // TODO: Once aliases are confirmed from the real Liquipedia tables, populate them
    // here instead of relying on fallback data. Keep request sizes small before widening.
    const parsed = liquipediaSnapshotSchema.pick({ teams: true }).parse({
      teams: rows
    });

    console.info(`${logPrefix} Completed with ${parsed.teams.length} teams.`);
    return parsed.teams;
  } catch (error) {
    console.error(`${logPrefix} Failed to fetch teams. Falling back to mock.`, error);
    return liquipediaSnapshotSchema.pick({ teams: true }).parse({
      teams: mockLiquipediaTeams
    }).teams;
  }
}
