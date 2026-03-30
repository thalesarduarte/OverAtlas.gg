import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-hero p-8 shadow-glow md:p-12">
      <div className="max-w-3xl space-y-6">
        <Badge>Liquipedia + Tracker + Overwatch</Badge>
        <div className="space-y-4">
          <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
            Um hub completo para acompanhar cenário competitivo e estatísticas de perfis.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Crie conta, favorite times e campeonatos, busque BattleTags, compare perfis e monte uma experiência personalizada em cima do ecossistema competitivo de Overwatch.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950 transition hover:opacity-90">
            Começar agora
          </Link>
          <Link href="/profile/Thales%231234" className="rounded-full border border-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/5">
            Ver perfil demo
          </Link>
        </div>
      </div>
    </section>
  );
}
