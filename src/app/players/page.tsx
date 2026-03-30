import { FavoriteButton } from "@/components/favorites/favorite-button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/ui/section-shell";
import { featuredPlayers } from "@/lib/mock-data";

export default function PlayersPage() {
  return (
    <SectionShell
      title="Jogadores"
      description="Base pronta para filtros por role, regiao, organizacao e historico competitivo."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featuredPlayers.map((player) => (
          <article key={player.slug} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-white">{player.name}</h3>
              <Badge>{player.role}</Badge>
            </div>
            <p className="mt-3 text-sm text-slate-400">Equipe atual: {player.team}</p>
            <div className="mt-5">
              <FavoriteButton type="PLAYER" refId={player.slug} />
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
