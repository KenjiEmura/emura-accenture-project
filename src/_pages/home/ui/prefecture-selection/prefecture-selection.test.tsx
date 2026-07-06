import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { PrefectureSelection } from "./prefecture-selection";

const prefectures = [
  { prefCode: 1, prefName: "北海道" },
  { prefCode: 13, prefName: "東京都" },
];

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockFetch.mockReset();
});

// Drive the component through fetch responses (the way the browser does)
// with a real query client; retries are off so a failure errors immediately.
const renderSelection = (selectedPrefCodes: number[] = []) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <PrefectureSelection
        selectedPrefCodes={selectedPrefCodes}
        onToggle={vi.fn()}
      />
    </QueryClientProvider>,
  );

test("shows the loading skeleton while the prefecture list loads", () => {
  // A fetch that never resolves keeps the query pending
  mockFetch.mockReturnValue(new Promise(() => {}));

  renderSelection();

  // The skeleton's details are covered by its own tests
  expect(screen.getByRole("status")).toBeInTheDocument();
});

test("shows a retry action that refetches when the list fails", async () => {
  const user = userEvent.setup();
  mockFetch.mockResolvedValue(
    Response.json({ error: "upstream down" }, { status: 502 }),
  );

  renderSelection();

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent("都道府県の取得に失敗しました");

  await user.click(within(alert).getByRole("button", { name: "再試行" }));

  // The retry fires a second request for the prefecture list
  await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
});

test("renders the checkbox grid once the list loads", async () => {
  mockFetch.mockResolvedValue(Response.json(prefectures));

  renderSelection([13]);

  // A checked 東京都 proves both the list and the selection reached the grid;
  // the grid's own behavior is covered by its own tests
  expect(await screen.findByRole("checkbox", { name: "東京都" })).toBeChecked();
});
