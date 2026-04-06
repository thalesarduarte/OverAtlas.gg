import { z } from "zod";

import { ingestSourceSchema } from "@/lib/ingest/connectors/types";

export const externalRefSchema = z.object({
  source: ingestSourceSchema,
  entityType: z.enum([
    "TEAM",
    "TEAM_RANKING",
    "PLAYER",
    "TOURNAMENT",
    "TOURNAMENT_STAGE",
    "MATCH",
    "NEWS_POST"
  ]),
  externalId: z.string(),
  url: z.string().optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional()
});

export const normalizedRosterMemberSchema = z.object({
  name: z.string(),
  canonicalName: z.string(),
  aliases: z.array(z.string()).default([]),
  role: z.string().optional(),
  joinedAt: z.date().nullable().optional(),
  leftAt: z.date().nullable().optional(),
  isActive: z.boolean().optional(),
  externalRefs: z.array(externalRefSchema).default([])
});

export const normalizedTeamSchema = z.object({
  name: z.string(),
  canonicalName: z.string(),
  slug: z.string(),
  shortName: z.string().optional(),
  region: z.string().optional(),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
  aliases: z.array(z.string()).default([]),
  externalRefs: z.array(externalRefSchema).default([]),
  ranking: z
    .object({
      position: z.number().int(),
      tournamentName: z.string().optional(),
      tournamentAliases: z.array(z.string()).default([]),
      points: z.number().int().optional(),
      wins: z.number().int().optional(),
      losses: z.number().int().optional(),
      draws: z.number().int().optional(),
      record: z.string().optional(),
      sourceLabel: z.string().optional(),
      externalRefs: z.array(externalRefSchema).default([])
    })
    .optional(),
  roster: z.array(normalizedRosterMemberSchema).default([])
});

export const normalizedPlayerSchema = z.object({
  name: z.string(),
  canonicalName: z.string(),
  slug: z.string(),
  realName: z.string().optional(),
  region: z.string().optional(),
  role: z.string().optional(),
  photoUrl: z.string().optional(),
  description: z.string().optional(),
  aliases: z.array(z.string()).default([]),
  currentTeamName: z.string().optional(),
  currentTeamAliases: z.array(z.string()).default([]),
  externalRefs: z.array(externalRefSchema).default([])
});

export const normalizedTournamentStageSchema = z.object({
  name: z.string(),
  canonicalName: z.string(),
  slug: z.string(),
  stageType: z.string().optional(),
  order: z.number().int().optional(),
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
  aliases: z.array(z.string()).default([]),
  aliasCanonicalNames: z.array(z.string()).default([]),
  externalRefs: z.array(externalRefSchema).default([])
});

export const normalizedTournamentSchema = z.object({
  name: z.string(),
  canonicalName: z.string(),
  slug: z.string(),
  shortName: z.string().optional(),
  location: z.string().optional(),
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
  prizePool: z.string().optional(),
  description: z.string().optional(),
  aliases: z.array(z.string()).default([]),
  aliasCanonicalNames: z.array(z.string()).default([]),
  externalRefs: z.array(externalRefSchema).default([]),
  stages: z.array(normalizedTournamentStageSchema).default([])
});

export const normalizedMatchSchema = z.object({
  name: z.string(),
  canonicalName: z.string(),
  slug: z.string(),
  tournamentName: z.string(),
  tournamentAliases: z.array(z.string()).default([]),
  stageName: z.string().optional(),
  homeTeamName: z.string(),
  homeTeamAliases: z.array(z.string()).default([]),
  awayTeamName: z.string(),
  awayTeamAliases: z.array(z.string()).default([]),
  winnerTeamName: z.string().optional(),
  status: z.enum(["SCHEDULED", "LIVE", "COMPLETED", "CANCELED"]).default("SCHEDULED"),
  scheduledAt: z.date().nullable().optional(),
  completedAt: z.date().nullable().optional(),
  bestOf: z.number().int().optional(),
  scoreHome: z.number().int().optional(),
  scoreAway: z.number().int().optional(),
  vodUrl: z.string().optional(),
  sourceLabel: z.string().optional(),
  externalRefs: z.array(externalRefSchema).default([])
});

export const normalizedNewsPostSchema = z.object({
  title: z.string(),
  canonicalName: z.string(),
  slug: z.string(),
  excerpt: z.string().optional(),
  body: z.string().optional(),
  tag: z.string().optional(),
  url: z.string().optional(),
  imageUrl: z.string().optional(),
  source: ingestSourceSchema,
  publishedAt: z.date().nullable().optional(),
  externalRefs: z.array(externalRefSchema).default([])
});

export const normalizedBundleSchema = z.object({
  teams: z.array(normalizedTeamSchema),
  players: z.array(normalizedPlayerSchema),
  tournaments: z.array(normalizedTournamentSchema),
  matches: z.array(normalizedMatchSchema),
  newsPosts: z.array(normalizedNewsPostSchema).default([])
});

export type NormalizedExternalRef = z.infer<typeof externalRefSchema>;
export type NormalizedTeam = z.infer<typeof normalizedTeamSchema>;
export type NormalizedPlayer = z.infer<typeof normalizedPlayerSchema>;
export type NormalizedTournament = z.infer<typeof normalizedTournamentSchema>;
export type NormalizedTournamentStage = z.infer<typeof normalizedTournamentStageSchema>;
export type NormalizedMatch = z.infer<typeof normalizedMatchSchema>;
export type NormalizedNewsPost = z.infer<typeof normalizedNewsPostSchema>;
export type NormalizedBundle = z.infer<typeof normalizedBundleSchema>;
