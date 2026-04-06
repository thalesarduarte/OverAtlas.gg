import type { Route } from "next";
import Link from "next/link";
import {
  Newspaper,
  Radar,
  Settings,
  Star,
  Swords,
  Trophy,
  Users
} from "lucide-react";

import { auth, signOut } from "@/lib/auth";
import { ProfileSearch } from "@/components/layout/profile-search";

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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/65 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 transition group-hover:scale-105 group-hover:border-cyan-300/30">
              <Radar className="h-5 w-5" />
            </div>
            <div>
              <p className="app-heading text-[11px] uppercase tracking-[0.38em] text-slate-500">
                Overwatch Command Hub
              </p>
              <p className="app-heading text-2xl font-black text-white">OverAtlas</p>
            </div>
          </Link>

          <div className="hidden min-w-[320px] flex-1 justify-center lg:flex">
            <ProfileSearch />
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:block">
                  {session.user?.name || session.user?.email}
                </div>
                <Link
                  href="/configuracoes"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/10"
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
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Sair
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-400/20"
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="lg:hidden">
          <ProfileSearch />
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/10"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
