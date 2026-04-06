import { NewsCard } from "@/components/ui/data-cards";
import { DegradedNotice } from "@/components/ui/degraded-notice";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import { SectionShell } from "@/components/ui/section-shell";
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
      title="Noticias"
      description="Cobertura editorial servida do banco com paginacao e navegacao para a materia completa."
    >
      {data.isDegraded ? (
        <DegradedNotice
          description={
            data.degradedReason ??
            "A lista de noticias entrou em fallback porque a base principal nao respondeu."
          }
        />
      ) : null}

      <form className="mb-6 grid gap-3 md:grid-cols-[1fr,120px]">
        <SearchInput name="q" placeholder="Buscar noticia" defaultValue={params.q} />
        <button className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950">
          Aplicar
        </button>
      </form>

      {data.items.length === 0 ? (
        <EmptyState
          title="Nenhuma noticia encontrada"
          description="As noticias entram no produto conforme os conectores editoriais sincronizam."
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
