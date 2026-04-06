import Link from "next/link";
import { Crosshair, Shield, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Perfis rastreados", value: "2.4k", icon: Crosshair },
  { label: "Comparacoes criadas", value: "860", icon: Sparkles },
  { label: "Favoritos ativos", value: "1.1k", icon: Shield }
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-hero px-6 py-8 shadow-glow md:px-10 md:py-12">
      <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_58%)] xl:block" />
      <div className="relative grid gap-10 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="max-w-3xl space-y-6">
          <Badge>Tracker + Feed + Overwatch eSports</Badge>
          <div className="space-y-4">
            <h1 className="app-heading text-4xl font-black leading-tight text-white md:text-6xl">
              Um cockpit futurista para acompanhar estatisticas, favoritos e o meta competitivo.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Busque BattleTags, compare perfis, organize favoritos e monte uma leitura personalizada
              do ecossistema de Overwatch em uma interface pensada para velocidade e impacto visual.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-400/20"
            >
              <Zap className="h-4 w-4" />
              Comecar agora
            </Link>
            <Link
              href="/profile/Thales%231234"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Ver perfil demo
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {stats.map(({ label, value, icon: Icon }, index) => (
            <article
              key={label}
              className="glass-panel rounded-[1.8rem] p-5"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="app-heading mt-6 text-4xl font-black text-white">{value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
