import { PlayerCard } from "@/components/ui/data-cards";
import { DegradedNotice } from "@/components/ui/degraded-notice";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import { SectionShell } from "@/components/ui/section-shell";
import { listPlayers } from "@/lib/atlas-data";

export default async function PlayersPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const data = await listPlayers({
    query: params.q,
    role: params.role,
    region: params.region,
    sort: params.sort as "name" | "recent" | undefined,
    page: Number(params.page ?? "1")
  });

  return (
    <SectionShell
      title="Jogadores"
      description="Perfis competitivos ligados ao banco, com time atual, role e historico disponiveis."
    >
      {data.isDegraded ? (
        <DegradedNotice
          description={
            data.degradedReason ??
            "A lista de jogadores entrou em fallback porque a base principal nao respondeu."
          }
        />
      ) : null}

      <form className="mb-6 grid gap-3 md:grid-cols-[1fr,180px,180px,180px,120px]">
        <SearchInput name="q" placeholder="Buscar jogador" defaultValue={params.q} />
        <select
          name="role"
          defaultValue={params.role ?? ""}
          className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white"
        >
          <option value="">Todas as roles</option>
          <option value="DPS">DPS</option>
          <option value="Tank">Tank</option>
          <option value="Support">Support</option>
        </select>
        <select
          name="region"
          defaultValue={params.region ?? ""}
          className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white"
        >
          <option value="">Todas as regioes</option>
          <option value="KR">KR</option>
          <option value="EMEA">EMEA</option>
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
          title="Nenhum jogador encontrado"
          description="Refine sua busca ou sincronize novas fontes para ampliar a base."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}

      <PaginationControls
        pagination={data.pagination}
        basePath="/players"
        searchParams={{
          q: params.q,
          role: params.role,
          region: params.region,
          sort: params.sort
        }}
      />
    </SectionShell>
  );
}
