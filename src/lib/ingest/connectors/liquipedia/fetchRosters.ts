import type { LiquipediaSnapshot } from "@/lib/ingest/connectors/types";
import { liquipediaSnapshotSchema } from "@/lib/ingest/connectors/types";
import type { LiquipediaClient } from "@/lib/ingest/connectors/liquipedia/client";
import { mockLiquipediaRosterEntries } from "@/lib/ingest/connectors/liquipedia/mock-data";

const logPrefix = "[liquipediaConnector/fetchRosters]";

export async function fetchRosters(
  client: LiquipediaClient
): Promise<LiquipediaSnapshot["rosterEntries"]> {
  try {
    console.info(`${logPrefix} Starting roster history fetch.`);

    if (client.shouldUseMock) {
      console.info(`${logPrefix} Using mock roster fallback.`);
      return liquipediaSnapshotSchema.pick({ rosterEntries: true }).parse({
        rosterEntries: mockLiquipediaRosterEntries
      }).rosterEntries;
    }

    const rows = await client.fetchCargoRows<LiquipediaSnapshot["rosterEntries"][number]>(
      new URLSearchParams({
        action: "cargoquery",
        format: "json",
        tables: "RosterChanges",
        fields:
          "pageId=Page, team=Team, player=Player, role=Role, joinedAt=DateJoin, leftAt=DateLeave, isActive=Active",
        order_by: "DateJoin DESC",
        limit: "200"
      }),
      logPrefix
    );

    // TODO: Add tournament-scoped roster windows here when the historical table shape
    // is confirmed. This is the main place to widen limits if your sync needs deepen.
    const parsed = liquipediaSnapshotSchema.pick({ rosterEntries: true }).parse({
      rosterEntries: rows
    });

    console.info(`${logPrefix} Completed with ${parsed.rosterEntries.length} roster entries.`);
    return parsed.rosterEntries;
  } catch (error) {
    console.error(`${logPrefix} Failed to fetch rosters. Falling back to mock.`, error);
    return liquipediaSnapshotSchema.pick({ rosterEntries: true }).parse({
      rosterEntries: mockLiquipediaRosterEntries
    }).rosterEntries;
  }
}
