"use client";

import type { RentPoint } from "../lib/schema";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RentTrendChartProps = {
  rentTrend: RentPoint[];
};

function formatYearMonth(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function RentTrendChart({ rentTrend }: RentTrendChartProps) {
  const chartData = rentTrend.map((point) => ({
    ...point,
    shortDate: formatYearMonth(point.date),
  }));

  const firstPoint = rentTrend[0];
  const lastPoint = rentTrend[rentTrend.length - 1];

  const srSummary =
    firstPoint && lastPoint
      ? `Historical rent trend chart. Rent changes from $${firstPoint.rent.toFixed(
          2
        )} in ${formatYearMonth(firstPoint.date)} to $${lastPoint.rent.toFixed(2)} in ${formatYearMonth(
          lastPoint.date
        )}.`
      : "Historical rent trend chart for Essex County rent over time.";

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
        Rent Over Time
      </h3>

      <div
        className="w-full"
        style={{ width: "100%", height: "clamp(280px, 50vw, 400px)" }}
        role="img"
        aria-label="Historical Rent Trend Chart"
        aria-describedby="rent-trend-summary"
        title="Historical Rent Trend Chart"
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={280}
          minHeight={280}
          initialDimension={{ width: 760, height: 320 }}
        >
          <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-stroke)" />
            <XAxis
              dataKey="shortDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-section)",
                border: "1px solid var(--grid-stroke)",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                color: "var(--text-strong)",
              }}
              labelStyle={{ color: "var(--text-strong)", fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="rent" stroke="none" fill="var(--trend-fill)" />
            <Line type="monotone" dataKey="rent" stroke="var(--trend-line)" strokeWidth={3} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p
        id="rent-trend-summary"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {srSummary}
      </p>

      <p className="story-body" style={{ margin: 0 }}>
        Over the last several years, average rent in Essex County has skyrocketed, far outpacing
        standard minimum wage increases.
      </p>
    </section>
  );
}
