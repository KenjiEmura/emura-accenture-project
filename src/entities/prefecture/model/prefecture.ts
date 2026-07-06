import { z } from "zod";

// Mirrors GET /api/v1/prefectures (docs/api.md).
// Schema and inferred type share one name (TS value/type namespaces).
export const Prefecture = z.object({
  prefCode: z.number().int(),
  prefName: z.string(),
});
export type Prefecture = z.infer<typeof Prefecture>;

// Valid prefecture code sent by the client: 1 (北海道) … 47 (沖縄県).
// Coerces the raw query-string value, e.g. "12" -> 12.
export const PrefCode = z.coerce.number().int().min(1).max(47);
export type PrefCode = z.infer<typeof PrefCode>;

// Full upstream response envelope: { message, result }
export const PrefecturesResponse = z.object({
  message: z.string().nullable(),
  result: z.array(Prefecture),
});
export type PrefecturesResponse = z.infer<typeof PrefecturesResponse>;
