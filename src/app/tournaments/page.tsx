import { FavoriteButton } from "@/components/favorites/favorite-button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/ui/section-shell";
import { tournaments } from "@/lib/mock-data";

export default function TournamentsPage() {
  return (
    <SectionShell
      title="Campeonatos"
      description="Estrutura inicial para calendario, chaveamento, standings e paginas individuais."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tournaments.map((item) => (
          <article key={item.slug} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-white">{item.name}</h3>
              <Badge>{item.prizePool}</Badge>
            </div>
            <p className="mt-3 text-sm text-slate-400">{item.when}</p>
            <div className="mt-5">
              <FavoriteButton type="TOURNAMENT" refId={item.slug} />
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
