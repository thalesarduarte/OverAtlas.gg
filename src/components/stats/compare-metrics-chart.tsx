"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type CompareMetricsChartProps = {
  leftLabel: string;
  rightLabel: string;
  leftWinrate: number;
  rightWinrate: number;
  leftHours: number;
  rightHours: number;
};

export function CompareMetricsChart({
  leftLabel,
  rightLabel,
  leftWinrate,
  rightWinrate,
  leftHours,
  rightHours
}: CompareMetricsChartProps) {
  const winrateData = [
    { player: leftLabel, value: leftWinrate },
    { player: rightLabel, value: rightWinrate }
  ];

  const hoursData = [
    { player: leftLabel, value: leftHours },
    { player: rightLabel, value: rightHours }
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-72 rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-1">
        <p className="mb-4 text-sm font-semibold text-slate-300">Comparacao de winrate</p>
        <ResponsiveContainer>
          <BarChart data={winrateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#25304f" />
            <XAxis dataKey="player" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0d1326",
                border: "1px solid #1f2a44",
                borderRadius: 16
              }}
            />
            <Bar dataKey="value" fill="#f59e0b" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-72 rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-1">
        <p className="mb-4 text-sm font-semibold text-slate-300">Comparacao de tempo jogado</p>
        <ResponsiveContainer>
          <BarChart data={hoursData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#25304f" />
            <XAxis dataKey="player" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0d1326",
                border: "1px solid #1f2a44",
                borderRadius: 16
              }}
            />
            <Bar dataKey="value" fill="#38bdf8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
