import type {
  IngestConnector,
  OfficialSnapshot
} from "@/lib/ingest/connectors/types";
import { officialSnapshotSchema } from "@/lib/ingest/connectors/types";
import { fetchNews } from "@/lib/ingest/connectors/official/fetchNews";
import { fetchRankings } from "@/lib/ingest/connectors/official/fetchRankings";
import { fetchSchedule } from "@/lib/ingest/connectors/official/fetchSchedule";

const logPrefix = "[officialConnector]";

export const officialConnector: IngestConnector<OfficialSnapshot> = {
  source: "OFFICIAL",
  async fetchSnapshot() {
    try {
      console.info(`${logPrefix} Starting official ingest snapshot.`);

      const [schedule, rankings, newsPosts] = await Promise.all([
        fetchSchedule(),
        fetchRankings(),
        fetchNews()
      ]);

      const snapshot = officialSnapshotSchema.parse({
        ...schedule,
        rankings,
        newsPosts
      });

      console.info(
        `${logPrefix} Snapshot ready with ${snapshot.teams.length} teams, ${snapshot.matches.length} matches and ${snapshot.newsPosts.length} news posts.`
      );

      return snapshot;
    } catch (error) {
      console.error(`${logPrefix} Snapshot build failed.`, error);
      throw new Error("Official connector snapshot failed.");
    }
  }
};
