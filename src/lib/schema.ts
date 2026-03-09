import { z } from "zod";

export const RentPointSchema = z.object({
  date: z.string(),
  rent: z.number(),
});

export const ProcessedDataSchema = z.object({
  location: z.string(),
  wages: z.object({
    livingWage: z.number(),
    minimumWage: z.number(),
  }),
  rent: z.object({
    currentMonthlyRent: z.number(),
    rentTrend: z.array(RentPointSchema),
  }),
});

export type RentPoint = z.infer<typeof RentPointSchema>;
export type ProcessedData = z.infer<typeof ProcessedDataSchema>;
