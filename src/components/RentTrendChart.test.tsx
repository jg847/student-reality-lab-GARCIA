import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RentTrendChart } from "./RentTrendChart";

describe("RentTrendChart", () => {
  it("mounts and renders context heading for rent trend", () => {
    const rentTrend = [
      { date: "2023-01-31", rent: 1800 },
      { date: "2024-01-31", rent: 2000 },
      { date: "2025-01-31", rent: 2200 },
    ];

    render(<RentTrendChart rentTrend={rentTrend} />);

    expect(screen.getByRole("heading", { name: /rent over time/i })).toBeInTheDocument();
  });
});
