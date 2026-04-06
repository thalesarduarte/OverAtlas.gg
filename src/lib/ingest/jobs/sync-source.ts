import type { ExternalSource, SyncJob } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { NormalizedBundle } from "@/lib/ingest/normalizers/schemas";
import { upsertMatch } from "@/lib/ingest/upserts/upsertMatch";
import { upsertNewsPost } from "@/lib/ingest/upserts/upsertNewsPost";
import { upsertPlayer } from "@/lib/ingest/upserts/upsertPlayer";
import { upsertTeam } from "@/lib/ingest/upserts/upsertTeam";
import { upsertTournament } from "@/lib/ingest/upserts/upsertTournament";

type SyncPayload<TSnapshot> = {
  source: ExternalSource;
  name: string;
  fetchSnapshot: () => Promise<TSnapshot>;
  normalizeSnapshot: (snapshot: TSnapshot) => NormalizedBundle;
};

export type SyncSummary = {
  source: ExternalSource;
  teams: { processed: number; created: number; updated: number };
  players: { processed: number; created: number; updated: number };
  tournaments: { processed: number; created: number; updated: number };
  matches: { processed: number; created: number; updated: number };
  newsPosts: { processed: number; created: number; updated: number };
};

export type SyncExecutionResult = {
  job: SyncJob;
  summary: SyncSummary;
};

const emptySummary: SyncSummary = {
  source: "MANUAL",
  teams: { processed: 0, created: 0, updated: 0 },
  players: { processed: 0, created: 0, updated: 0 },
  tournaments: { processed: 0, created: 0, updated: 0 },
  matches: { processed: 0, created: 0, updated: 0 },
  newsPosts: { processed: 0, created: 0, updated: 0 }
};

export async function runSourceSync<TSnapshot>(
  payload: SyncPayload<TSnapshot>
): Promise<SyncExecutionResult> {
  console.info(`[sync:${payload.source}] Starting ${payload.name}.`);

  const job = await prisma.syncJob.create({
    data: {
      source: payload.source,
      name: payload.name,
      status: "RUNNING"
    }
  });

  try {
    const snapshot = await payload.fetchSnapshot();
    const normalized = payload.normalizeSnapshot(snapshot);

    const summary = await prisma.$transaction(async (tx) => {
      const summary: SyncSummary = {
        source: payload.source,
        teams: { processed: 0, created: 0, updated: 0 },
        players: { processed: 0, created: 0, updated: 0 },
        tournaments: { processed: 0, created: 0, updated: 0 },
        matches: { processed: 0, created: 0, updated: 0 },
        newsPosts: { processed: 0, created: 0, updated: 0 }
      };

      for (const tournament of normalized.tournaments) {
        const result = await upsertTournament(tx, tournament);
        summary.tournaments.processed += 1;
        summary.tournaments[result.operation] += 1;
      }

      for (const team of normalized.teams) {
        const result = await upsertTeam(tx, team);
        summary.teams.processed += 1;
        summary.teams[result.operation] += 1;
      }

      for (const player of normalized.players) {
        const result = await upsertPlayer(tx, player);
        summary.players.processed += 1;
        summary.players[result.operation] += 1;
      }

      for (const match of normalized.matches) {
        const result = await upsertMatch(tx, match);
        summary.matches.processed += 1;
        summary.matches[result.operation] += 1;
      }

      for (const newsPost of normalized.newsPosts) {
        const result = await upsertNewsPost(tx, newsPost);
        summary.newsPosts.processed += 1;
        summary.newsPosts[result.operation] += 1;
      }

      return summary;
    });

    const completedJob = await prisma.syncJob.update({
      where: {
        id: job.id
      },
      data: {
        status: "SUCCEEDED",
        finishedAt: new Date(),
        result: summary
      }
    });

    console.info(
      `[sync:${payload.source}] Finished ${payload.name}. teams=${summary.teams.processed} (${summary.teams.created} created/${summary.teams.updated} updated), players=${summary.players.processed} (${summary.players.created}/${summary.players.updated}), tournaments=${summary.tournaments.processed} (${summary.tournaments.created}/${summary.tournaments.updated}), matches=${summary.matches.processed} (${summary.matches.created}/${summary.matches.updated}), news=${summary.newsPosts.processed} (${summary.newsPosts.created}/${summary.newsPosts.updated}).`
    );

    return {
      job: completedJob,
      summary
    };
  } catch (error) {
    const completedJob = await prisma.syncJob.update({
      where: {
        id: job.id
      },
      data: {
        status: "FAILED",
        finishedAt: new Date(),
        error: error instanceof Error ? error.message : "Unknown sync error",
        result: {
          ...emptySummary,
          source: payload.source
        }
      }
    });

    console.error(
      `[sync:${payload.source}] Failed ${payload.name}.`,
      error instanceof Error ? error.message : error
    );

    throw Object.assign(
      new Error(error instanceof Error ? error.message : "Unknown sync error"),
      { job: completedJob }
    );
  }
}
