import processedDataJson from "../../data/processed.json";
import { ProcessedDataSchema, type ProcessedData } from "./schema";

export function getStoryData(): ProcessedData {
  const parsed = ProcessedDataSchema.safeParse(processedDataJson);

  if (!parsed.success) {
    throw new Error("processed.json failed schema validation");
  }

  return parsed.data;
}

export const loadProcessedData = getStoryData;
