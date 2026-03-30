import { Loader2 } from "lucide-react";

import { SectionShell } from "@/components/ui/section-shell";

export default function ProfileLoadingPage() {
  return (
    <SectionShell
      title="Buscando perfil"
      description="Estamos carregando os dados mais recentes desse BattleTag."
    >
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm text-slate-300">
        <div className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Buscando herois mais jogados, winrate e tempo de jogo...
        </div>
      </div>
    </SectionShell>
  );
}
