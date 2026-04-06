import type { IngestConnector, OWTVSnapshot } from "@/lib/ingest/connectors/types";
import { owtvSnapshotSchema } from "@/lib/ingest/connectors/types";
import { fetchMatches } from "@/lib/ingest/connectors/owtv/fetchMatches";
import { fetchNews } from "@/lib/ingest/connectors/owtv/fetchNews";
import { fetchTournaments } from "@/lib/ingest/connectors/owtv/fetchTournaments";

const logPrefix = "[owtvConnector]";

const supplementalTeams: OWTVSnapshot["teams"] = [
  {
    key: "owtv:team-falcons",
    title: "Team Falcons",
    shortLabel: "Falcons",
    regionCode: "EMEA",
    logo: "https://images.example.com/falcons-logo.png",
    blurb: "Organizacao com cobertura frequente em eventos internacionais.",
    knownAs: ["TF", "Falcons"],
    players: [
      { key: "owtv:proper", name: "Proper", role: "DPS", knownAs: ["PROPER"] },
      { key: "owtv:hanbin", name: "Hanbin", role: "Tank" }
    ]
  },
  {
    key: "owtv:spacestation-gaming",
    title: "Spacestation Gaming",
    shortLabel: "SSG",
    regionCode: "NA",
    knownAs: ["Spacestation", "SSG"]
  },
  {
    key: "owtv:crazy-raccoon",
    title: "Crazy Raccoon",
    shortLabel: "CR",
    regionCode: "APAC",
    knownAs: ["CR"],
    players: [{ key: "owtv:shu", name: "Shu", role: "Support" }]
  }
];

const supplementalPlayers: OWTVSnapshot["players"] = [
  {
    key: "owtv:proper",
    name: "Proper",
    fullName: "Kim Dong-hyun",
    regionCode: "KR",
    primaryRole: "DPS",
    activeTeam: "Team Falcons",
    knownAs: ["PROPER"]
  },
  {
    key: "owtv:hanbin",
    name: "Hanbin",
    fullName: "Choi Han-been",
    regionCode: "KR",
    primaryRole: "Tank",
    activeTeam: "Team Falcons"
  },
  {
    key: "owtv:shu",
    name: "Shu",
    fullName: "Kim Jin-seo",
    regionCode: "KR",
    primaryRole: "Support",
    activeTeam: "Crazy Raccoon"
  }
];

export const owtvConnector: IngestConnector<OWTVSnapshot> = {
  source: "OWTV",
  async fetchSnapshot() {
    try {
      console.info(`${logPrefix} Starting OWTV snapshot.`);

      const [tournaments, matches, newsPosts] = await Promise.all([
        fetchTournaments(),
        fetchMatches(),
        fetchNews()
      ]);

      const snapshot = owtvSnapshotSchema.parse({
        teams: supplementalTeams,
        players: supplementalPlayers,
        tournaments,
        matches,
        newsPosts
      });

      console.info(
        `${logPrefix} Snapshot ready with ${snapshot.tournaments.length} tournaments, ${snapshot.matches.length} matches and ${snapshot.newsPosts.length} news posts.`
      );

      return snapshot;
    } catch (error) {
      console.error(`${logPrefix} Snapshot build failed.`, error);
      throw new Error("OWTV connector snapshot failed.");
    }
  }
};
