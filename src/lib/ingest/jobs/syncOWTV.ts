import { owtvConnector } from "@/lib/ingest/connectors/owtvConnector";
import { runSourceSync } from "@/lib/ingest/jobs/sync-source";
import { normalizeOWTVSnapshot } from "@/lib/ingest/normalizers/owtv";

export function syncOWTV() {
  return runSourceSync({
    source: "OWTV",
    name: "owtv-sync",
    fetchSnapshot: () => owtvConnector.fetchSnapshot(),
    normalizeSnapshot: normalizeOWTVSnapshot
  });
}
