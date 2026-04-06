import { officialConnector } from "@/lib/ingest/connectors/officialConnector";
import { normalizeOfficialSnapshot } from "@/lib/ingest/normalizers/official";
import { runSourceSync } from "@/lib/ingest/jobs/sync-source";

export function syncOfficial() {
  return runSourceSync({
    source: "OFFICIAL",
    name: "official-sync",
    fetchSnapshot: () => officialConnector.fetchSnapshot(),
    normalizeSnapshot: normalizeOfficialSnapshot
  });
}
