import { PlayerComparison } from "@/types";

function getCellClass(leftValue: number, rightValue: number, side: "left" | "right") {
  if (leftValue === rightValue) {
    return "text-slate-200";
  }

  const leftWins = leftValue > rightValue;

  if ((side === "left" && leftWins) || (side === "right" && !leftWins)) {
    return "font-semibold text-emerald-300";
  }

  return "text-slate-400";
}

export function ComparisonGrid({ comparison }: { comparison: PlayerComparison }) {
  const rows = [
    {
      label: "Win rate geral",
      leftLabel: `${comparison.left.overallWinrate}%`,
      rightLabel: `${comparison.right.overallWinrate}%`,
      leftValue: comparison.left.overallWinrate,
      rightValue: comparison.right.overallWinrate
    },
    {
      label: "Horas totais",
      leftLabel: `${comparison.left.totalHours}h`,
      rightLabel: `${comparison.right.totalHours}h`,
      leftValue: comparison.left.totalHours,
      rightValue: comparison.right.totalHours
    },
    {
      label: "Role principal",
      leftLabel: comparison.left.mainRole,
      rightLabel: comparison.right.mainRole,
      leftValue: comparison.left.topHeroes[0]?.hoursPlayed ?? 0,
      rightValue: comparison.right.topHeroes[0]?.hoursPlayed ?? 0
    },
    {
      label: "Heroi principal",
      leftLabel: comparison.left.topHeroes[0]?.heroName ?? "-",
      rightLabel: comparison.right.topHeroes[0]?.heroName ?? "-",
      leftValue: comparison.left.topHeroes[0]?.winrate ?? 0,
      rightValue: comparison.right.topHeroes[0]?.winrate ?? 0
    }
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <div className="grid grid-cols-[1fr,1.2fr,1.2fr] bg-white/5 text-sm font-semibold text-slate-300">
        <div className="px-4 py-3">Metrica</div>
        <div className="px-4 py-3">{comparison.left.displayName}</div>
        <div className="px-4 py-3">{comparison.right.displayName}</div>
      </div>
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[1fr,1.2fr,1.2fr] border-t border-white/10 text-sm"
        >
          <div className="px-4 py-3 text-slate-400">{row.label}</div>
          <div className={`px-4 py-3 ${getCellClass(row.leftValue, row.rightValue, "left")}`}>
            {row.leftLabel}
          </div>
          <div className={`px-4 py-3 ${getCellClass(row.leftValue, row.rightValue, "right")}`}>
            {row.rightLabel}
          </div>
        </div>
      ))}
    </div>
  );
}
