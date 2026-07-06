import { z } from "zod";

// The four population series the API returns (README requirement 5).
// z.enum doubles as the single source of truth for the toggle labels.
export const PopulationType = z.enum([
  "総人口",
  "年少人口",
  "生産年齢人口",
  "老年人口",
]);
export type PopulationType = z.infer<typeof PopulationType>;

// One point on the chart: population `value` in year `year`.
// `rate` (%) is only present on the non-total series.
export const PopulationDataPoint = z.object({
  year: z.number().int(),
  value: z.number(),
  rate: z.number().optional(),
});
export type PopulationDataPoint = z.infer<typeof PopulationDataPoint>;

// One named series, e.g. { label: "総人口", data: [...] }
export const PopulationSeries = z.object({
  label: PopulationType,
  data: z.array(PopulationDataPoint),
});
export type PopulationSeries = z.infer<typeof PopulationSeries>;

// Years up to `boundaryYear` are census data; later years are projections.
export const PopulationResult = z.object({
  boundaryYear: z.number().int(),
  data: z.array(PopulationSeries),
});
export type PopulationResult = z.infer<typeof PopulationResult>;

// Full YUMEMI API response envelope: { message, result }
export const PopulationResponse = z.object({
  message: z.string().nullable(),
  result: PopulationResult,
});
export type PopulationResponse = z.infer<typeof PopulationResponse>;
