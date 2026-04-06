import { redirect } from "next/navigation";

import { BattleNetButton } from "@/components/auth/battle-net-button";
import { SectionShell } from "@/components/ui/section-shell";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ConfiguracoesPage() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    redirect("/login?callbackUrl=/configuracoes");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      email: true,
      createdAt: true,
      linkedProfile: {
        select: {
          battleTag: true,
          platform: true,
          lastSyncAt: true
        }
      }
    }
  });

  const battleNetEnabled = Boolean(
    process.env.AUTH_BATTLENET_ID && process.env.AUTH_BATTLENET_SECRET
  );

  return (
    <SectionShell
      title="Configuracoes"
      description="Resumo da sua conta autenticada no OverAtlas."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</p>
          <p className="mt-3 text-lg font-semibold text-white">{user?.email}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Criado em</p>
          <p className="mt-3 text-lg font-semibold text-white">
            {user?.createdAt
              ? new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "medium",
                  timeStyle: "short"
                }).format(user.createdAt)
              : "-"}
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Battle.net</p>
          {user?.linkedProfile ? (
            <>
              <p className="mt-3 text-lg font-semibold text-white">
                {user.linkedProfile.battleTag}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {user.linkedProfile.platform ?? "Battle.net"} conectado
                {user.linkedProfile.lastSyncAt
                  ? ` em ${new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short"
                    }).format(user.linkedProfile.lastSyncAt)}`
                  : "."}
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 text-lg font-semibold text-white">Nao conectado</p>
              <p className="mt-2 text-sm text-slate-400">
                Conecte sua conta para salvar o BattleTag e usar Battle.net como login.
              </p>
            </>
          )}
          <div className="mt-5">
            <BattleNetButton
              mode="connect"
              enabled={battleNetEnabled}
              connectedBattleTag={user?.linkedProfile?.battleTag ?? null}
              redirectTo="/configuracoes"
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
