import { redirect } from "next/navigation";

import { FavoritesList } from "@/components/favorites/favorites-list";
import { SectionShell } from "@/components/ui/section-shell";
import { auth } from "@/lib/auth";

export default async function FavoritosPage() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    redirect("/login?callbackUrl=/favoritos");
  }

  return (
    <SectionShell
      title="Favoritos"
      description="Area privada com todos os times, jogadores e campeonatos que voce salvou."
    >
      <FavoritesList email={session?.user?.email ?? ""} />
    </SectionShell>
  );
}
