export function DegradedNotice({
  title = "Dados temporariamente indisponiveis",
  description
}: {
  title?: string;
  description: string;
}) {
  return (
    <div className="mb-6 rounded-[28px] border border-amber-400/20 bg-amber-500/10 p-5 text-amber-50 shadow-[0_0_0_1px_rgba(251,191,36,0.08)]">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Modo degradado</p>
      <h2 className="mt-2 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-amber-100/90">{description}</p>
    </div>
  );
}
