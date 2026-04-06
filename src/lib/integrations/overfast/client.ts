const OVERFAST_BASE_URL =
  process.env.OVERFAST_API_BASE_URL?.replace(/\/+$/, "") ?? "https://overfast-api.tekrop.fr";

const OVERFAST_TIMEOUT_MS = 10000;

export class OverfastApiError extends Error {
  status: number;
  code: "not_found" | "upstream_error";

  constructor(
    message: string,
    status: number,
    code: "not_found" | "upstream_error" = "upstream_error"
  ) {
    super(message);
    this.name = "OverfastApiError";
    this.status = status;
    this.code = code;
  }
}

function createUrl(pathname: string, query?: Record<string, string | number | undefined>) {
  const url = new URL(`${OVERFAST_BASE_URL}${pathname}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url;
}

export function normalizeBattleTagInput(input: string) {
  return decodeURIComponent(input).trim().replace(/\s+/g, "");
}

export function normalizeBattleTagSlug(input: string) {
  const sanitized = normalizeBattleTagInput(input);

  if (!sanitized) {
    return "";
  }

  if (sanitized.includes("#")) {
    const [name, discriminator] = sanitized.split("#");
    return `${name.toLowerCase()}-${discriminator.toLowerCase()}`;
  }

  return sanitized.toLowerCase();
}

export function formatBattleTagDisplay(input: string) {
  const sanitized = normalizeBattleTagInput(input);

  if (!sanitized) {
    return "";
  }

  if (sanitized.includes("#")) {
    return sanitized;
  }

  const parts = sanitized.split("-");

  if (parts.length < 2) {
    return sanitized;
  }

  return `${parts.slice(0, -1).join("-")}#${parts.at(-1)}`;
}

export async function overfastFetch<T>(
  pathname: string,
  query?: Record<string, string | number | undefined>
) {
  const url = createUrl(pathname, query);

  console.info(`[overfast] GET ${url.pathname}${url.search}`);

  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "OverAtlas/1.0"
      },
      cache: "no-store",
      signal: AbortSignal.timeout(OVERFAST_TIMEOUT_MS)
    });
  } catch (error) {
    console.error("[overfast] Network failure", error);
    throw new OverfastApiError(
      "Nao foi possivel consultar a OverFast agora.",
      503,
      "upstream_error"
    );
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const message =
      response.status === 404
        ? "Perfil nao encontrado na OverFast."
        : "A OverFast respondeu com erro.";

    console.error(`[overfast] Request failed (${response.status})`, body);

    throw new OverfastApiError(
      message,
      response.status,
      response.status === 404 ? "not_found" : "upstream_error"
    );
  }

  return (await response.json()) as T;
}
