import type { NewsPost } from "@prisma/client";

import type { NormalizedNewsPost } from "@/lib/ingest/normalizers/schemas";
import {
  PrismaTransaction,
  resolveNewsPost,
  syncExternalRefs,
  UpsertResult
} from "@/lib/ingest/upserts/utils";

export async function upsertNewsPost(
  tx: PrismaTransaction,
  input: NormalizedNewsPost
): Promise<UpsertResult<NewsPost>> {
  const existing = await resolveNewsPost(tx, input);

  const newsPost = existing
    ? await tx.newsPost.update({
        where: {
          id: existing.id
        },
        data: {
          title: input.title,
          canonicalName: input.canonicalName,
          slug: input.slug,
          excerpt: input.excerpt,
          body: input.body,
          tag: input.tag,
          url: input.url,
          imageUrl: input.imageUrl,
          source: input.source,
          publishedAt: input.publishedAt ?? null
        }
      })
    : await tx.newsPost.create({
        data: {
          title: input.title,
          canonicalName: input.canonicalName,
          slug: input.slug,
          excerpt: input.excerpt,
          body: input.body,
          tag: input.tag,
          url: input.url,
          imageUrl: input.imageUrl,
          source: input.source,
          publishedAt: input.publishedAt ?? null
        }
      });

  await syncExternalRefs(tx, { newsPostId: newsPost.id }, input.externalRefs);

  return {
    record: newsPost,
    operation: existing ? "updated" : "created"
  };
}
