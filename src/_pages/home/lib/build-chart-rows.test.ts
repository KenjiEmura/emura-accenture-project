import { expect, test } from "vitest";

import {
  buildChartRows,
  findProjectionBoundaryYear,
  type LoadedPopulation,
} from "./build-chart-rows";

const hokkaido: LoadedPopulation = {
  prefName: "北海道",
  result: {
    boundaryYear: 2020,
    data: [
      {
        label: "総人口",
        data: [
          { year: 1980, value: 5575989 },
          { year: 1990, value: 5643647 },
        ],
      },
      {
        label: "年少人口",
        data: [{ year: 1980, value: 1298324, rate: 23.3 }],
      },
    ],
  },
};

const tokyo: LoadedPopulation = {
  prefName: "東京都",
  result: {
    boundaryYear: 2015,
    data: [
      {
        label: "総人口",
        data: [
          { year: 1990, value: 11855563 },
          { year: 1980, value: 11618281 },
        ],
      },
      {
        label: "年少人口",
        data: [{ year: 1990, value: 1921000, rate: 16.2 }],
      },
    ],
  },
};

test("returns no rows when nothing is loaded", () => {
  expect(buildChartRows([], "総人口")).toEqual([]);
});

test("builds one sorted row per year with one key per prefecture", () => {
  const rows = buildChartRows([hokkaido, tokyo], "総人口");

  // Tokyo's fixture data is unordered (1990 before 1980), so this also
  // proves the rows come out chronologically sorted
  expect(rows).toEqual([
    { year: 1980, 北海道: 5575989, 東京都: 11618281 },
    { year: 1990, 北海道: 5643647, 東京都: 11855563 },
  ]);
});

test("picks only the selected population type", () => {
  const rows = buildChartRows([hokkaido], "年少人口");

  expect(rows).toEqual([{ year: 1980, 北海道: 1298324 }]);
});

test("omits a prefecture's key for years it has no data", () => {
  const rows = buildChartRows([hokkaido, tokyo], "年少人口");

  // Hokkaido only has 1980 and Tokyo only has 1990 for this type,
  // so each row carries just the prefecture that has data for that year
  expect(rows).toEqual([
    { year: 1980, 北海道: 1298324 },
    { year: 1990, 東京都: 1921000 },
  ]);
});

test("finds the earliest projection boundary year", () => {
  expect(findProjectionBoundaryYear([hokkaido, tokyo])).toBe(2015);
  expect(findProjectionBoundaryYear([])).toBeNull();
});
