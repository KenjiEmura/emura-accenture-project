// Guards against this module (and the API key) ever reaching a client bundle.
import "server-only";

import { NextResponse } from "next/server";

import { YUMEMI_API_BASE_URL } from "@/shared/config";

// The YUMEMI API data is a static snapshot (October 2024), so each URL is
// cached in the Next.js Data Cache for 24h.
const REVALIDATE_SECONDS = 86_400;

// Discriminated result: callers always know which fork failed.
export type YumemiApiFailureReason =
  "missing-api-key" | "error-response" | "network-error";

export type YumemiApiResult =
  { ok: true; json: unknown } | { ok: false; reason: YumemiApiFailureReason };

// Calls the YUMEMI exam API with the server-only key attached.
// Technical details go to the server log; callers get a typed failure reason.
export const fetchYumemiApiJson = async (
  path: string,
  searchParams?: Record<string, string>,
): Promise<YumemiApiResult> => {
  // Read the key at request time; never expose it to the client
  const apiKey = process.env.YUMEMI_API_KEY;
  if (!apiKey) {
    console.error("YUMEMI_API_KEY is not set");
    return { ok: false, reason: "missing-api-key" };
  }

  // Build the target URL, e.g. .../population/composition/perYear?prefCode=13
  const url = new URL(path, YUMEMI_API_BASE_URL);
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url, {
      headers: { "X-API-KEY": apiKey },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      console.error(`YUMEMI API responded ${response.status} for ${path}`);
      return { ok: false, reason: "error-response" };
    }
    return { ok: true, json: await response.json() };
  } catch (error) {
    console.error(`YUMEMI API request failed for ${path}`, error);
    return { ok: false, reason: "network-error" };
  }
};

// Maps a failure reason to the sanitized error the browser receives:
// a server misconfiguration is our fault (500), the rest is the YUMEMI API (502).
export const yumemiApiFailureResponse = (reason: YumemiApiFailureReason) => {
  if (reason === "missing-api-key") {
    return NextResponse.json(
      { error: "The server is not configured correctly" },
      { status: 500 },
    );
  }
  return NextResponse.json(
    { error: "Failed to fetch data from the YUMEMI API" },
    { status: 502 },
  );
};
