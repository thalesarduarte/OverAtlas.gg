import type { LiquipediaSnapshot } from "@/lib/ingest/connectors/types";
import { liquipediaSnapshotSchema } from "@/lib/ingest/connectors/types";
import type { LiquipediaClient } from "@/lib/ingest/connectors/liquipedia/client";
import { mockLiquipediaPlayers } from "@/lib/ingest/connectors/liquipedia/mock-data";

const logPrefix = "[liquipediaConnector/fetchPlayers]";

export async function fetchPlayers(
  client: LiquipediaClient
): Promise<LiquipediaSnapshot["players"]> {
  try {
    console.info(`${logPrefix} Starting players page fetch.`);

    if (client.shouldUseMock) {
      console.info(`${logPrefix} Using mock players fallback.`);
      return liquipediaSnapshotSchema.pick({ players: true }).parse({
        players: mockLiquipediaPlayers
      }).players;
    }

    const rows = await client.fetchCargoRows<LiquipediaSnapshot["players"][number]>(
      new URLSearchParams({
        action: "cargoquery",
        format: "json",
        tables: "Players",
        fields:
          "pageId=Page, tag=ID, realName=Name, region=Country, role=Role, image=Image, description=Overview, team=Team",
        order_by: "ID ASC",
        limit: "200"
      }),
      logPrefix
    );

    // TODO: Map aliases from redirects or alternate IDs once the real payload is wired.
    const parsed = liquipediaSnapshotSchema.pick({ players: true }).parse({
      players: rows
    });

    console.info(`${logPrefix} Completed with ${parsed.players.length} players.`);
    return parsed.players;
  } catch (error) {
    console.error(`${logPrefix} Failed to fetch players. Falling back to mock.`, error);
    return liquipediaSnapshotSchema.pick({ players: true }).parse({
      players: mockLiquipediaPlayers
    }).players;
  }
}
