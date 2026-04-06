import type { IngestSource } from "@/lib/ingest/connectors/types";
import type { NormalizedExternalRef } from "@/lib/ingest/normalizers/schemas";
import {
  canonicalizeName,
  slugify,
  toDateOrNull,
  uniqueStrings
} from "@/lib/ingest/utils/strings";

export function buildExternalRef(
  source: IngestSource,
  entityType: NormalizedExternalRef["entityType"],
  externalId: string,
  metadata?: Record<string, string | number | boolean>
): NormalizedExternalRef {
  return {
    source,
    entityType,
    externalId,
    metadata
  };
}

export function buildAliases(name: string, aliases: Array<string | null | undefined>) {
  return uniqueStrings([name, ...aliases]).filter((alias) => alias !== name);
}

export function buildCanonicalAliasNames(name: string, aliases: string[]) {
  return uniqueStrings([name, ...aliases].map(canonicalizeName));
}

export function buildEntityIdentity(name: string, aliases: Array<string | null | undefined>) {
  const cleanAliases = buildAliases(name, aliases);

  return {
    canonicalName: canonicalizeName(name),
    slug: slugify(name),
    aliases: cleanAliases,
    aliasCanonicalNames: buildCanonicalAliasNames(name, cleanAliases)
  };
}

export function buildMatchIdentity(
  tournamentName: string,
  homeTeamName: string,
  awayTeamName: string,
  scheduledAt?: Date | string | null
) {
  const schedulePart = toDateOrNull(scheduledAt)?.toISOString().slice(0, 10) ?? "tbd";
  const name = `${homeTeamName} vs ${awayTeamName} - ${tournamentName}`;

  return {
    name,
    canonicalName: canonicalizeName(
      `${tournamentName} ${homeTeamName} ${awayTeamName} ${schedulePart}`
    ),
    slug: slugify(`${homeTeamName}-${awayTeamName}-${tournamentName}-${schedulePart}`)
  };
}

export { canonicalizeName, slugify, toDateOrNull, uniqueStrings };
