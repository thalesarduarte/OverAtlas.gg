import type { OWTVSnapshot } from "@/lib/ingest/connectors/types";
import { owtvSnapshotSchema } from "@/lib/ingest/connectors/types";

const logPrefix = "[owtvConnector/fetchTournaments]";

const mockTournaments: OWTVSnapshot["tournaments"] = [
  {
    key: "owtv:owcs-stage-1-2026",
    title: "OWCS Stage 1 2026",
    shortLabel: "OWCS S1",
    city: "Online",
    startsOn: "2026-03-10T00:00:00.000Z",
    endsOn: "2026-04-12T00:00:00.000Z",
    prizePool: "$250,000",
    blurb: "Cobertura de calendario e janelas competitivas da temporada.",
    knownAs: ["OWCS 2026 Stage 1"],
    phases: [
      {
        key: "owtv:playoffs",
        title: "Playoffs",
        phaseType: "PLAYOFF",
        order: 2,
        startsOn: "2026-04-01T00:00:00.000Z",
        endsOn: "2026-04-12T00:00:00.000Z"
      }
    ]
  },
  {
    key: "owtv:midseason-clash-2026",
    title: "OWCS Midseason Clash 2026",
    shortLabel: "Midseason Clash",
    city: "Stockholm",
    startsOn: "2026-05-02T00:00:00.000Z",
    endsOn: "2026-05-18T00:00:00.000Z",
    prizePool: "$400,000",
    blurb: "Evento internacional com foco em cobertura de transmissao.",
    knownAs: ["OWCS Midseason Clash"]
  }
];

export async function fetchTournaments(): Promise<OWTVSnapshot["tournaments"]> {
  try {
    console.info(`${logPrefix} Starting tournaments fetch.`);

    // TODO: Replace this with the real OWTV endpoint once authenticated access details
    // and payload shape are confirmed. Keep the mapping isolated in this function.
    const parsed = owtvSnapshotSchema.pick({ tournaments: true }).parse({
      tournaments: mockTournaments
    });

    console.info(`${logPrefix} Completed with ${parsed.tournaments.length} tournaments.`);
    return parsed.tournaments;
  } catch (error) {
    console.error(`${logPrefix} Failed to fetch tournaments.`, error);
    throw new Error("OWTV tournaments fetch failed.");
  }
}
