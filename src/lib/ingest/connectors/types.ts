import { z } from "zod";

export const ingestSourceSchema = z.enum(["OFFICIAL", "LIQUIPEDIA", "OWTV"]);
export type IngestSource = z.infer<typeof ingestSourceSchema>;

const rawRosterMemberSchema = z.object({
  id: z.string(),
  handle: z.string(),
  role: z.string().optional(),
  aliases: z.array(z.string()).optional()
});

export const officialSnapshotSchema = z.object({
  teams: z.array(
    z.object({
      id: z.string(),
      displayName: z.string(),
      shortName: z.string().optional(),
      region: z.string().optional(),
      logoUrl: z.string().optional(),
      summary: z.string().optional(),
      aliases: z.array(z.string()).optional(),
      roster: z.array(rawRosterMemberSchema).optional()
    })
  ),
  players: z.array(
    z.object({
      id: z.string(),
      handle: z.string(),
      realName: z.string().optional(),
      region: z.string().optional(),
      role: z.string().optional(),
      photoUrl: z.string().optional(),
      summary: z.string().optional(),
      aliases: z.array(z.string()).optional(),
      currentTeam: z.string().optional()
    })
  ),
  tournaments: z.array(
    z.object({
      id: z.string(),
      displayName: z.string(),
      shortName: z.string().optional(),
      location: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      prizePool: z.string().optional(),
      summary: z.string().optional(),
      aliases: z.array(z.string()).optional(),
      stages: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            type: z.string().optional(),
            order: z.number().int().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            aliases: z.array(z.string()).optional()
          })
        )
        .optional()
    })
  ),
  matches: z.array(
    z.object({
      id: z.string(),
      tournamentName: z.string(),
      tournamentAliases: z.array(z.string()).optional(),
      stageName: z.string().optional(),
      homeTeam: z.string(),
      awayTeam: z.string(),
      winnerTeam: z.string().optional(),
      status: z.enum(["SCHEDULED", "LIVE", "COMPLETED", "CANCELED"]).optional(),
      scheduledAt: z.string().optional(),
      completedAt: z.string().optional(),
      bestOf: z.number().int().optional(),
      scoreHome: z.number().int().optional(),
      scoreAway: z.number().int().optional(),
      vodUrl: z.string().optional()
    })
  ),
  rankings: z.array(
    z.object({
      id: z.string(),
      tournamentName: z.string().optional(),
      teamName: z.string(),
      teamAliases: z.array(z.string()).optional(),
      position: z.number().int(),
      points: z.number().int().optional(),
      wins: z.number().int().optional(),
      losses: z.number().int().optional(),
      draws: z.number().int().optional(),
      record: z.string().optional()
    })
  ),
  newsPosts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      excerpt: z.string().optional(),
      body: z.string().optional(),
      tag: z.string().optional(),
      url: z.string().optional(),
      imageUrl: z.string().optional(),
      publishedAt: z.string().optional()
    })
  )
});

export const liquipediaSnapshotSchema = z.object({
  teams: z.array(
    z.object({
      pageId: z.string(),
      name: z.string(),
      acronym: z.string().optional(),
      region: z.string().optional(),
      logo: z.string().optional(),
      description: z.string().optional(),
      aliases: z.array(z.string()).optional()
    })
  ),
  players: z.array(
    z.object({
      pageId: z.string(),
      tag: z.string(),
      realName: z.string().optional(),
      region: z.string().optional(),
      role: z.string().optional(),
      image: z.string().optional(),
      description: z.string().optional(),
      aliases: z.array(z.string()).optional(),
      team: z.string().optional()
    })
  ),
  tournaments: z.array(
    z.object({
      pageId: z.string(),
      name: z.string(),
      shortName: z.string().optional(),
      location: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      prizePool: z.string().optional(),
      description: z.string().optional(),
      aliases: z.array(z.string()).optional(),
      stages: z
        .array(
          z.object({
            pageId: z.string(),
            name: z.string(),
            stageType: z.string().optional(),
            order: z.number().int().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            aliases: z.array(z.string()).optional()
          })
        )
        .optional()
    })
  ),
  rosterEntries: z.array(
    z.object({
      pageId: z.string(),
      team: z.string(),
      teamAliases: z.array(z.string()).optional(),
      player: z.string(),
      playerAliases: z.array(z.string()).optional(),
      role: z.string().optional(),
      joinedAt: z.string().optional(),
      leftAt: z.string().optional(),
      isActive: z.boolean().optional()
    })
  ),
  matchSummaries: z.array(
    z.object({
      pageId: z.string(),
      tournament: z.string(),
      tournamentAliases: z.array(z.string()).optional(),
      phase: z.string().optional(),
      team1: z.string(),
      team1Aliases: z.array(z.string()).optional(),
      team2: z.string(),
      team2Aliases: z.array(z.string()).optional(),
      winner: z.string().optional(),
      state: z.enum(["SCHEDULED", "LIVE", "COMPLETED", "CANCELED"]).optional(),
      date: z.string().optional(),
      endDate: z.string().optional(),
      bestOf: z.number().int().optional(),
      score1: z.number().int().optional(),
      score2: z.number().int().optional(),
      vod: z.string().optional()
    })
  )
});

export const owtvSnapshotSchema = z.object({
  teams: z.array(
    z.object({
      key: z.string(),
      title: z.string(),
      shortLabel: z.string().optional(),
      regionCode: z.string().optional(),
      logo: z.string().optional(),
      blurb: z.string().optional(),
      knownAs: z.array(z.string()).optional(),
      players: z
        .array(
          z.object({
            key: z.string(),
            name: z.string(),
            role: z.string().optional(),
            knownAs: z.array(z.string()).optional()
          })
        )
        .optional()
    })
  ),
  players: z.array(
    z.object({
      key: z.string(),
      name: z.string(),
      fullName: z.string().optional(),
      regionCode: z.string().optional(),
      primaryRole: z.string().optional(),
      imageUrl: z.string().optional(),
      blurb: z.string().optional(),
      knownAs: z.array(z.string()).optional(),
      activeTeam: z.string().optional()
    })
  ),
  tournaments: z.array(
    z.object({
      key: z.string(),
      title: z.string(),
      shortLabel: z.string().optional(),
      city: z.string().optional(),
      startsOn: z.string().optional(),
      endsOn: z.string().optional(),
      prizePool: z.string().optional(),
      blurb: z.string().optional(),
      knownAs: z.array(z.string()).optional(),
      phases: z
        .array(
          z.object({
            key: z.string(),
            title: z.string(),
            phaseType: z.string().optional(),
            order: z.number().int().optional(),
            startsOn: z.string().optional(),
            endsOn: z.string().optional(),
            knownAs: z.array(z.string()).optional()
          })
        )
        .optional()
    })
  ),
  matches: z.array(
    z.object({
      key: z.string(),
      event: z.string(),
      eventAliases: z.array(z.string()).optional(),
      phase: z.string().optional(),
      leftTeam: z.string(),
      rightTeam: z.string(),
      victor: z.string().optional(),
      status: z.enum(["SCHEDULED", "LIVE", "COMPLETED", "CANCELED"]).optional(),
      startsOn: z.string().optional(),
      endsOn: z.string().optional(),
      bestOf: z.number().int().optional(),
      leftScore: z.number().int().optional(),
      rightScore: z.number().int().optional(),
      vodUrl: z.string().optional()
    })
  ),
  newsPosts: z.array(
    z.object({
      key: z.string(),
      title: z.string(),
      excerpt: z.string().optional(),
      body: z.string().optional(),
      tag: z.string().optional(),
      url: z.string().optional(),
      imageUrl: z.string().optional(),
      publishedAt: z.string().optional()
    })
  )
});

export type OfficialSnapshot = z.infer<typeof officialSnapshotSchema>;
export type LiquipediaSnapshot = z.infer<typeof liquipediaSnapshotSchema>;
export type OWTVSnapshot = z.infer<typeof owtvSnapshotSchema>;

export interface IngestConnector<TSnapshot> {
  source: IngestSource;
  fetchSnapshot(): Promise<TSnapshot>;
}
