import { FavoriteButton } from "@/components/favorites/favorite-button";
import { SectionShell } from "@/components/ui/section-shell";
import { featuredTeams } from "@/lib/mock-data";

export default function TeamsPage() {
  return (
    <SectionShell
      title="Times"
      description="Pagina base estilo wiki para evoluir com logo, lineup, resultados e historico por temporada."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featuredTeams.map((team) => (
          <article key={team.slug} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-xl font-bold text-white">{team.name}</h3>
            <p className="mt-2 text-sm text-slate-400">Regiao: {team.region}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
              <span>Record: {team.record}</span>
              <span>{team.standing}</span>
            </div>
            <div className="mt-5">
              <FavoriteButton type="TEAM" refId={team.slug} />
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
