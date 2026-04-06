import type { OfficialSnapshot } from "@/lib/ingest/connectors/types";
import { officialSnapshotSchema } from "@/lib/ingest/connectors/types";

const logPrefix = "[officialConnector/fetchNews]";

export async function fetchNews(): Promise<OfficialSnapshot["newsPosts"]> {
  try {
    console.info(`${logPrefix} Starting news fetch.`);

    const parsed = officialSnapshotSchema
      .pick({
        newsPosts: true
      })
      .parse({
        newsPosts: [
          {
            id: "official-news-owcs-midseason-preview",
            title: "OWCS Midseason Clash abre calendario internacional",
            excerpt: "Veja os confrontos iniciais, favoritos e a corrida por pontos no circuito.",
            body: "O evento internacional reune os principais seeds regionais em uma janela decisiva para o restante da temporada.",
            tag: "Esports",
            url: "https://overwatch.example.com/news/midseason-clash-preview",
            imageUrl: "https://images.example.com/owcs-midseason.jpg",
            publishedAt: "2026-03-28T15:00:00.000Z"
          },
          {
            id: "official-news-stage-1-recap",
            title: "Stage 1 termina com Falcons no topo do ranking",
            excerpt: "A equipe encerrou a etapa com campanha dominante e lideranca geral.",
            body: "A campanha consolidou o elenco como referencia da temporada, com vitoria em serie decisiva e saldo positivo em mapas.",
            tag: "Resultados",
            url: "https://overwatch.example.com/news/stage-1-recap",
            imageUrl: "https://images.example.com/stage-1-recap.jpg",
            publishedAt: "2026-03-25T12:00:00.000Z"
          }
        ]
      });

    console.info(`${logPrefix} Completed with ${parsed.newsPosts.length} news posts.`);
    return parsed.newsPosts;
  } catch (error) {
    console.error(`${logPrefix} Failed to fetch news.`, error);
    throw new Error("Official news fetch failed.");
  }
}
