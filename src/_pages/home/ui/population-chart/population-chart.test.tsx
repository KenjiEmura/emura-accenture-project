import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { PopulationChart } from "./population-chart";

// Replace ResponsiveContainer with a fixed-size one so the chart draws in jsdom
vi.mock("recharts", async () => {
  const { rechartsWithFixedSizeContainer } = await import("@/shared/testing");
  return rechartsWithFixedSizeContainer();
});

const rows = [
  { year: 1980, 北海道: 5575989, 東京都: 11618281 },
  { year: 1990, 北海道: 5643647, 東京都: 11855563 },
];

const chartLines = [
  { prefCode: 1, prefName: "北海道" },
  { prefCode: 13, prefName: "東京都" },
];

test("renders one line per prefecture with a legend", () => {
  const { container } = render(
    <PopulationChart
      rows={rows}
      lines={chartLines}
      projectionBoundaryYear={2020}
    />,
  );

  // Legend shows both prefecture names
  expect(screen.getByText("北海道")).toBeInTheDocument();
  expect(screen.getByText("東京都")).toBeInTheDocument();
  // One rendered line path per prefecture
  expect(container.querySelectorAll(".recharts-line")).toHaveLength(2);
});
