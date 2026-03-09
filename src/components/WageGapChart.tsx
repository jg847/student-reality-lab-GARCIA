"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type WagePoint = {
  category: string;
  low: number;
  median: number;
  high: number;
};

type WageGapChartProps = {
  wageData: WagePoint[];
  targetWage?: number;
};

export function WageGapChart({ wageData, targetWage = 35 }: WageGapChartProps) {
  const chartSummary = wageData
    .map((row) => `${row.category} median $${row.median.toFixed(2)}/hr`)
    .join(", ");

  return (
    <section className="grid gap-4">
      <h3
        style={{
          margin: 0,
          color: "var(--text-strong)",
          fontFamily: "var(--font-display)",
          fontSize: "var(--step-1)",
        }}
      >
        Newark Wage Reality vs. Independent Living Target
      </h3>

      <div
        className="w-full"
        style={{ width: "100%", height: "clamp(300px, 56vw, 430px)" }}
        role="img"
        aria-label="Wage comparison chart"
        aria-describedby="wage-gap-summary"
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={280}
          minHeight={280}
          initialDimension={{ width: 760, height: 360 }}
        >
          <BarChart data={wageData} margin={{ top: 20, right: 20, left: 10, bottom: 18 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-stroke)" />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              interval={0}
              angle={-10}
              textAnchor="end"
              height={70}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              domain={[0, 45]}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}/hr`, ""]}
              contentStyle={{
                backgroundColor: "var(--bg-section)",
                border: "1px solid var(--grid-stroke)",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine
              y={targetWage}
              stroke="var(--burden-threshold)"
              strokeWidth={3}
              label={{
                value: `Target $${targetWage}/hr`,
                position: "insideTopRight",
                fill: "var(--burden-threshold)",
                fontSize: 12,
                fontWeight: 700,
              }}
            />
            <Bar dataKey="low" fill="#9bb8cf" radius={[4, 4, 0, 0]} name="Low" />
            <Bar dataKey="median" fill="var(--trend-line)" radius={[4, 4, 0, 0]} name="Median" />
            <Bar dataKey="high" fill="#3f7ca8" radius={[4, 4, 0, 0]} name="High" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p id="wage-gap-summary" className="chart-note" style={{ margin: 0 }}>
        {chartSummary}. Benchmark for avoiding rent burden at current Newark rents is roughly
        ${targetWage.toFixed(0)}/hr.
      </p>
    </section>
  );
}
