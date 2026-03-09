import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { ProcessedDataSchema } from "../src/lib/schema";

type CsvRow = Record<string, string>;

function toNumber(value: string | undefined): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[$,\s]/g, "");
  if (!cleaned) return null;

  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function isDateColumn(column: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(column);
}

async function main() {
  const root = process.cwd();
  const livingWagePath = path.join(root, "data", "raw", "living_wage_essex_nj.csv");
  const rentPath = path.join(root, "data", "raw", "County_zori_uc_sfrcondomfr_sm_m.csv");
  const outputPath = path.join(root, "data", "processed.json");

  const [livingWageCsv, rentCsv] = await Promise.all([
    readFile(livingWagePath, "utf8"),
    readFile(rentPath, "utf8"),
  ]);

  const livingWageRows = parse(livingWageCsv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  const wageColumn = "1 ADULT - 0 Children";
  const livingWageRow = livingWageRows.find((row) => row.Category === "Living Wage");
  const minimumWageRow = livingWageRows.find((row) => row.Category === "Minimum Wage");

  if (!livingWageRow || !minimumWageRow) {
    throw new Error("Could not find Living Wage and/or Minimum Wage rows in living wage CSV.");
  }

  const livingWage = toNumber(livingWageRow[wageColumn]);
  const minimumWage = toNumber(minimumWageRow[wageColumn]);

  if (livingWage === null || minimumWage === null) {
    throw new Error(`Could not parse numeric wage values from column '${wageColumn}'.`);
  }

  const rentRows = parse(rentCsv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  const essexCountyRow = rentRows.find(
    (row) => row.RegionName === "Essex County" && row.State === "NJ"
  );

  if (!essexCountyRow) {
    throw new Error("Could not find Essex County, NJ row in Zillow rent CSV.");
  }

  const rentTrend = Object.keys(essexCountyRow)
    .filter((column) => isDateColumn(column))
    .sort((a, b) => a.localeCompare(b))
    .map((date) => ({
      date,
      rent: toNumber(essexCountyRow[date]),
    }))
    .filter((point): point is { date: string; rent: number } => point.rent !== null);

  if (rentTrend.length === 0) {
    throw new Error("No valid rent trend points found for Essex County, NJ.");
  }

  const currentMonthlyRent = rentTrend[rentTrend.length - 1].rent;

  const processed = {
    location: "Essex County, NJ (Newark)",
    wages: {
      livingWage,
      minimumWage,
    },
    rent: {
      currentMonthlyRent,
      rentTrend,
    },
  };

  const validated = ProcessedDataSchema.parse(processed);
  await writeFile(outputPath, JSON.stringify(validated, null, 2), "utf8");

  console.log(`Processed data written to ${outputPath}`);
}

main().catch((error) => {
  console.error("Failed to process data:", error);
  process.exit(1);
});
