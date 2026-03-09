"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

type RentBurdenProps = {
  currentMonthlyRent: number;
  livingWage: number;
};

export function RentBurden({ currentMonthlyRent, livingWage }: RentBurdenProps) {
  const [hourlyWage, setHourlyWage] = useState(livingWage);
  const [hasRoommate, setHasRoommate] = useState(false);

  const { effectiveRent, monthlyIncome, rentBurdenPercentage, chartData } = useMemo(() => {
    const effectiveRentValue = hasRoommate ? currentMonthlyRent / 2 : currentMonthlyRent;
    const annualIncome = hourlyWage * 40 * 52;
    const monthlyIncomeValue = annualIncome / 12;
    const burden = (effectiveRentValue / monthlyIncomeValue) * 100;

    return {
      effectiveRent: effectiveRentValue,
      monthlyIncome: monthlyIncomeValue,
      rentBurdenPercentage: burden,
      chartData: [{ label: "Current Wage", ratio: Number(burden.toFixed(2)) }],
    };
  }, [currentMonthlyRent, hasRoommate, hourlyWage]);

  const barColor = rentBurdenPercentage > 30 ? "var(--burden-urgent)" : "var(--burden-safe)";

  return (
    <section className="grid gap-6">
      <div className="grid gap-2">
        <p className="chart-note" style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Current Scenario
        </p>
        <div
          style={{
            margin: 0,
            color: "var(--text-strong)",
            fontFamily: "var(--font-display)",
            fontSize: "var(--step-callout)",
            lineHeight: 1,
          }}
        >
          ${hourlyWage.toFixed(0)}/hr
        </div>
        <div
          className="transition-colors duration-300"
          style={{ color: barColor }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--step-callout)",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {rentBurdenPercentage.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        <label htmlFor="hourlyWage" className="text-sm font-semibold text-slate-700">
          Adjust Expected Hourly Wage
        </label>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">$15</span>
          <input
            id="hourlyWage"
            aria-label="Adjust expected hourly wage"
            type="range"
            min={15}
            max={60}
            step={1}
            value={hourlyWage}
            onChange={(event) => setHourlyWage(Number(event.target.value))}
            className="w-full h-3 rounded-lg accent-slate-900 cursor-pointer"
          />
          <span className="text-sm font-medium text-slate-500">$60</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center gap-3">
        <input
          id="roommateToggle"
          type="checkbox"
          checked={hasRoommate}
          onChange={(event) => setHasRoommate(event.target.checked)}
          className="h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
        />
        <label htmlFor="roommateToggle" className="text-sm font-medium text-slate-800 cursor-pointer">
          Split rent with 1 roommate
        </label>
      </div>

      <div className="grid gap-1" style={{ color: "var(--text-muted)", fontSize: "var(--step--1)" }}>
        <p>Selected Hourly Wage: ${hourlyWage.toFixed(0)}</p>
        <p>Effective Monthly Rent Used: ${effectiveRent.toFixed(2)}</p>
        <p>Estimated Gross Monthly Income: ${monthlyIncome.toFixed(2)}</p>
        <p style={{ color: "var(--text-strong)", fontWeight: 700 }}>
          Rent-to-Income Ratio: {rentBurdenPercentage.toFixed(2)}%
        </p>
      </div>

      {hasRoommate ? (
        <p className="text-sm leading-relaxed text-slate-700">
          With shared housing, the MIT Living Wage (~$25/hr) becomes enough to clear the 30%
          threshold, showing why many students are pushed into roommate-based housing.
        </p>
      ) : null}

      <div className="w-full" style={{ width: "100%", height: "clamp(280px, 52vw, 400px)" }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={280}
          minHeight={280}
          initialDimension={{ width: 640, height: 320 }}
        >
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-stroke)" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            />
            <YAxis
              unit="%"
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            />
            <ReferenceLine
              y={30}
              stroke="var(--burden-threshold)"
              strokeWidth={3}
              label={{
                value: "30% Rent Burden Threshold",
                position: "top",
                fill: "var(--burden-threshold)",
                fontSize: 13,
                fontWeight: 700,
              }}
            />
            <Bar dataKey="ratio" fill={barColor} name="Rent-to-Income Ratio" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
