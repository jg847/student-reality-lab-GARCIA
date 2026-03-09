import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WageGapChart } from "./WageGapChart";

describe("WageGapChart", () => {
  it("renders wage chart heading", () => {
    const wageData = [
      { category: "Retail", low: 15.92, median: 17, high: 24 },
      { category: "Customer Service", low: 16, median: 21.25, high: 26 },
    ];

    render(<WageGapChart wageData={wageData} targetWage={35} />);

    expect(
      screen.getByRole("heading", { name: /newark wage reality vs. independent living target/i })
    ).toBeInTheDocument();
  });
});
