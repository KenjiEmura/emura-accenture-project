"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { chartLineColorFor } from "@/shared/config";
import { formatPopulation, usePrefersReducedMotion } from "@/shared/lib";

import type { ChartRow } from "../../lib/build-chart-rows";

// Fixed chart height — also used by the loading placeholder that keeps
// the layout from shifting while the first prefecture loads.
export const CHART_HEIGHT_PX = 600;

// One chart line = one prefecture; the color follows the prefCode so a
// prefecture never changes color when others are checked or unchecked.
export type ChartLine = Readonly<{
  prefCode: number;
  prefName: string;
}>;

type Props = Readonly<{
  rows: ChartRow[];
  lines: ChartLine[];
  // Last census year — later years are projections, marked in the tooltip
  projectionBoundaryYear: number | null;
}>;

// Line chart of population per year, one line per selected prefecture.
// Recharts only renders in the browser (it measures the DOM), hence "use client".
export const PopulationChart = ({
  rows,
  lines,
  projectionBoundaryYear,
}: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const formatTooltipYear = (year: number) => {
    const isProjected =
      projectionBoundaryYear !== null && year > projectionBoundaryYear;
    return isProjected ? `${year}年（推計値）` : `${year}年`;
  };

  return (
    <div className="tabular-nums">
      <ResponsiveContainer
        width="100%"
        height={CHART_HEIGHT_PX}
        className="-ml-4"
      >
        <LineChart data={rows} margin={{ top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={formatPopulation} width={64} />
          <Tooltip
            labelFormatter={(yearLabel) => formatTooltipYear(Number(yearLabel))}
            formatter={(value) =>
              typeof value === "number" ? formatPopulation(value) : value
            }
          />
          <Legend />
          {lines.map((line) => (
            <Line
              key={line.prefCode}
              type="monotone"
              dataKey={line.prefName}
              stroke={chartLineColorFor(line.prefCode)}
              dot={false}
              isAnimationActive={!prefersReducedMotion}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
