import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { HomePage } from "./home-page";

beforeEach(() => {
  // A fetch that never resolves keeps every query in its loading state
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise(() => {})),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const renderHomePage = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <HomePage />
    </QueryClientProvider>,
  );

test("renders the title, the type selector, and the initial states", () => {
  renderHomePage();

  expect(
    screen.getByRole("heading", { name: "都道府県別人口推移グラフ" }),
  ).toBeInTheDocument();
  // Prefecture list is loading
  expect(screen.getByText("都道府県を読み込み中…")).toBeInTheDocument();
  // The four population types are already selectable
  expect(screen.getAllByRole("radio")).toHaveLength(4);
  // No prefecture is selected yet
  expect(screen.getByText("都道府県を選択してください")).toBeInTheDocument();
});
