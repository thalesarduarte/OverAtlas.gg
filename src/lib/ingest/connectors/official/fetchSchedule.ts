import type { OfficialSnapshot } from "@/lib/ingest/connectors/types";
import { officialSnapshotSchema } from "@/lib/ingest/connectors/types";

type OfficialSchedulePayload = Pick<
  OfficialSnapshot,
  "teams" | "players" | "tournaments" | "matches"
>;

const logPrefix = "[officialConnector/fetchSchedule]";

export async function fetchSchedule(): Promise<OfficialSchedulePayload> {
  try {
    console.info(`${logPrefix} Starting schedule fetch.`);

    const payload = {
      teams: [
        {
          id: "official-team-falcons",
          displayName: "Team Falcons",
          shortName: "Falcons",
          region: "EMEA",
          summary: "Roster de elite com forte presenca em eventos internacionais.",
          aliases: ["Falcons"],
          roster: [
            { id: "official-player-proper", handle: "Proper", role: "DPS", aliases: ["PROPER"] },
            { id: "official-player-hanbin", handle: "Hanbin", role: "Tank" }
          ]
        },
        {
          id: "official-team-crazy-raccoon",
          displayName: "Crazy Raccoon",
          shortName: "CR",
          region: "APAC",
          summary: "Equipe consistente em playoffs e torneios de elite.",
          aliases: ["CR"],
          roster: [{ id: "official-player-shu", handle: "Shu", role: "Support" }]
        },
        {
          id: "official-team-spacestation-gaming",
          displayName: "Spacestation Gaming",
          shortName: "SSG",
          region: "NA",
          summary: "Organizacao consistente em classificatorias e eventos principais.",
          aliases: ["SSG", "Spacestation"]
        }
      ],
      players: [
        {
          id: "official-player-proper",
          handle: "Proper",
          realName: "Kim Dong-hyun",
          region: "KR",
          role: "DPS",
          summary: "Hitscan e flex DPS de alto impacto.",
          aliases: ["PROPER"],
          currentTeam: "Team Falcons"
        },
        {
          id: "official-player-hanbin",
          handle: "Hanbin",
          realName: "Choi Han-been",
          region: "KR",
          role: "Tank",
          currentTeam: "Team Falcons"
        },
        {
          id: "official-player-shu",
          handle: "Shu",
          realName: "Kim Jin-seo",
          region: "KR",
          role: "Support",
          currentTeam: "Crazy Raccoon"
        }
      ],
      tournaments: [
        {
          id: "official-tournament-owcs-stage-1-2026",
          displayName: "OWCS Stage 1 2026",
          shortName: "OWCS S1",
          location: "Online",
          startDate: "2026-03-10T00:00:00.000Z",
          endDate: "2026-04-12T00:00:00.000Z",
          prizePool: "$250,000",
          aliases: ["OWCS Stage 1"],
          stages: [
            {
              id: "official-stage-regular-season",
              name: "Regular Season",
              type: "GROUP",
              order: 1,
              startDate: "2026-03-10T00:00:00.000Z",
              endDate: "2026-03-30T00:00:00.000Z"
            },
            {
              id: "official-stage-playoffs",
              name: "Playoffs",
              type: "PLAYOFF",
              order: 2,
              startDate: "2026-04-01T00:00:00.000Z",
              endDate: "2026-04-12T00:00:00.000Z"
            }
          ]
        },
        {
          id: "official-tournament-midseason-2026",
          displayName: "OWCS Midseason Clash 2026",
          shortName: "Midseason Clash",
          location: "Stockholm",
          startDate: "2026-05-02T00:00:00.000Z",
          endDate: "2026-05-18T00:00:00.000Z",
          prizePool: "$400,000",
          aliases: ["OWCS Midseason Clash"]
        }
      ],
      matches: [
        {
          id: "official-match-falcons-cr",
          tournamentName: "OWCS Stage 1 2026",
          tournamentAliases: ["OWCS Stage 1"],
          stageName: "Playoffs",
          homeTeam: "Team Falcons",
          awayTeam: "Crazy Raccoon",
          winnerTeam: "Team Falcons",
          status: "COMPLETED" as const,
          scheduledAt: "2026-04-06T16:00:00.000Z",
          completedAt: "2026-04-06T18:00:00.000Z",
          bestOf: 5,
          scoreHome: 3,
          scoreAway: 1
        },
        {
          id: "official-match-ssg-falcons",
          tournamentName: "OWCS Midseason Clash 2026",
          tournamentAliases: ["OWCS Midseason Clash"],
          stageName: "Opening Weekend",
          homeTeam: "Spacestation Gaming",
          awayTeam: "Team Falcons",
          status: "SCHEDULED" as const,
          scheduledAt: "2026-05-03T19:00:00.000Z",
          bestOf: 5
        }
      ]
    };

    const parsed = officialSnapshotSchema
      .pick({
        teams: true,
        players: true,
        tournaments: true,
        matches: true
      })
      .parse(payload);

    console.info(
      `${logPrefix} Completed with ${parsed.tournaments.length} tournaments and ${parsed.matches.length} matches.`
    );

    return parsed;
  } catch (error) {
    console.error(`${logPrefix} Failed to fetch schedule.`, error);
    throw new Error("Official schedule fetch failed.");
  }
}
