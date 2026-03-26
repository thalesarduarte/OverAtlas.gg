import { redirect } from "next/navigation";

import { SectionShell } from "@/components/ui/section-shell";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function FavoritosPage() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    redirect("/login?callbackUrl=/favoritos");
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId
    },
    include: {
      team: true,
      player: true,
      tournament: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <SectionShell
      title="Favoritos"
      description="Area privada com os itens salvos pela sua conta."
    >
      <div className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-300">
          <p className="font-semibold text-white">{session?.user.email}</p>
          <p className="mt-2">
            {favorites.length > 0
              ? `Voce possui ${favorites.length} item(ns) favorito(s) salvo(s).`
              : "Voce ainda nao salvou favoritos. Quando ligar essa funcionalidade, eles aparecerao aqui."}
          </p>
        </div>

        {favorites.map((favorite) => {
          const title =
            favorite.team?.name || favorite.player?.name || favorite.tournament?.name || "Favorito";

          return (
            <div
              key={favorite.id}
              className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-300"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                {favorite.type}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{title}</p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
