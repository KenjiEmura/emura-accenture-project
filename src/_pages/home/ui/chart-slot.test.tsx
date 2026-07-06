import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { ChartSlot, resolveChartOverlay } from "./chart-slot";

// jsdom has no layout, so ResponsiveContainer would measure 0×0 and render
// nothing — replace it with a fixed-size chart for the test.
vi.mock("recharts", async (importOriginal) => {
  const recharts = await importOriginal<typeof import("recharts")>();
  const FixedSizeContainer = (
    props: React.ComponentProps<typeof recharts.ResponsiveContainer>,
  ) => <recharts.ResponsiveContainer {...props} width={800} height={400} />;
  return { ...recharts, ResponsiveContainer: FixedSizeContainer };
});

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
  expect(container.querySelectorAll(".recharts-line")).toHaveLength(0);
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

test("shows the real chart once a prefecture is loaded", () => {
  const { container } = render(
    <ChartSlot
      rows={rows}
      lines={chartLines}
      projectionBoundaryYear={2020}
      overlay="none"
    />,
  );

  expect(container.querySelectorAll(".recharts-line")).toHaveLength(1);
  expect(container.querySelector(".animate-spin")).toBeNull();
});
