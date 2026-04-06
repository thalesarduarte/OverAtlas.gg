import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import { SectionShell } from "@/components/ui/section-shell";
import { NewsCard } from "@/components/ui/data-cards";
import { listNews } from "@/lib/atlas-data";

export default async function NewsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const data = await listNews({
    query: params.q,
    page: Number(params.page ?? "1")
  });

  return (
    <SectionShell
      title="Notícias"
      description="Cobertura editorial servida do banco com paginação e navegação para a matéria completa."
    >
      <form className="mb-6 grid gap-3 md:grid-cols-[1fr,120px]">
        <SearchInput name="q" placeholder="Buscar notícia" defaultValue={params.q} />
        <button className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950">
          Aplicar
        </button>
      </form>

      {data.items.length === 0 ? (
        <EmptyState
          title="Nenhuma notícia encontrada"
          description="As notícias entram no produto conforme os conectores editoriais sincronizam."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {data.items.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <PaginationControls
        pagination={data.pagination}
        basePath="/news"
        searchParams={{
          q: params.q
        }}
      />
    </SectionShell>
  );
}
