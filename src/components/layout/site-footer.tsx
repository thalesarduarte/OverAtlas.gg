export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/40 py-10 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-4 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="app-heading text-base font-bold text-white">OverAtlas</p>
          <p className="mt-1">
            Interface futurista para acompanhar perfis, favoritos e o cenário competitivo.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-slate-500">
          <span>Next.js</span>
          <span>Auth.js</span>
          <span>Prisma</span>
          <span>PostgreSQL</span>
          <span>Recharts</span>
        </div>
      </div>
    </footer>
  );
}
