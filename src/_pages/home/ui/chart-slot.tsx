"use client";

import { ChartSkeleton, Spinner } from "@/shared/ui";

import type { ChartRow } from "../lib/build-chart-rows";
import {
  CHART_HEIGHT_PX,
  type ChartLine,
  PopulationChart,
} from "./population-chart";

// What floats above the chart slot.
export type ChartOverlay = "instruction" | "spinner" | "none";

// Maps the page state to the overlay: no selection shows the instruction,
// any in-flight request shows the spinner, otherwise nothing.
export const resolveChartOverlay = (
  hasSelection: boolean,
  isLoading: boolean,
): ChartOverlay => {
  if (!hasSelection) {
    return "instruction";
  }
  if (isLoading) {
    return "spinner";
  }
  return "none";
};

type Props = Readonly<{
  rows: ChartRow[];
  lines: ChartLine[];
  projectionBoundaryYear: number | null;
  overlay: ChartOverlay;
}>;

// The chart slot. Always the same height so the layout never shifts:
// the real chart once any prefecture is loaded, a decorative skeleton
// otherwise, with the current overlay floating on top.
export const ChartSlot = ({
  rows,
  lines,
  projectionBoundaryYear,
  overlay,
}: Props) => {
  return (
    <div className="relative">
      {lines.length > 0 ? (
        <PopulationChart
          rows={rows}
          lines={lines}
          projectionBoundaryYear={projectionBoundaryYear}
        />
      ) : (
        <ChartSkeleton height={CHART_HEIGHT_PX} />
      )}

      {overlay !== "none" && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
          {overlay === "instruction" ? (
            <p className="text-lg font-bold text-gray-600">
              都道府県を選択してください
            </p>
          ) : (
            <Spinner />
          )}
        </div>
      )}
    </div>
  );
};
