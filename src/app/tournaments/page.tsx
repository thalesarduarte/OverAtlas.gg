import { TournamentCard } from "@/components/ui/data-cards";
import { DegradedNotice } from "@/components/ui/degraded-notice";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import { SectionShell } from "@/components/ui/section-shell";
import { listTournaments } from "@/lib/atlas-data";

export default async function TournamentsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const data = await listTournaments({
    query: params.q,
    status: params.status as "upcoming" | "ongoing" | "completed" | undefined,
    sort: params.sort as "date" | "name" | undefined,
    page: Number(params.page ?? "1")
  });

  return (
    <SectionShell
      title="Campeonatos"
      description="Calendario real do banco com status derivado, filtros e paginas detalhadas."
    >
      {data.isDegraded ? (
        <DegradedNotice
          description={
            data.degradedReason ??
            "A lista de campeonatos entrou em fallback porque a base principal nao respondeu."
          }
        />
      ) : null}

      <form className="mb-6 grid gap-3 md:grid-cols-[1fr,180px,180px,120px]">
        <SearchInput name="q" placeholder="Buscar campeonato" defaultValue={params.q} />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white"
        >
          <option value="">Todos os status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <select
          name="sort"
          defaultValue={params.sort ?? "date"}
          className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white"
        >
          <option value="date">Ordenar por data</option>
          <option value="name">Ordenar por nome</option>
        </select>
        <button className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950">
          Aplicar
        </button>
      </form>

      {data.items.length === 0 ? (
        <EmptyState
          title="Nenhum campeonato encontrado"
          description="Sem resultados para os filtros atuais ou sem dados sincronizados ainda."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}

      <PaginationControls
        pagination={data.pagination}
        basePath="/tournaments"
        searchParams={{
          q: params.q,
          status: params.status,
          sort: params.sort
        }}
      />
    </SectionShell>
  );
}
