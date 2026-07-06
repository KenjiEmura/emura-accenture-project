import { type NextRequest, NextResponse } from "next/server";

import { PopulationResponse } from "@/entities/population";
import { PrefCode } from "@/entities/prefecture";
import { YUMEMI_POPULATION_PATH } from "@/shared/config";

import { fetchYumemiApiJson, yumemiApiFailureResponse } from "./yumemi-api";

// GET /api/population?prefCode=N — proxies the YUMEMI API population
// composition for one prefecture.
export const GET = async (request: NextRequest) => {
  // Validate the query param; PrefCode coerces "13" -> 13 and bounds it to 1–47
  const prefCode = PrefCode.safeParse(
    request.nextUrl.searchParams.get("prefCode"),
  );
  if (!prefCode.success) {
    return NextResponse.json(
      { error: "prefCode must be an integer between 1 and 47" },
      { status: 400 },
    );
  }

  // Call the YUMEMI API with the server-only key
  const result = await fetchYumemiApiJson(YUMEMI_POPULATION_PATH, {
    prefCode: String(prefCode.data),
  });
  if (!result.ok) {
    return yumemiApiFailureResponse(result.reason);
  }

  // Validate the untrusted response before typing it
  const parsed = PopulationResponse.safeParse(result.json);
  if (!parsed.success) {
    console.error("Unexpected YUMEMI API population shape", parsed.error);
    return NextResponse.json(
      { error: "Unexpected response from the YUMEMI API" },
      { status: 502 },
    );
  }

  // Hand the client only the data it needs (drop the envelope)
  return NextResponse.json(parsed.data.result);
};
