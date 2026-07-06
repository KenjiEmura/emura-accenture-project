// @vitest-environment node
import { NextRequest } from "next/server";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { GET } from "./population";

// "server-only" throws outside a real server bundle — neutralize it for tests
vi.mock("server-only", () => ({}));

// Key handling and failure details are covered by yumemi-api.test.ts;
// here we only test what the route itself adds on top of the shared helper.

// Minimal valid YUMEMI population payload
const validYumemiPayload = {
  message: null,
  result: {
    boundaryYear: 2020,
    data: [
      { label: "総人口", data: [{ year: 1960, value: 5039206 }] },
      {
        label: "年少人口",
        data: [{ year: 1960, value: 1681479, rate: 33.37 }],
      },
    ],
  },
};

const requestFor = (query: string) =>
  new NextRequest(`http://localhost/api/population${query}`);

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  vi.stubEnv("YUMEMI_API_KEY", "test-api-key");
  // Keep expected error logs out of the test output
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  mockFetch.mockReset();
});

test("returns the population data for a valid prefCode", async () => {
  mockFetch.mockResolvedValue(Response.json(validYumemiPayload));

  const response = await GET(requestFor("?prefCode=13"));

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(validYumemiPayload.result);
  // The prefCode is forwarded to YUMEMI as a query param
  const [url] = mockFetch.mock.calls[0];
  expect(String(url)).toContain("prefCode=13");
});

test.each(["?prefCode=0", "?prefCode=48", "?prefCode=abc", ""])(
  "returns 400 without calling YUMEMI for invalid query %j",
  async (query) => {
    const response = await GET(requestFor(query));

    expect(response.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  },
);

test("returns the sanitized error when the YUMEMI call fails", async () => {
  mockFetch.mockRejectedValue(new Error("connection refused"));

  const response = await GET(requestFor("?prefCode=13"));

  expect(response.status).toBe(502);
});

test("returns 502 when YUMEMI responds with an unexpected shape", async () => {
  mockFetch.mockResolvedValue(
    Response.json({ message: null, result: { wrong: true } }),
  );

  const response = await GET(requestFor("?prefCode=13"));

  expect(response.status).toBe(502);
});
