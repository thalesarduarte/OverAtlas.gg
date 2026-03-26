import { redirect } from "next/navigation";

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
      createdAt: true
    }
  });

  return (
    <SectionShell
      title="Configuracoes"
      description="Resumo da sua conta autenticada no OverAtlas."
    >
      <div className="grid gap-4 md:grid-cols-2">
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
      </div>
    </SectionShell>
  );
}
