import { NextResponse } from "next/server";

import { PrefecturesResponse } from "@/entities/prefecture";
import { YUMEMI_PREFECTURES_PATH } from "@/shared/config";

import { fetchYumemiApiJson, yumemiApiFailureResponse } from "./yumemi-api";

// GET /api/prefectures — proxies the YUMEMI API prefecture list.
export const GET = async () => {
  // Call the YUMEMI API with the server-only key
  const result = await fetchYumemiApiJson(YUMEMI_PREFECTURES_PATH);
  if (!result.ok) {
    return yumemiApiFailureResponse(result.reason);
  }

  // Validate the untrusted response before typing it
  const parsed = PrefecturesResponse.safeParse(result.json);
  if (!parsed.success) {
    console.error("Unexpected YUMEMI API prefectures shape", parsed.error);
    return NextResponse.json(
      { error: "Unexpected response from the YUMEMI API" },
      { status: 502 },
    );
  }

  // Hand the client only the data it needs (drop the envelope)
  return NextResponse.json(parsed.data.result);
};
