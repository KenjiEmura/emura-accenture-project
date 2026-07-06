import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { ChartSlot, resolveChartOverlay } from "./chart-slot";

// ChartSlot's job is choosing between the chart and the skeleton — how the
// chart draws is covered by population-chart.test.tsx, so stub it out here.
vi.mock("../population-chart", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../population-chart")>()),
  PopulationChart: () => <div data-testid="population-chart" />,
}));

const rows = [{ year: 1980, 北海道: 5575989 }];
const chartLines = [{ prefCode: 1, prefName: "北海道" }];

test("maps page state to the right overlay", () => {
  expect(resolveChartOverlay(false, false)).toBe("instruction");
  expect(resolveChartOverlay(false, true)).toBe("instruction");
  expect(resolveChartOverlay(true, true)).toBe("spinner");
  expect(resolveChartOverlay(true, false)).toBe("none");
});

test("shows the skeleton with the instruction when nothing is selected", () => {
  const { container } = render(
    <ChartSlot
      rows={[]}
      lines={[]}
      projectionBoundaryYear={null}
      overlay="instruction"
    />,
  );

  expect(screen.getByText("都道府県を選択してください")).toBeInTheDocument();
  // The skeleton is decorative and hidden from assistive technology
  expect(container.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  expect(screen.queryByTestId("population-chart")).not.toBeInTheDocument();
});

test("shows the skeleton with a spinner during the first load", () => {
  const { container } = render(
    <ChartSlot
      rows={[]}
      lines={[]}
      projectionBoundaryYear={null}
      overlay="spinner"
    />,
  );

  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(
    screen.queryByText("都道府県を選択してください"),
  ).not.toBeInTheDocument();
});

test("swaps the skeleton for the chart once a prefecture is loaded", () => {
  const { container } = render(
    <ChartSlot
      rows={rows}
      lines={chartLines}
      projectionBoundaryYear={2020}
      overlay="none"
    />,
  );

  expect(screen.getByTestId("population-chart")).toBeInTheDocument();
  expect(container.querySelector('svg[aria-hidden="true"]')).toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});
