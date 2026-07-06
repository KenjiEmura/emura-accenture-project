import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { ChartDataSection } from "./chart-data-section";

// Replace ResponsiveContainer with a fixed-size one so the chart draws in jsdom
vi.mock("recharts", async () => {
  const { rechartsWithFixedSizeContainer } = await import("@/shared/testing");
  return rechartsWithFixedSizeContainer();
});

const prefectures = [
  { prefCode: 1, prefName: "北海道" },
  { prefCode: 2, prefName: "青森県" },
];

// Minimal valid population result for a prefecture that loads successfully.
const populationResult = {
  boundaryYear: 2020,
  data: [{ label: "総人口", data: [{ year: 1980, value: 5575989 }] }],
};

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockFetch.mockReset();
});

const prefCodeOf = (url: string) =>
  new URL(url, "http://localhost").searchParams.get("prefCode");

// Routes fetches by URL: the prefecture list always loads, population
// requests fail for the given prefCodes and succeed for the rest.
const respondWithFailuresFor = (failingPrefCodes: number[]) => {
  mockFetch.mockImplementation((requestUrl: string) => {
    if (requestUrl.includes("/api/prefectures")) {
      return Promise.resolve(Response.json(prefectures));
    }
    const failed = failingPrefCodes.some(
      (prefCode) => prefCodeOf(requestUrl) === String(prefCode),
    );
    return Promise.resolve(
      failed
        ? Response.json({ error: "upstream down" }, { status: 502 })
        : Response.json(populationResult),
    );
  });
};

// How many population requests went out for one prefecture
const populationRequestsFor = (prefCode: number) =>
  mockFetch.mock.calls.filter(
    ([requestUrl]) => prefCodeOf(String(requestUrl)) === String(prefCode),
  ).length;

// Drive the component through fetch responses (the way the browser does)
// with a real query client; retries are off so a failure errors immediately.
const renderSection = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <ChartDataSection prefCodes={[1, 2]} populationType="総人口" />
    </QueryClientProvider>,
  );

test("shows a retry row for a failed prefecture without dropping a loaded one", async () => {
  // 北海道 (prefCode 1) fails, 青森県 (prefCode 2) loads
  respondWithFailuresFor([1]);

  const { container } = renderSection();

  // The failed prefecture gets its own alert with a retry action
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(
      "北海道 のデータ取得に失敗しました",
    ),
  );
  expect(
    within(screen.getByRole("alert")).getByRole("button", { name: "再試行" }),
  ).toBeInTheDocument();

  // The loaded prefecture still draws its line — one failure never blanks it
  await waitFor(() =>
    expect(container.querySelectorAll(".recharts-line")).toHaveLength(1),
  );
});

test("shows one error row per failed prefecture and retries only the clicked one", async () => {
  const user = userEvent.setup();
  respondWithFailuresFor([1, 2]);

  renderSection();

  // One alert per failed prefecture, in selection order
  await waitFor(() => {
    const alerts = screen.getAllByRole("alert");
    expect(alerts).toHaveLength(2);
    expect(alerts[0]).toHaveTextContent("北海道");
    expect(alerts[1]).toHaveTextContent("青森県");
  });

  await user.click(
    within(screen.getAllByRole("alert")[0]).getByRole("button", {
      name: "再試行",
    }),
  );

  // Only 北海道 is requested again; 青森県 keeps its single failed request
  await waitFor(() => expect(populationRequestsFor(1)).toBe(2));
  expect(populationRequestsFor(2)).toBe(1);
});
