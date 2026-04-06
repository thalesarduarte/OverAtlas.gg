import { liquipediaConnector } from "@/lib/ingest/connectors/liquipediaConnector";
import { runSourceSync } from "@/lib/ingest/jobs/sync-source";
import { normalizeLiquipediaSnapshot } from "@/lib/ingest/normalizers/liquipedia";

export function syncLiquipedia() {
  return runSourceSync({
    source: "LIQUIPEDIA",
    name: "liquipedia-sync",
    fetchSnapshot: () => liquipediaConnector.fetchSnapshot(),
    normalizeSnapshot: normalizeLiquipediaSnapshot
  });
}
