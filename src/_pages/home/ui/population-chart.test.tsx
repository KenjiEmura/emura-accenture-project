import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { PopulationChart } from "./population-chart";

// jsdom has no layout, so ResponsiveContainer would measure 0×0 and render
// nothing — replace it with a fixed-size chart for the test.
vi.mock("recharts", async (importOriginal) => {
  const recharts = await importOriginal<typeof import("recharts")>();
  const FixedSizeContainer = (
    props: React.ComponentProps<typeof recharts.ResponsiveContainer>,
  ) => <recharts.ResponsiveContainer {...props} width={800} height={400} />;
  return { ...recharts, ResponsiveContainer: FixedSizeContainer };
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
