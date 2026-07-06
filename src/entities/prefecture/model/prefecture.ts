import { z } from "zod";

// Mirrors GET /api/v1/prefectures (docs/api.md).
// Schema and inferred type share one name (TS value/type namespaces).
export const Prefecture = z.object({
  prefCode: z.number().int(),
  prefName: z.string(),
});
export type Prefecture = z.infer<typeof Prefecture>;

// Japan has exactly 47 prefectures (codes 1…47) and that count is fixed —
// it bounds PrefCode and sizes the loading placeholders so the grid
// reserves its final height.
export const PREFECTURE_COUNT = 47;

// Valid prefecture code sent by the client: 1 (北海道) … 47 (沖縄県).
// Coerces the raw query-string value, e.g. "12" -> 12.
export const PrefCode = z.coerce.number().int().min(1).max(PREFECTURE_COUNT);
export type PrefCode = z.infer<typeof PrefCode>;

// Full YUMEMI API response envelope: { message, result }
export const PrefecturesResponse = z.object({
  message: z.string().nullable(),
  result: z.array(Prefecture),
});
export type PrefecturesResponse = z.infer<typeof PrefecturesResponse>;
