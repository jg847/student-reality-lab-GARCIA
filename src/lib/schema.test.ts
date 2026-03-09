import { describe, expect, it } from "vitest";
import { ProcessedDataSchema } from "./schema";

describe("ProcessedDataSchema", () => {
  it("validates a correct processed data object", () => {
    const validData = {
      location: "Essex County, NJ (Newark)",
      wages: {
        livingWage: 25.03,
        minimumWage: 15.92,
      },
      rent: {
        currentMonthlyRent: 2200.5,
        rentTrend: [
          { date: "2024-12-31", rent: 2190.1 },
          { date: "2025-01-31", rent: 2200.5 },
        ],
      },
    };

    const parsed = ProcessedDataSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it("rejects an invalid processed data object", () => {
    const invalidData = {
      location: "Essex County, NJ (Newark)",
      wages: {
        livingWage: "25.03",
        minimumWage: 15.92,
      },
      rent: {
        currentMonthlyRent: "2200.5",
        rentTrend: [{ date: "2025-01-31", rent: "2200.5" }],
      },
    };

    const parsed = ProcessedDataSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });
});
