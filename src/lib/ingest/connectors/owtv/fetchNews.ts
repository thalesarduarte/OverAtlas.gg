import type { OWTVSnapshot } from "@/lib/ingest/connectors/types";
import { owtvSnapshotSchema } from "@/lib/ingest/connectors/types";

const logPrefix = "[owtvConnector/fetchNews]";

const mockNewsPosts: OWTVSnapshot["newsPosts"] = [
  {
    key: "owtv-news-midseason-preview",
    title: "OWTV destaca os confrontos de abertura do Midseason Clash",
    excerpt: "Cobertura de transmissao aponta os jogos mais esperados da semana inicial.",
    body: "A pauta destaca os seeds regionais, historias de rivalidade e os mapas mais importantes do primeiro fim de semana.",
    tag: "Broadcast",
    url: "https://owtv.example.com/news/midseason-preview",
    imageUrl: "https://images.example.com/owtv-midseason-preview.jpg",
    publishedAt: "2026-03-29T18:00:00.000Z"
  },
  {
    key: "owtv-news-stage-1-recap",
    title: "OWTV recap: Falcons fecha a etapa liderando a corrida internacional",
    excerpt: "Resumo editorial da transmissao com foco em forma recente e classificacao.",
    body: "A analise resume o desempenho das equipes mais fortes da etapa e projeta os confrontos do proximo grande evento.",
    tag: "Recap",
    url: "https://owtv.example.com/news/stage-1-recap",
    imageUrl: "https://images.example.com/owtv-stage-1-recap.jpg",
    publishedAt: "2026-03-26T14:00:00.000Z"
  }
];

export async function fetchNews(): Promise<OWTVSnapshot["newsPosts"]> {
  try {
    console.info(`${logPrefix} Starting news fetch.`);

    // TODO: Replace this with the editorial/news endpoint from OWTV when available.
    const parsed = owtvSnapshotSchema.pick({ newsPosts: true }).parse({
      newsPosts: mockNewsPosts
    });

    console.info(`${logPrefix} Completed with ${parsed.newsPosts.length} news posts.`);
    return parsed.newsPosts;
  } catch (error) {
    console.error(`${logPrefix} Failed to fetch news.`, error);
    throw new Error("OWTV news fetch failed.");
  }
}
