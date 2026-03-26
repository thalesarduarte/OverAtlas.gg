import type { Route } from "next";
import Link from "next/link";
import { Newspaper, Radar, Settings, Star, Swords, Trophy, Users } from "lucide-react";

import { auth, signOut } from "@/lib/auth";

const links: Array<{ href: Route; label: string; icon: typeof Trophy }> = [
  { href: "/teams", label: "Times", icon: Trophy },
  { href: "/players", label: "Jogadores", icon: Users },
  { href: "/tournaments", label: "Campeonatos", icon: Swords },
  { href: "/news", label: "Noticias", icon: Newspaper },
  { href: "/favoritos", label: "Favoritos", icon: Star }
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
            <Radar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Overwatch Hub</p>
            <p className="text-xl font-bold text-white">OverAtlas</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-amber-300/30 hover:bg-white/5"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-300 md:inline">
                {session.user?.name || session.user?.email}
              </span>
              <Link
                href="/configuracoes"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
              >
                <Settings className="h-4 w-4" />
                Configuracoes
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
                >
                  Sair
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
