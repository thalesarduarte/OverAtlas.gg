import { syncLiquipedia } from "@/lib/ingest/jobs/syncLiquipedia";
import { syncOfficial } from "@/lib/ingest/jobs/syncOfficial";
import { syncOWTV } from "@/lib/ingest/jobs/syncOWTV";

export async function syncDaily() {
  const official = await syncOfficial();
  const liquipedia = await syncLiquipedia();
  const owtv = await syncOWTV();

  return {
    official,
    liquipedia,
    owtv
  };
}
