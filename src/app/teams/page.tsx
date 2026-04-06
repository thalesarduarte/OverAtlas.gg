import { TeamCard } from "@/components/ui/data-cards";
import { DegradedNotice } from "@/components/ui/degraded-notice";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import { SectionShell } from "@/components/ui/section-shell";
import { listTeams } from "@/lib/atlas-data";

export default async function TeamsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const data = await listTeams({
    query: params.q,
    region: params.region,
    sort: params.sort as "name" | "recent" | "ranking" | undefined,
    page: Number(params.page ?? "1")
  });

  return (
    <SectionShell
      title="Times"
      description="Listagem real do banco com busca, paginacao e acesso direto as paginas individuais."
    >
      {data.isDegraded ? (
        <DegradedNotice
          description={
            data.degradedReason ??
            "A lista de times entrou em fallback porque a base principal nao respondeu."
          }
        />
      ) : null}

      <form className="mb-6 grid gap-3 md:grid-cols-[1fr,180px,180px,120px]">
        <SearchInput name="q" placeholder="Buscar time" defaultValue={params.q} />
        <select
          name="region"
          defaultValue={params.region ?? ""}
          className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white"
        >
          <option value="">Todas as regioes</option>
          <option value="EMEA">EMEA</option>
          <option value="APAC">APAC</option>
          <option value="NA">NA</option>
        </select>
        <select
          name="sort"
          defaultValue={params.sort ?? "name"}
          className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white"
        >
          <option value="name">Ordenar por nome</option>
          <option value="recent">Mais recentes</option>
        </select>
        <button className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950">
          Aplicar
        </button>
      </form>

      {data.items.length === 0 ? (
        <EmptyState
          title="Nenhum time encontrado"
          description="Ajuste os filtros ou rode um sync para popular a base competitiva."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}

      <PaginationControls
        pagination={data.pagination}
        basePath="/teams"
        searchParams={{
          q: params.q,
          region: params.region,
          sort: params.sort
        }}
      />
    </SectionShell>
  );
}
