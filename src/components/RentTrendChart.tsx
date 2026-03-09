"use client";

import type { RentPoint } from "../lib/schema";
import {
  CartesianGrid,
  Line,
  LineChart,
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
      <h3 className="text-xl font-bold tracking-tight text-slate-900">Rent Over Time</h3>

      <div
        className="w-full overflow-x-auto"
        role="img"
        aria-label="Historical Rent Trend Chart"
        aria-describedby="rent-trend-summary"
        title="Historical Rent Trend Chart"
      >
        <LineChart width={760} height={320} data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="shortDate"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              color: "#0f172a",
            }}
            labelStyle={{ color: "#0f172a", fontWeight: 600 }}
          />
          <Line type="monotone" dataKey="rent" stroke="#3b82f6" strokeWidth={3} dot={false} />
        </LineChart>
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

      <p className="text-slate-700 leading-relaxed">
        Over the last several years, average rent in Essex County has skyrocketed, far outpacing
        standard minimum wage increases.
      </p>
    </section>
  );
}
