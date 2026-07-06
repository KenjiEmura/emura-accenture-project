// @vitest-environment node
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { GET } from "./prefectures";

// "server-only" throws outside a real server bundle — neutralize it for tests
vi.mock("server-only", () => ({}));

// Key handling and failure details are covered by yumemi-api.test.ts;
// here we only test what the route itself adds on top of the shared helper.

// Minimal valid YUMEMI prefectures payload
const validYumemiPayload = {
  message: null,
  result: [{ prefCode: 1, prefName: "北海道" }],
};

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

test("returns the prefecture list without the YUMEMI envelope", async () => {
  mockFetch.mockResolvedValue(Response.json(validYumemiPayload));

  const response = await GET();

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(validYumemiPayload.result);
});

test("returns the sanitized error when the YUMEMI call fails", async () => {
  mockFetch.mockRejectedValue(new Error("connection refused"));

  const response = await GET();

  expect(response.status).toBe(502);
});

test("returns 502 when YUMEMI responds with an unexpected shape", async () => {
  mockFetch.mockResolvedValue(Response.json({ unexpected: "shape" }));

  const response = await GET();

  expect(response.status).toBe(502);
});
