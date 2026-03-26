"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { HeroStat } from "@/types";

export function HeroChart({ data }: { data: HeroStat[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#25304f" />
          <XAxis dataKey="heroName" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ backgroundColor: "#0d1326", border: "1px solid #1f2a44", borderRadius: 16 }} />
          <Bar dataKey="winrate" fill="#f59e0b" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
