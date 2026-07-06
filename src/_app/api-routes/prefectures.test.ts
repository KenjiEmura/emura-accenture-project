// @vitest-environment node
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { GET } from "./prefectures";

// "server-only" throws outside a real server bundle — neutralize it for tests
vi.mock("server-only", () => ({}));

const TEST_API_KEY = "test-api-key";

// Minimal valid YUMEMI prefectures payload
const validYumemiPayload = {
  message: null,
  result: [{ prefCode: 1, prefName: "北海道" }],
};

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

test("returns the prefecture list and sends the API key to YUMEMI", async () => {
  mockFetch.mockResolvedValue(Response.json(validYumemiPayload));

  const response = await GET();

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(validYumemiPayload.result);
  // The key goes to YUMEMI as the X-API-KEY header
  const [, requestInit] = mockFetch.mock.calls[0];
  expect(requestInit.headers).toEqual({ "X-API-KEY": TEST_API_KEY });
});

test("returns 500 when the API key is not configured", async () => {
  vi.stubEnv("YUMEMI_API_KEY", "");

  const response = await GET();

  expect(response.status).toBe(500);
  expect(mockFetch).not.toHaveBeenCalled();
});

test("returns 502 when YUMEMI responds with an error status", async () => {
  mockFetch.mockResolvedValue(
    Response.json({ message: "Forbidden" }, { status: 403 }),
  );

  const response = await GET();

  expect(response.status).toBe(502);
  // The sanitized body must not leak the API key or the YUMEMI status
  const body = JSON.stringify(await response.json());
  expect(body).not.toContain(TEST_API_KEY);
  expect(body).not.toContain("403");
});

test("returns 502 when the network request fails", async () => {
  mockFetch.mockRejectedValue(new Error("connection refused"));

  const response = await GET();

  expect(response.status).toBe(502);
});

test("returns 502 when YUMEMI responds with an unexpected shape", async () => {
  mockFetch.mockResolvedValue(Response.json({ unexpected: "shape" }));

  const response = await GET();

  expect(response.status).toBe(502);
});
