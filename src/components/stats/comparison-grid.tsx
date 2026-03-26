import { PlayerComparison } from "@/types";

export function ComparisonGrid({ comparison }: { comparison: PlayerComparison }) {
  const rows = [
    {
      label: "Win rate geral",
      left: `${comparison.left.overallWinrate}%`,
      right: `${comparison.right.overallWinrate}%`
    },
    {
      label: "Horas totais",
      left: `${comparison.left.totalHours}h`,
      right: `${comparison.right.totalHours}h`
    },
    {
      label: "Rank atual",
      left: comparison.left.rankSummary,
      right: comparison.right.rankSummary
    },
    {
      label: "Herói #1",
      left: comparison.left.topHeroes[0]?.heroName ?? "-",
      right: comparison.right.topHeroes[0]?.heroName ?? "-"
    }
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <div className="grid grid-cols-[1fr,1.2fr,1.2fr] bg-white/5 text-sm font-semibold text-slate-300">
        <div className="px-4 py-3">Métrica</div>
        <div className="px-4 py-3">{comparison.left.displayName}</div>
        <div className="px-4 py-3">{comparison.right.displayName}</div>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[1fr,1.2fr,1.2fr] border-t border-white/10 text-sm text-slate-200">
          <div className="px-4 py-3 text-slate-400">{row.label}</div>
          <div className="px-4 py-3">{row.left}</div>
          <div className="px-4 py-3">{row.right}</div>
        </div>
      ))}
    </div>
  );
}
