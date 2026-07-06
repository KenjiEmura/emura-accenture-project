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
    ],
  },
};

test("returns no rows when nothing is loaded", () => {
  expect(buildChartRows([], "総人口")).toEqual([]);
});

test("builds one row per year with one key per prefecture", () => {
  const rows = buildChartRows([hokkaido, tokyo], "総人口");

  expect(rows).toEqual([
    { year: 1980, 北海道: 5575989, 東京都: 11618281 },
    { year: 1990, 北海道: 5643647, 東京都: 11855563 },
  ]);
});

test("sorts rows chronologically even when the API data is unordered", () => {
  const rows = buildChartRows([tokyo], "総人口");

  expect(rows.map((row) => row.year)).toEqual([1980, 1990]);
});

test("picks only the selected population type", () => {
  const rows = buildChartRows([hokkaido], "年少人口");

  expect(rows).toEqual([{ year: 1980, 北海道: 1298324 }]);
});

test("omits a prefecture's key for years it has no data", () => {
  const rows = buildChartRows([hokkaido, tokyo], "年少人口");

  // Tokyo has no 年少人口 series at all, so only Hokkaido appears
  expect(rows).toEqual([{ year: 1980, 北海道: 1298324 }]);
});

test("finds the earliest projection boundary year", () => {
  expect(findProjectionBoundaryYear([hokkaido, tokyo])).toBe(2015);
  expect(findProjectionBoundaryYear([])).toBeNull();
});
