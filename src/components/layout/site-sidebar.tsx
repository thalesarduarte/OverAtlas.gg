import type { Route } from "next";
import Link from "next/link";
import {
  Activity,
  ChevronRight,
  Compass,
  Crown,
  ShieldCheck,
  Sparkles
} from "lucide-react";

const sidebarLinks: Array<{
  href: Route;
  label: string;
  caption: string;
  icon: typeof Compass;
}> = [
  {
    href: "/favoritos",
    label: "Radar pessoal",
    caption: "Seus itens acompanhados",
    icon: Activity
  },
  {
    href: "/compare",
    label: "Comparar perfis",
    caption: "Duelo de BattleTags",
    icon: Sparkles
  },
  {
    href: "/teams",
    label: "Meta competitivo",
    caption: "Times e destaques",
    icon: Crown
  },
  {
    href: "/configuracoes",
    label: "Centro da conta",
    caption: "Conexoes e preferencias",
    icon: ShieldCheck
  }
];

export function SiteSidebar() {
  return (
    <aside className="hidden xl:block xl:w-80 xl:shrink-0">
      <div className="sticky top-28 space-y-5">
        <section className="glass-panel rounded-[2rem] p-5">
          <p className="app-heading text-xs uppercase tracking-[0.35em] text-cyan-300">
            Command Deck
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            Uma nave lateral para os fluxos mais usados.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            O OverAtlas fica mais rápido de percorrer com atalhos diretos para favoritos,
            comparação, times e configurações.
          </p>
        </section>

        <div className="space-y-3">
          {sidebarLinks.map(({ href, label, caption, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="glass-panel card-hover flex items-start justify-between rounded-[1.6rem] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="mt-1 text-sm text-slate-400">{caption}</p>
                </div>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 text-slate-500" />
            </Link>
          ))}
        </div>

        <section className="glass-panel rounded-[1.8rem] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
            Status do hub
          </p>
          <div className="mt-4 space-y-3">
            <div className="surface-soft rounded-2xl px-4 py-3">
              <p className="text-sm font-semibold text-white">Tema eSports</p>
              <p className="mt-1 text-sm text-slate-400">
                Interface focada em contraste, glow e leitura rápida.
              </p>
            </div>
            <div className="surface-soft rounded-2xl px-4 py-3">
              <p className="text-sm font-semibold text-white">Layout responsivo</p>
              <p className="mt-1 text-sm text-slate-400">
                Sidebar opcional no desktop sem atrapalhar o mobile.
              </p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
