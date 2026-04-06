"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { HeroStat } from "@/types";

const esportsPalette = ["#f59e0b", "#38bdf8", "#f43f5e", "#a855f7", "#22c55e"];

const tooltipStyle = {
  backgroundColor: "#0d1326",
  border: "1px solid #1f2a44",
  borderRadius: 16,
  color: "#eef2ff"
};

function buildRoleData(data: HeroStat[]) {
  const grouped = new Map<
    string,
    { role: string; totalHours: number; totalWinrate: number; heroCount: number }
  >();

  for (const hero of data) {
    const current = grouped.get(hero.role) ?? {
      role: hero.role,
      totalHours: 0,
      totalWinrate: 0,
      heroCount: 0
    };

    current.totalHours += hero.hoursPlayed;
    current.totalWinrate += hero.winrate;
    current.heroCount += 1;
    grouped.set(hero.role, current);
  }

  return Array.from(grouped.values()).map((item) => ({
    role: item.role,
    winrate: Number((item.totalWinrate / item.heroCount).toFixed(1)),
    hours: Number(item.totalHours.toFixed(1))
  }));
}

export function ProfilePerformanceCharts({ data }: { data: HeroStat[] }) {
  const heroWinrateData = data.map((hero) => ({
    hero: hero.heroName,
    winrate: hero.winrate
  }));

  const heroHoursData = data.map((hero) => ({
    hero: hero.heroName,
    hours: hero.hoursPlayed
  }));

  const rolePerformanceData = buildRoleData(data);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <article className="chart-card rounded-3xl border border-white/10 bg-card/90 p-5 shadow-glow transition duration-300 hover:-translate-y-1">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Herois</p>
          <h3 className="mt-2 text-lg font-bold text-white">Winrate por heroi</h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={heroWinrateData} layout="vertical" margin={{ left: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#25304f" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="hero" type="category" stroke="#94a3b8" width={92} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="winrate" radius={[0, 12, 12, 0]}>
                {heroWinrateData.map((item, index) => (
                  <Cell key={item.hero} fill={esportsPalette[index % esportsPalette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="chart-card rounded-3xl border border-white/10 bg-card/90 p-5 shadow-glow transition duration-300 hover:-translate-y-1">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Volume</p>
          <h3 className="mt-2 text-lg font-bold text-white">Tempo jogado por heroi</h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <AreaChart data={heroHoursData}>
              <defs>
                <linearGradient id="hoursFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#25304f" />
              <XAxis dataKey="hero" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#38bdf8"
                strokeWidth={3}
                fill="url(#hoursFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="chart-card rounded-3xl border border-white/10 bg-card/90 p-5 shadow-glow transition duration-300 hover:-translate-y-1">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-300">Roles</p>
          <h3 className="mt-2 text-lg font-bold text-white">Desempenho por role</h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <RadarChart data={rolePerformanceData}>
              <PolarGrid stroke="#25304f" />
              <PolarAngleAxis dataKey="role" stroke="#cbd5e1" />
              <PolarRadiusAxis stroke="#475569" />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, _name, item) => [
                  `${value}% winrate`,
                  `${item.payload.hours}h jogadas`
                ]}
              />
              <Radar
                name="Winrate medio"
                dataKey="winrate"
                stroke="#f43f5e"
                fill="#f43f5e"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  );
}
