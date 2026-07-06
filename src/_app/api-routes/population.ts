import { type NextRequest, NextResponse } from "next/server";

import { PopulationResponse } from "@/entities/population";
import { PREFECTURE_COUNT, PrefCode } from "@/entities/prefecture";
import { YUMEMI_POPULATION_PATH } from "@/shared/config";

import { proxyYumemiApiRequest } from "./yumemi-api";

// GET /api/population?prefCode=N — proxies the YUMEMI API population
// composition for one prefecture.
export const GET = async (request: NextRequest) => {
  // Validate the query param; PrefCode coerces "13" -> 13 and bounds it
  const prefCode = PrefCode.safeParse(
    request.nextUrl.searchParams.get("prefCode"),
  );
  if (!prefCode.success) {
    return NextResponse.json(
      {
        error: `prefCode must be an integer between 1 and ${PREFECTURE_COUNT}`,
      },
      { status: 400 },
    );
  }

  return proxyYumemiApiRequest(
    YUMEMI_POPULATION_PATH,
    PopulationResponse,
    "population",
    { prefCode: String(prefCode.data) },
  );
};
