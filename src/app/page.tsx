import Link from "next/link";
import { HeroSection } from "@/components/sections/hero";
import { SectionShell } from "@/components/ui/section-shell";
import { Badge } from "@/components/ui/badge";
import { featuredPlayers, featuredTeams, news, tournaments } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <div className="grid gap-6 lg:grid-cols-[1.3fr,0.9fr]">
        <SectionShell title="Notícias em destaque" description="Bloco principal da home para alimentar a vibe de portal competitivo.">
          <div className="grid gap-4 md:grid-cols-3">
            {news.map((item) => (
              <article key={item.slug} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-amber-300/30">
                <Badge className="mb-4">{item.tag}</Badge>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.excerpt}</p>
              </article>
            ))}
          </div>
        </SectionShell>

        <SectionShell title="Próximos campeonatos" description="Cards rápidos para calendário e destaque de eventos.">
          <div className="space-y-3">
            {tournaments.map((item) => (
              <div key={item.slug} className="rounded-2xl border border-white/10 px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{item.when}</p>
                  </div>
                  <Badge>{item.prizePool}</Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionShell title="Times em destaque" description="Base inicial da seção estilo Liquipedia para times e standings.">
          <div className="space-y-3">
            {featuredTeams.map((team) => (
              <div key={team.slug} className="rounded-2xl border border-white/10 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{team.name}</h3>
                    <p className="text-sm text-slate-400">{team.region}</p>
                  </div>
                  <div className="text-right text-sm text-slate-300">
                    <p>{team.record}</p>
                    <p>{team.standing}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell title="Jogadores em alta" description="Componente reaproveitável para páginas de jogadores, ranking e busca interna.">
          <div className="space-y-3">
            {featuredPlayers.map((player) => (
              <div key={player.slug} className="rounded-2xl border border-white/10 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{player.name}</h3>
                    <p className="text-sm text-slate-400">{player.team}</p>
                  </div>
                  <Badge>{player.role}</Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </div>

      <SectionShell title="Fluxos principais do MVP" description="Resumo do que já está modelado neste projeto base.">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Conta", "Cadastro com e-mail e preparação para Battle.net OAuth."],
            ["Perfis", "Busca de BattleTag com página própria para estatísticas."],
            ["Comparação", "Tela dedicada para comparar dois perfis lado a lado."],
            ["Wiki", "Times, jogadores, campeonatos e notícias em áreas separadas."]
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/compare?left=thales-1234&right=proper-1111" className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950 transition hover:opacity-90">
            Abrir comparação demo
          </Link>
        </div>
      </SectionShell>
    </>
  );
}
