"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TrendPoint } from "./types";

export default function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="rounded-[10px] border border-[#e0e0e0] px-[24px] py-[24px]">
      <p className="mb-[20px] text-[14px] font-medium text-[#1b1b1b]">
        Average score per term
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 16, bottom: 0, left: -8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="term"
            tick={{ fontSize: 12, fill: "#888" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fontSize: 12, fill: "#888" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e0e0e0",
              fontSize: 13,
            }}
            formatter={(v: number) => [`${v.toFixed(1)}%`, "Average"]}
          />
          <ReferenceLine y={50} stroke="#e0e0e0" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="average"
            stroke="#1ca95c"
            strokeWidth={2.5}
            dot={{ fill: "#1ca95c", r: 5, strokeWidth: 0 }}
            activeDot={{ r: 7, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
