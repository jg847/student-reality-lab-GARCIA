"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

function parseCurrency(value: string): number {
  const normalized = value.replace(/,/g, "").trim();
  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function getVerdict(grossBurden: number) {
  if (grossBurden < 20) {
    return {
      label: "You are in good shape",
      color: "var(--burden-safe)",
      weight: 700,
    };
  }

  if (grossBurden < 30) {
    return {
      label: "You are near the threshold",
      color: "#996b12",
      weight: 700,
    };
  }

  if (grossBurden < 50) {
    return {
      label: "You are rent-burdened",
      color: "var(--burden-urgent)",
      weight: 700,
    };
  }

  return {
    label: "You are severely rent-burdened",
    color: "var(--burden-urgent)",
    weight: 900,
  };
}

export function AffordabilityCalculator() {
  const [monthlyIncomeInput, setMonthlyIncomeInput] = useState("");
  const [hourlyWageInput, setHourlyWageInput] = useState("");
  const [monthlyRentInput, setMonthlyRentInput] = useState("");
  const [rentSharePercentInput, setRentSharePercentInput] = useState("100");
  const [utilitiesInput, setUtilitiesInput] = useState("150");
  const [takeHomeInput, setTakeHomeInput] = useState("");

  const monthlyIncome = parseCurrency(monthlyIncomeInput);
  const hourlyWage = parseCurrency(hourlyWageInput);
  const totalRent = parseCurrency(monthlyRentInput);
  const rentSharePercentRaw = parseCurrency(rentSharePercentInput);
  const rentSharePercentCapped = Math.min(Math.max(rentSharePercentRaw, 0), 100);
  const utilitiesRaw = parseCurrency(utilitiesInput);
  const utilitiesCapped = Math.min(Math.max(utilitiesRaw, 0), 1000);
  const takeHomePay = parseCurrency(takeHomeInput);

  const derived = useMemo(() => {
    const rentShare = totalRent * (rentSharePercentCapped / 100);
    const totalHousingCost = rentShare + utilitiesCapped;
    const grossBurden = monthlyIncome > 0 ? (totalHousingCost / monthlyIncome) * 100 : 0;
    const netBurden = takeHomePay > 0 ? (totalHousingCost / takeHomePay) * 100 : null;
    const monthlySurplus = monthlyIncome - totalHousingCost;
    const hourlyNeededFor30 =
      totalHousingCost > 0 ? ((totalHousingCost / 0.3) * 12) / (52 * 40) : 0;
    const weeksOfWork =
      hourlyWage > 0 ? totalHousingCost / (hourlyWage * 40) : null;

    return {
      rentShare,
      totalHousingCost,
      grossBurden,
      netBurden,
      monthlySurplus,
      hourlyNeededFor30,
      weeksOfWork,
    };
  }, [hourlyWage, monthlyIncome, takeHomePay, totalRent, rentSharePercentCapped, utilitiesCapped]);

  const canRenderResults = monthlyIncome > 0 && totalRent > 0;
  const verdict = getVerdict(derived.grossBurden);

  const chartData = [{ name: "Your burden", burden: Number(derived.grossBurden.toFixed(2)) }];

  function handleHourlyWageChange(nextValue: string) {
    setHourlyWageInput(nextValue);

    const hourly = parseCurrency(nextValue);
    if (hourly > 0) {
      const monthlyFromHourly = (hourly * 40 * 52) / 12;
      setMonthlyIncomeInput(monthlyFromHourly.toFixed(2));
      return;
    }

    setMonthlyIncomeInput("");
  }

  function handleMonthlyIncomeChange(nextValue: string) {
    setMonthlyIncomeInput(nextValue);
    setHourlyWageInput("");
  }

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="story-card">
        <div className="calc-grid">
          <div className="calc-field">
            <label className="calc-label" htmlFor="monthlyIncome">
              Monthly gross income (before taxes)
            </label>
            <input
              id="monthlyIncome"
              className="calc-input"
              type="text"
              inputMode="decimal"
              value={monthlyIncomeInput}
              onChange={(event) => handleMonthlyIncomeChange(event.target.value)}
              placeholder="e.g. 3200"
            />
            <p className="calc-helper">
              If you are paid hourly, multiply your hourly wage by your weekly hours then by 52 and
              divide by 12.
            </p>
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="hourlyWage">
              Hourly wage (optional)
            </label>
            <input
              id="hourlyWage"
              className="calc-input"
              type="text"
              inputMode="decimal"
              value={hourlyWageInput}
              onChange={(event) => handleHourlyWageChange(event.target.value)}
              placeholder="e.g. 22"
            />
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="monthlyRent">
              Total monthly rent for the unit
            </label>
            <input
              id="monthlyRent"
              className="calc-input"
              type="text"
              inputMode="decimal"
              value={monthlyRentInput}
              onChange={(event) => setMonthlyRentInput(event.target.value)}
              placeholder="e.g. 2200"
            />
            <p className="calc-helper">
              This is the full rent for the unit. Your share is calculated using your rent
              percentage below.
            </p>
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="rentSharePercent">
              Percent of rent you pay
            </label>
            <input
              id="rentSharePercent"
              className="calc-input"
              type="text"
              inputMode="decimal"
              value={rentSharePercentInput}
              onChange={(event) => setRentSharePercentInput(event.target.value)}
              placeholder="e.g. 50"
            />
            <p className="calc-helper">
              Enter your actual share of the total unit rent as a percentage.
            </p>
            {rentSharePercentRaw > 100 ? (
              <p className="calc-alert">Rent percentage above 100 was capped at 100%.</p>
            ) : null}
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="utilities">
              Monthly utilities (electricity, gas, water)
            </label>
            <input
              id="utilities"
              className="calc-input"
              type="text"
              inputMode="decimal"
              value={utilitiesInput}
              onChange={(event) => setUtilitiesInput(event.target.value)}
              placeholder="150"
            />
            <p className="calc-helper">If utilities are included in your rent, enter 0.</p>
            {utilitiesRaw > 1000 ? (
              <p className="calc-alert">Utilities above $1000 were capped at $1000.</p>
            ) : null}
          </div>

          <div className="calc-field">
            <label className="calc-label" htmlFor="takeHomePay">
              Monthly take-home pay (after taxes) - optional
            </label>
            <input
              id="takeHomePay"
              className="calc-input"
              type="text"
              inputMode="decimal"
              value={takeHomeInput}
              onChange={(event) => setTakeHomeInput(event.target.value)}
              placeholder="e.g. 2500"
            />
          </div>
        </div>
      </div>

      {!monthlyIncomeInput || monthlyIncome <= 0 ? (
        <p className="calc-alert">Please enter your monthly income to see results.</p>
      ) : null}

      {!monthlyRentInput || totalRent <= 0 ? (
        <p className="calc-alert">Please enter your monthly rent to see results.</p>
      ) : null}

      {canRenderResults ? (
        <section className="story-card calc-results" aria-live="polite">
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "var(--step-2)",
              color: verdict.color,
              fontWeight: verdict.weight,
            }}
          >
            {verdict.label}
          </p>
          <p className="calc-helper" style={{ marginTop: "0.35rem" }}>
            HUD framing: above 30% of income is rent-burdened, and above 50% is severely
            rent-burdened.
          </p>

          <div className="calc-breakdown">
            <p>
              <strong>Your rent share:</strong> {formatMoney(derived.rentShare)}
            </p>
            <p>
              <strong>Total housing cost (rent + utilities):</strong>{" "}
              {formatMoney(derived.totalHousingCost)}
            </p>
            <p>
              <strong>Gross burden percentage:</strong> {formatPercent(derived.grossBurden)}
            </p>
            <p>
              <strong>Net burden percentage:</strong>{" "}
              {derived.netBurden !== null
                ? formatPercent(derived.netBurden)
                : "Net burden could not be calculated because take-home pay was not provided."}
            </p>
            <p>
              <strong>Monthly surplus or deficit:</strong> {formatMoney(derived.monthlySurplus)}
            </p>
            <p>
              <strong>Hourly wage needed to stay under 30% gross burden:</strong>{" "}
              {formatMoney(derived.hourlyNeededFor30)}/hr
            </p>
            <p>
              <strong>Weeks of work per month to cover housing:</strong>{" "}
              {derived.weeksOfWork !== null
                ? `${derived.weeksOfWork.toFixed(2)} weeks`
                : "Enter hourly wage to calculate."}
            </p>
          </div>

          {derived.rentShare > monthlyIncome ? (
            <p className="calc-alert" style={{ marginBottom: "0.5rem" }}>
              Your rent share alone exceeds your income - this is a housing crisis situation.
            </p>
          ) : null}

          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={250}
              minHeight={180}
              initialDimension={{ width: 640, height: 200 }}
            >
              <BarChart data={chartData} margin={{ top: 20, right: 12, left: 10, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-stroke)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis domain={[0, Math.max(100, Math.ceil(derived.grossBurden + 10))]} unit="%" />
                <ReferenceLine y={30} stroke="var(--burden-threshold)" strokeWidth={2} />
                <ReferenceLine y={50} stroke="var(--burden-urgent)" strokeWidth={2} />
                <Bar dataKey="burden" fill="var(--trend-line)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}
    </section>
  );
}
