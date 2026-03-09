"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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

  const barColor = rentBurdenPercentage > 30 ? "#f43f5e" : "#10b981";

  return (
    <section className="grid gap-6">
      <div className="grid gap-2">
        <p className="text-sm uppercase tracking-wide text-slate-500">Current Scenario</p>
        <div className="text-5xl font-black transition-colors duration-300 text-slate-900">
          ${hourlyWage.toFixed(0)}/hr
        </div>
        <div
          className="text-5xl font-black transition-colors duration-300"
          style={{ color: barColor }}
        >
          {rentBurdenPercentage.toFixed(2)}%
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

      <div className="grid gap-1 text-sm text-slate-600">
        <p>Selected Hourly Wage: ${hourlyWage.toFixed(0)}</p>
        <p>Effective Monthly Rent Used: ${effectiveRent.toFixed(2)}</p>
        <p>Estimated Gross Monthly Income: ${monthlyIncome.toFixed(2)}</p>
        <p className="font-semibold text-slate-700">Rent-to-Income Ratio: {rentBurdenPercentage.toFixed(2)}%</p>
      </div>

      {hasRoommate ? (
        <p className="text-sm leading-relaxed text-slate-700">
          With shared housing, the MIT Living Wage (~$25/hr) becomes enough to clear the 30%
          threshold, showing why many students are pushed into roommate-based housing.
        </p>
      ) : null}

      <div className="w-full overflow-x-auto">
        <BarChart width={640} height={320} data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8" }}
          />
          <YAxis
            unit="%"
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8" }}
          />
          <ReferenceLine
            y={30}
            stroke="#f43f5e"
            strokeDasharray="3 3"
            strokeWidth={2}
            label={{
              value: "30% Rent Burden Threshold",
              position: "top",
              fill: "#f43f5e",
              fontSize: 12,
            }}
          />
          <Bar dataKey="ratio" fill={barColor} name="Rent-to-Income Ratio" radius={[6, 6, 0, 0]} />
        </BarChart>
      </div>
    </section>
  );
}
