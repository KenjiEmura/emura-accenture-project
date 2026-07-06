// @vitest-environment node
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { fetchYumemiApiJson, yumemiApiFailureResponse } from "./yumemi-api";

// "server-only" throws outside a real server bundle — neutralize it for tests
vi.mock("server-only", () => ({}));

const TEST_API_KEY = "test-api-key";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  vi.stubEnv("YUMEMI_API_KEY", TEST_API_KEY);
  // Keep expected error logs out of the test output
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  mockFetch.mockReset();
});

test("sends the API key header and returns the response JSON", async () => {
  mockFetch.mockResolvedValue(Response.json({ any: "payload" }));

  const result = await fetchYumemiApiJson("some/path", { prefCode: "13" });

  expect(result).toEqual({ ok: true, json: { any: "payload" } });
  const [url, requestInit] = mockFetch.mock.calls[0];
  expect(String(url)).toContain("prefCode=13");
  expect(requestInit.headers).toEqual({ "X-API-KEY": TEST_API_KEY });
});

test("fails without calling YUMEMI when the API key is not configured", async () => {
  vi.stubEnv("YUMEMI_API_KEY", "");

  const result = await fetchYumemiApiJson("some/path");

  expect(result).toEqual({ ok: false, reason: "missing-api-key" });
  expect(mockFetch).not.toHaveBeenCalled();
});

test("fails when YUMEMI responds with an error status", async () => {
  mockFetch.mockResolvedValue(
    Response.json({ message: "Forbidden" }, { status: 403 }),
  );

  const result = await fetchYumemiApiJson("some/path");

  expect(result).toEqual({ ok: false, reason: "error-response" });
});

test("fails when the network request throws", async () => {
  mockFetch.mockRejectedValue(new Error("connection refused"));

  const result = await fetchYumemiApiJson("some/path");

  expect(result).toEqual({ ok: false, reason: "network-error" });
});

test("maps a missing key to 500 and YUMEMI failures to a sanitized 502", async () => {
  expect(yumemiApiFailureResponse("missing-api-key").status).toBe(500);

  for (const reason of ["error-response", "network-error"] as const) {
    const response = yumemiApiFailureResponse(reason);
    expect(response.status).toBe(502);
    // The body is a fixed message, so upstream details can never leak
    expect(await response.json()).toEqual({
      error: "Failed to fetch data from the YUMEMI API",
    });
  }
});
