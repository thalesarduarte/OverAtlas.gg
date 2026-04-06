import type { OWTVSnapshot } from "@/lib/ingest/connectors/types";
import { owtvSnapshotSchema } from "@/lib/ingest/connectors/types";

const logPrefix = "[owtvConnector/fetchMatches]";

const mockMatches: OWTVSnapshot["matches"] = [
  {
    key: "owtv:falcons-vs-cr",
    event: "OWCS Stage 1 2026",
    eventAliases: ["OWCS Stage 1"],
    phase: "Playoffs",
    leftTeam: "Team Falcons",
    rightTeam: "Crazy Raccoon",
    victor: "Team Falcons",
    status: "COMPLETED",
    startsOn: "2026-04-06T16:00:00.000Z",
    endsOn: "2026-04-06T18:00:00.000Z",
    bestOf: 5,
    leftScore: 3,
    rightScore: 1,
    vodUrl: "https://video.example.com/falcons-vs-cr"
  },
  {
    key: "owtv:ssg-vs-falcons",
    event: "OWCS Midseason Clash 2026",
    eventAliases: ["OWCS Midseason Clash"],
    phase: "Opening Weekend",
    leftTeam: "Spacestation Gaming",
    rightTeam: "Team Falcons",
    status: "SCHEDULED",
    startsOn: "2026-05-03T19:00:00.000Z",
    bestOf: 5
  }
];

export async function fetchMatches(): Promise<OWTVSnapshot["matches"]> {
  try {
    console.info(`${logPrefix} Starting matches fetch.`);

    // TODO: Point this to the real OWTV schedule/results feed. Keep this function focused
    // on raw transport + payload validation so reconcilers stay unchanged.
    const parsed = owtvSnapshotSchema.pick({ matches: true }).parse({
      matches: mockMatches
    });

    console.info(`${logPrefix} Completed with ${parsed.matches.length} matches.`);
    return parsed.matches;
  } catch (error) {
    console.error(`${logPrefix} Failed to fetch matches.`, error);
    throw new Error("OWTV matches fetch failed.");
  }
}
