type LiquipediaClientOptions = {
  baseUrl?: string;
  throttleMs?: number;
  userAgent?: string;
  useMock?: boolean;
};

type CargoRow<T> = {
  title: T;
};

const DEFAULT_BASE_URL =
  process.env.LIQUIPEDIA_API_BASE ?? "https://liquipedia.net/overwatch/api.php";
const DEFAULT_USER_AGENT =
  process.env.LIQUIPEDIA_USER_AGENT ??
  "OverAtlas/0.1 (Liquipedia connector; contact: admin@overatlas.local)";
const DEFAULT_THROTTLE_MS = Number(process.env.LIQUIPEDIA_THROTTLE_MS ?? "1500");
const DEFAULT_USE_MOCK = process.env.LIQUIPEDIA_USE_MOCK !== "false";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class LiquipediaClient {
  private readonly baseUrl: string;
  private readonly throttleMs: number;
  private readonly userAgent: string;
  private readonly useMock: boolean;
  private lastRequestAt = 0;

  constructor(options: LiquipediaClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.throttleMs = options.throttleMs ?? DEFAULT_THROTTLE_MS;
    this.userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
    this.useMock = options.useMock ?? DEFAULT_USE_MOCK;
  }

  get shouldUseMock() {
    return this.useMock;
  }

  async fetchCargoRows<T>(query: URLSearchParams, logPrefix: string): Promise<T[]> {
    const now = Date.now();
    const waitMs = Math.max(0, this.throttleMs - (now - this.lastRequestAt));

    if (waitMs > 0) {
      // Adjust this throttle if Liquipedia changes rate limits or your ingest cadence.
      await sleep(waitMs);
    }

    this.lastRequestAt = Date.now();

    const url = new URL(this.baseUrl);
    query.forEach((value, key) => url.searchParams.set(key, value));

    console.info(`${logPrefix} Requesting ${url.pathname}${url.search}`);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": this.userAgent
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Liquipedia request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as { cargoquery?: Array<CargoRow<T>> };
    return (payload.cargoquery ?? []).map((row) => row.title);
  }
}

export function createLiquipediaClient(options?: LiquipediaClientOptions) {
  return new LiquipediaClient(options);
}
