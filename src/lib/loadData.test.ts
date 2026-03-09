import { beforeEach, describe, expect, it, vi } from "vitest";

describe("getStoryData", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns parsed story data when processed.json is valid", async () => {
    const validJson = {
      location: "Essex County, NJ (Newark)",
      wages: {
        livingWage: 25.03,
        minimumWage: 15.92,
      },
      rent: {
        currentMonthlyRent: 2218.66,
        rentTrend: [{ date: "2025-12-31", rent: 2218.66 }],
      },
    };

    vi.doMock("../../data/processed.json", () => ({ default: validJson }));

    const { getStoryData } = await import("./loadData");
    expect(getStoryData()).toEqual(validJson);
  });

  it("throws a specific error when processed.json violates schema", async () => {
    const invalidJson = {
      location: "Essex County, NJ (Newark)",
      wages: {
        livingWage: "25.03",
        minimumWage: 15.92,
      },
      rent: {
        currentMonthlyRent: 2218.66,
        rentTrend: [{ date: "2025-12-31", rent: 2218.66 }],
      },
    };

    vi.doMock("../../data/processed.json", () => ({ default: invalidJson }));

    const { getStoryData } = await import("./loadData");
    expect(() => getStoryData()).toThrowError("processed.json failed schema validation");
  });
});
