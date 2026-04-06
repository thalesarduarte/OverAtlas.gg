import type { LiquipediaSnapshot } from "@/lib/ingest/connectors/types";

export const mockLiquipediaTournaments: LiquipediaSnapshot["tournaments"] = [
  {
    pageId: "Liquipedia:OWCS_2025_Championship",
    name: "OWCS 2025 Championship",
    shortName: "OWCS 2025",
    location: "Seoul",
    startDate: "2025-09-12T00:00:00.000Z",
    endDate: "2025-09-28T00:00:00.000Z",
    prizePool: "$500,000",
    description: "Evento historico com os melhores seeds internacionais.",
    aliases: ["OWCS Championship 2025"],
    stages: [
      {
        pageId: "Liquipedia:OWCS_2025_Championship_Playoffs",
        name: "Playoffs",
        stageType: "PLAYOFF",
        order: 2,
        startDate: "2025-09-22T00:00:00.000Z",
        endDate: "2025-09-28T00:00:00.000Z"
      }
    ]
  },
  {
    pageId: "Liquipedia:Overwatch_League_2024_Playoffs",
    name: "Overwatch League 2024 Playoffs",
    shortName: "OWL 2024 Playoffs",
    location: "Toronto",
    startDate: "2024-10-04T00:00:00.000Z",
    endDate: "2024-10-13T00:00:00.000Z",
    prizePool: "$350,000",
    aliases: ["OWL Playoffs 2024"]
  }
];

export const mockLiquipediaTeams: LiquipediaSnapshot["teams"] = [
  {
    pageId: "Liquipedia:Team_Falcons",
    name: "Falcons",
    acronym: "TF",
    region: "EMEA",
    logo: "https://images.example.com/falcons-logo.png",
    description: "Pagina enciclopedica da organizacao e suas campanhas por temporada.",
    aliases: ["Team Falcons"]
  },
  {
    pageId: "Liquipedia:Crazy_Raccoon",
    name: "Crazy Raccoon",
    acronym: "CR",
    region: "APAC",
    logo: "https://images.example.com/crazy-raccoon-logo.png",
    aliases: ["CR"]
  },
  {
    pageId: "Liquipedia:Spacestation_Gaming",
    name: "Spacestation Gaming",
    acronym: "SSG",
    region: "NA",
    aliases: ["Spacestation", "SSG"]
  }
];

export const mockLiquipediaPlayers: LiquipediaSnapshot["players"] = [
  {
    pageId: "Liquipedia:Proper",
    tag: "Proper",
    realName: "Kim Dong-hyun",
    region: "KR",
    role: "DPS",
    image: "https://images.example.com/proper.png",
    description: "Jogador historico com passagens por multiplos eventos internacionais.",
    aliases: ["PROPER"],
    team: "Falcons"
  },
  {
    pageId: "Liquipedia:Hanbin",
    tag: "Hanbin",
    realName: "Choi Han-been",
    region: "KR",
    role: "Tank",
    team: "Falcons"
  },
  {
    pageId: "Liquipedia:Shu",
    tag: "Shu",
    realName: "Kim Jin-seo",
    region: "KR",
    role: "Support",
    team: "Crazy Raccoon"
  }
];

export const mockLiquipediaRosterEntries: LiquipediaSnapshot["rosterEntries"] = [
  {
    pageId: "Liquipedia:Roster_Falcons_Proper",
    team: "Falcons",
    teamAliases: ["Team Falcons"],
    player: "Proper",
    playerAliases: ["PROPER"],
    role: "DPS",
    joinedAt: "2025-01-12T00:00:00.000Z",
    isActive: true
  },
  {
    pageId: "Liquipedia:Roster_Falcons_Hanbin",
    team: "Falcons",
    teamAliases: ["Team Falcons"],
    player: "Hanbin",
    role: "Tank",
    joinedAt: "2025-01-12T00:00:00.000Z",
    isActive: true
  },
  {
    pageId: "Liquipedia:Roster_CR_Shu",
    team: "Crazy Raccoon",
    teamAliases: ["CR"],
    player: "Shu",
    role: "Support",
    joinedAt: "2025-02-01T00:00:00.000Z",
    isActive: true
  }
];

export const mockLiquipediaMatchSummaries: LiquipediaSnapshot["matchSummaries"] = [
  {
    pageId: "Liquipedia:Match_Falcons_vs_CR_2025",
    tournament: "OWCS 2025 Championship",
    tournamentAliases: ["OWCS Championship 2025"],
    phase: "Playoffs",
    team1: "Falcons",
    team1Aliases: ["Team Falcons"],
    team2: "Crazy Raccoon",
    team2Aliases: ["CR"],
    winner: "Falcons",
    state: "COMPLETED",
    date: "2025-09-24T17:00:00.000Z",
    endDate: "2025-09-24T19:00:00.000Z",
    bestOf: 5,
    score1: 3,
    score2: 2
  },
  {
    pageId: "Liquipedia:Match_SSG_vs_Falcons_2024",
    tournament: "Overwatch League 2024 Playoffs",
    tournamentAliases: ["OWL Playoffs 2024"],
    phase: "Quarterfinal",
    team1: "Spacestation Gaming",
    team1Aliases: ["SSG"],
    team2: "Falcons",
    team2Aliases: ["Team Falcons"],
    winner: "Spacestation Gaming",
    state: "COMPLETED",
    date: "2024-10-06T18:00:00.000Z",
    endDate: "2024-10-06T20:00:00.000Z",
    bestOf: 5,
    score1: 3,
    score2: 1
  }
];
