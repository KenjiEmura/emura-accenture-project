import type { PopulationResult, PopulationType } from "@/entities/population";

// One loaded prefecture: its display name plus the full API result.
export type LoadedPopulation = Readonly<{
  prefName: string;
  result: PopulationResult;
}>;

// One chart row per year, one key per prefecture:
// { year: 1980, 北海道: 5575989, 東京都: 11618281 }
export type ChartRow = { year: number } & Record<string, number>;

// Merges the selected series of every loaded prefecture into Recharts rows,
// sorted chronologically. Prefectures missing a year simply omit their key.
export const buildChartRows = (
  loadedPopulations: LoadedPopulation[],
  populationType: PopulationType,
): ChartRow[] => {
  const rowsByYear = new Map<number, ChartRow>();

  for (const { prefName, result } of loadedPopulations) {
    // Pick only the series the user selected (総人口, 年少人口, …)
    const selectedSeries = result.data.find(
      (populationSeries) => populationSeries.label === populationType,
    );

    // Add this prefecture's value to the row of each year
    for (const point of selectedSeries?.data ?? []) {
      const row = rowsByYear.get(point.year) ?? { year: point.year };
      row[prefName] = point.value;
      rowsByYear.set(point.year, row);
    }
  }

  return [...rowsByYear.values()].sort((rowA, rowB) => rowA.year - rowB.year);
};

// Years after the boundaryYear are projections, not census data.
// Returns the earliest boundary across the loaded prefectures (they are
// expected to match), or null when nothing is loaded.
export const findProjectionBoundaryYear = (
  loadedPopulations: LoadedPopulation[],
): number | null => {
  const boundaryYears = loadedPopulations.map(
    ({ result }) => result.boundaryYear,
  );
  return boundaryYears.length > 0 ? Math.min(...boundaryYears) : null;
};
