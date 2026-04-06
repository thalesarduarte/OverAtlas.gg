import { MatchStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const DEFAULT_PAGE_SIZE = 9;

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export type TeamFilters = {
  query?: string;
  region?: string;
  sort?: "name" | "recent" | "ranking";
  page?: number;
  pageSize?: number;
};

export type PlayerFilters = {
  query?: string;
  role?: string;
  region?: string;
  sort?: "name" | "recent";
  page?: number;
  pageSize?: number;
};

export type TournamentFilters = {
  query?: string;
  status?: "upcoming" | "ongoing" | "completed";
  sort?: "date" | "name";
  page?: number;
  pageSize?: number;
};

export type MatchFilters = {
  query?: string;
  status?: MatchStatus | "ALL";
  page?: number;
  pageSize?: number;
};

export type NewsFilters = {
  query?: string;
  page?: number;
  pageSize?: number;
};

function getPagination(inputPage?: number, inputPageSize?: number) {
  const page = Math.max(1, inputPage ?? 1);
  const pageSize = Math.max(1, Math.min(24, inputPageSize ?? DEFAULT_PAGE_SIZE));

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize
  };
}

function buildPaginationMeta(
  page: number,
  pageSize: number,
  totalItems: number
): PaginationMeta {
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize))
  };
}

function buildContainsQuery(query?: string) {
  const value = query?.trim();

  if (!value) {
    return undefined;
  }

  return value;
}

function getTournamentStatus(tournament: {
  startDate?: Date | null;
  endDate?: Date | null;
}) {
  const now = new Date();

  if (tournament.startDate && tournament.startDate > now) {
    return "upcoming";
  }

  if (tournament.endDate && tournament.endDate < now) {
    return "completed";
  }

  return "ongoing";
}

export async function listTeams(filters: TeamFilters = {}) {
  const { page, pageSize, skip } = getPagination(filters.page, filters.pageSize);
  const query = buildContainsQuery(filters.query);

  const where: Prisma.TeamWhereInput = {
    ...(filters.region ? { region: filters.region } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { shortName: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const orderBy: Prisma.TeamOrderByWithRelationInput =
    filters.sort === "recent"
      ? { updatedAt: "desc" }
      : { name: "asc" };

  const [items, totalItems] = await Promise.all([
    prisma.team.findMany({
      where,
      include: {
        rankings: {
          include: {
            tournament: true
          },
          orderBy: [{ updatedAt: "desc" }, { position: "asc" }],
          take: 1
        },
        rosters: {
          where: {
            isActive: true
          },
          include: {
            player: true
          },
          orderBy: {
            createdAt: "asc"
          },
          take: 5
        }
      },
      orderBy,
      skip,
      take: pageSize
    }),
    prisma.team.count({ where })
  ]);

  return {
    items,
    pagination: buildPaginationMeta(page, pageSize, totalItems)
  } satisfies PaginatedResult<(typeof items)[number]>;
}

export async function getTeamBySlug(slug: string) {
  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      aliases: true,
      rankings: {
        include: {
          tournament: true
        },
        orderBy: [{ updatedAt: "desc" }, { position: "asc" }]
      },
      rosters: {
        include: {
          player: true,
          tournament: true
        },
        orderBy: [{ isActive: "desc" }, { joinedAt: "desc" }]
      },
      history: {
        include: {
          player: true
        },
        orderBy: [{ isCurrent: "desc" }, { updatedAt: "desc" }]
      },
      homeMatches: {
        include: {
          tournament: true,
          stage: true,
          homeTeam: true,
          awayTeam: true,
          winnerTeam: true
        },
        orderBy: { scheduledAt: "desc" },
        take: 10
      },
      awayMatches: {
        include: {
          tournament: true,
          stage: true,
          homeTeam: true,
          awayTeam: true,
          winnerTeam: true
        },
        orderBy: { scheduledAt: "desc" },
        take: 10
      }
    }
  });

  if (!team) {
    return null;
  }

  const recentMatches = [...team.homeMatches, ...team.awayMatches]
    .sort((left, right) => {
      const leftTime = left.scheduledAt?.getTime() ?? 0;
      const rightTime = right.scheduledAt?.getTime() ?? 0;
      return rightTime - leftTime;
    })
    .slice(0, 10);

  const relatedNews = await listNews({
    query: team.name,
    page: 1,
    pageSize: 6
  });

  return {
    ...team,
    recentMatches,
    relatedNews: relatedNews.items
  };
}

export async function listPlayers(filters: PlayerFilters = {}) {
  const { page, pageSize, skip } = getPagination(filters.page, filters.pageSize);
  const query = buildContainsQuery(filters.query);

  const where: Prisma.PlayerWhereInput = {
    ...(filters.role ? { role: filters.role } : {}),
    ...(filters.region ? { region: filters.region } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { realName: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const [items, totalItems] = await Promise.all([
    prisma.player.findMany({
      where,
      include: {
        team: true,
        history: {
          include: {
            team: true
          },
          where: {
            isCurrent: true
          },
          take: 1
        }
      },
      orderBy: filters.sort === "recent" ? { updatedAt: "desc" } : { name: "asc" },
      skip,
      take: pageSize
    }),
    prisma.player.count({ where })
  ]);

  return {
    items,
    pagination: buildPaginationMeta(page, pageSize, totalItems)
  } satisfies PaginatedResult<(typeof items)[number]>;
}

export async function getPlayerBySlug(slug: string) {
  const player = await prisma.player.findUnique({
    where: { slug },
    include: {
      team: true,
      aliases: true,
      rosters: {
        include: {
          team: true,
          tournament: true
        },
        orderBy: [{ isActive: "desc" }, { joinedAt: "desc" }]
      },
      history: {
        include: {
          team: true
        },
        orderBy: [{ isCurrent: "desc" }, { updatedAt: "desc" }]
      }
    }
  });

  if (!player) {
    return null;
  }

  const relatedMatches = await prisma.match.findMany({
    where: {
      OR: [
        {
          homeTeam: {
            players: {
              some: {
                id: player.id
              }
            }
          }
        },
        {
          awayTeam: {
            players: {
              some: {
                id: player.id
              }
            }
          }
        }
      ]
    },
    include: {
      tournament: true,
      stage: true,
      homeTeam: true,
      awayTeam: true,
      winnerTeam: true
    },
    orderBy: {
      scheduledAt: "desc"
    },
    take: 10
  });

  const relatedNews = await listNews({
    query: player.name,
    page: 1,
    pageSize: 6
  });

  return {
    ...player,
    relatedMatches,
    relatedNews: relatedNews.items
  };
}

export async function listTournaments(filters: TournamentFilters = {}) {
  const { page, pageSize, skip } = getPagination(filters.page, filters.pageSize);
  const query = buildContainsQuery(filters.query);

  const rawWhere: Prisma.TournamentWhereInput = {
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { shortName: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const [rawItems, totalItems] = await Promise.all([
    prisma.tournament.findMany({
      where: rawWhere,
      include: {
        stages: true,
        rankings: {
          include: {
            team: true
          },
          orderBy: {
            position: "asc"
          },
          take: 8
        },
        matches: {
          include: {
            homeTeam: true,
            awayTeam: true
          },
          orderBy: {
            scheduledAt: "asc"
          },
          take: 6
        }
      },
      orderBy: filters.sort === "name" ? { name: "asc" } : { startDate: "desc" },
      skip,
      take: pageSize
    }),
    prisma.tournament.count({ where: rawWhere })
  ]);

  const filteredItems = filters.status
    ? rawItems.filter((item) => getTournamentStatus(item) === filters.status)
    : rawItems;

  return {
    items: filteredItems,
    pagination: buildPaginationMeta(page, pageSize, totalItems)
  } satisfies PaginatedResult<(typeof rawItems)[number]>;
}

export async function getTournamentBySlug(slug: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { slug },
    include: {
      stages: {
        orderBy: [{ order: "asc" }, { startDate: "asc" }]
      },
      rankings: {
        include: {
          team: true
        },
        orderBy: {
          position: "asc"
        }
      },
      matches: {
        include: {
          stage: true,
          homeTeam: true,
          awayTeam: true,
          winnerTeam: true
        },
        orderBy: {
          scheduledAt: "asc"
        }
      },
      rosters: {
        include: {
          team: true,
          player: true
        },
        where: {
          isActive: true
        }
      }
    }
  });

  if (!tournament) {
    return null;
  }

  const relatedNews = await listNews({
    query: tournament.name,
    page: 1,
    pageSize: 6
  });

  return {
    ...tournament,
    derivedStatus: getTournamentStatus(tournament),
    participants: tournament.rankings.map((ranking) => ranking.team),
    relatedNews: relatedNews.items
  };
}

export async function listMatches(filters: MatchFilters = {}) {
  const { page, pageSize, skip } = getPagination(filters.page, filters.pageSize);
  const query = buildContainsQuery(filters.query);

  const where: Prisma.MatchWhereInput = {
    ...(filters.status && filters.status !== "ALL" ? { status: filters.status } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { tournament: { name: { contains: query, mode: "insensitive" } } },
            { homeTeam: { name: { contains: query, mode: "insensitive" } } },
            { awayTeam: { name: { contains: query, mode: "insensitive" } } }
          ]
        }
      : {})
  };

  const [items, totalItems] = await Promise.all([
    prisma.match.findMany({
      where,
      include: {
        tournament: true,
        stage: true,
        homeTeam: true,
        awayTeam: true,
        winnerTeam: true
      },
      orderBy: {
        scheduledAt: "desc"
      },
      skip,
      take: pageSize
    }),
    prisma.match.count({ where })
  ]);

  return {
    items,
    pagination: buildPaginationMeta(page, pageSize, totalItems)
  } satisfies PaginatedResult<(typeof items)[number]>;
}

export async function getMatchBySlug(slug: string) {
  const match = await prisma.match.findUnique({
    where: { slug },
    include: {
      tournament: true,
      stage: true,
      homeTeam: true,
      awayTeam: true,
      winnerTeam: true
    }
  });

  if (!match) {
    return null;
  }

  const relatedNews = await listNews({
    query: match.tournament?.name ?? match.name,
    page: 1,
    pageSize: 5
  });

  return {
    ...match,
    relatedNews: relatedNews.items
  };
}

export async function listNews(filters: NewsFilters = {}) {
  const { page, pageSize, skip } = getPagination(filters.page, filters.pageSize);
  const query = buildContainsQuery(filters.query);

  const where: Prisma.NewsPostWhereInput = query
    ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { body: { contains: query, mode: "insensitive" } },
          { tag: { contains: query, mode: "insensitive" } }
        ]
      }
    : {};

  const [items, totalItems] = await Promise.all([
    prisma.newsPost.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip,
      take: pageSize
    }),
    prisma.newsPost.count({ where })
  ]);

  return {
    items,
    pagination: buildPaginationMeta(page, pageSize, totalItems)
  } satisfies PaginatedResult<(typeof items)[number]>;
}

export async function getNewsPostBySlug(slug: string) {
  const newsPost = await prisma.newsPost.findUnique({
    where: { slug }
  });

  if (!newsPost) {
    return null;
  }

  const haystack = [newsPost.title, newsPost.excerpt, newsPost.body]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const [teams, players, tournaments, matches] = await Promise.all([
    prisma.team.findMany({
      take: 50,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.player.findMany({
      take: 50,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.tournament.findMany({
      take: 30,
      orderBy: { startDate: "desc" }
    }),
    prisma.match.findMany({
      include: {
        tournament: true,
        homeTeam: true,
        awayTeam: true
      },
      take: 20,
      orderBy: { scheduledAt: "desc" }
    })
  ]);

  return {
    ...newsPost,
    relatedEntities: {
      teams: teams.filter((team) => haystack.includes(team.name.toLowerCase())).slice(0, 4),
      players: players.filter((player) => haystack.includes(player.name.toLowerCase())).slice(0, 4),
      tournaments: tournaments
        .filter((tournament) => haystack.includes(tournament.name.toLowerCase()))
        .slice(0, 4),
      matches: matches
        .filter((match) => {
          return [
            match.homeTeam?.name,
            match.awayTeam?.name,
            match.tournament?.name
          ]
            .filter(Boolean)
            .some((value) => haystack.includes(String(value).toLowerCase()));
        })
        .slice(0, 4)
    }
  };
}

export async function listRankings(limit = 10) {
  return prisma.teamRanking.findMany({
    include: {
      team: true,
      tournament: true
    },
    orderBy: [{ updatedAt: "desc" }, { position: "asc" }],
    take: limit
  });
}

export async function getHomeDashboardData() {
  const [featuredTournaments, featuredMatches, latestNews, featuredTeams, featuredPlayers, rankings] =
    await Promise.all([
      prisma.tournament.findMany({
        include: {
          matches: {
            include: {
              homeTeam: true,
              awayTeam: true
            },
            orderBy: { scheduledAt: "asc" },
            take: 2
          }
        },
        orderBy: { startDate: "asc" },
        take: 4
      }),
      prisma.match.findMany({
        include: {
          tournament: true,
          stage: true,
          homeTeam: true,
          awayTeam: true,
          winnerTeam: true
        },
        where: {
          OR: [{ status: "LIVE" }, { status: "SCHEDULED" }]
        },
        orderBy: { scheduledAt: "asc" },
        take: 6
      }),
      prisma.newsPost.findMany({
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 6
      }),
      prisma.team.findMany({
        include: {
          rankings: {
            include: {
              tournament: true
            },
            orderBy: [{ updatedAt: "desc" }, { position: "asc" }],
            take: 1
          }
        },
        orderBy: { updatedAt: "desc" },
        take: 6
      }),
      prisma.player.findMany({
        include: {
          team: true
        },
        orderBy: { updatedAt: "desc" },
        take: 6
      }),
      listRankings(8)
    ]);

  return {
    featuredTournaments,
    featuredMatches,
    latestNews,
    featuredTeams,
    featuredPlayers,
    rankings
  };
}
