"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { HeroStat } from "@/types";

const heroPalette = ["#f59e0b", "#38bdf8", "#f43f5e", "#a855f7", "#22c55e"];

export function HeroChart({ data }: { data: HeroStat[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#25304f" />
          <XAxis dataKey="heroName" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0d1326",
              border: "1px solid #1f2a44",
              borderRadius: 16,
              color: "#eef2ff"
            }}
            formatter={(value) => [`${value}%`, "Winrate"]}
          />
          <Bar dataKey="winrate" radius={[10, 10, 0, 0]} animationDuration={700}>
            {data.map((item, index) => (
              <Cell key={item.heroName} fill={heroPalette[index % heroPalette.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
