import type { OfficialSnapshot } from "@/lib/ingest/connectors/types";
import { officialSnapshotSchema } from "@/lib/ingest/connectors/types";

const logPrefix = "[officialConnector/fetchRankings]";

export async function fetchRankings(): Promise<OfficialSnapshot["rankings"]> {
  try {
    console.info(`${logPrefix} Starting rankings fetch.`);

    const parsed = officialSnapshotSchema
      .pick({
        rankings: true
      })
      .parse({
        rankings: [
          {
            id: "official-ranking-falcons-owcs-s1",
            tournamentName: "OWCS Stage 1 2026",
            teamName: "Team Falcons",
            teamAliases: ["Falcons"],
            position: 1,
            points: 21,
            wins: 7,
            losses: 1,
            record: "7-1"
          },
          {
            id: "official-ranking-cr-owcs-s1",
            tournamentName: "OWCS Stage 1 2026",
            teamName: "Crazy Raccoon",
            teamAliases: ["CR"],
            position: 2,
            points: 18,
            wins: 6,
            losses: 2,
            record: "6-2"
          },
          {
            id: "official-ranking-ssg-midseason",
            tournamentName: "OWCS Midseason Clash 2026",
            teamName: "Spacestation Gaming",
            teamAliases: ["SSG"],
            position: 4,
            points: 11,
            wins: 3,
            losses: 2,
            record: "3-2"
          }
        ]
      });

    console.info(`${logPrefix} Completed with ${parsed.rankings.length} ranking rows.`);
    return parsed.rankings;
  } catch (error) {
    console.error(`${logPrefix} Failed to fetch rankings.`, error);
    throw new Error("Official rankings fetch failed.");
  }
}
