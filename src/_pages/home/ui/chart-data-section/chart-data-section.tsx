"use client";

import type { PopulationType } from "@/entities/population";
import { usePopulationQueries } from "@/entities/population";
import type { PrefCode } from "@/entities/prefecture";
import { usePrefectures } from "@/entities/prefecture";

import {
  buildChartRows,
  findProjectionBoundaryYear,
  type LoadedPopulation,
} from "../../lib/build-chart-rows";
import { ChartSlot, resolveChartOverlay } from "../chart-slot";
import { type ChartLine } from "../population-chart";

type Props = Readonly<{
  prefCodes: PrefCode[];
  populationType: PopulationType;
}>;

// Fetches population data for every checked prefecture and renders the chart.
// Loaded prefectures draw immediately; a failed one shows its own retry
// without blanking the rest; loading is announced politely.
export const ChartDataSection = ({ prefCodes, populationType }: Props) => {
  // The prefecture list is already cached by the checkbox grid's query —
  // reused here only to translate prefCode → prefName for the legend.
  const { data: prefectures } = usePrefectures();
  const populationQueries = usePopulationQueries(prefCodes);

  const prefNameByCode = new Map(
    (prefectures ?? []).map((prefecture) => [
      prefecture.prefCode,
      prefecture.prefName,
    ]),
  );

  // Split the queries into loaded / failed; anything else is still loading
  const loadedPopulations: (LoadedPopulation & ChartLine)[] = [];
  const failedPrefectures: { prefCode: PrefCode; prefName: string }[] = [];
  populationQueries.forEach((populationQuery, index) => {
    const prefCode = prefCodes[index];
    const prefName = prefNameByCode.get(prefCode) ?? `都道府県 ${prefCode}`;
    if (populationQuery.isSuccess) {
      loadedPopulations.push({
        prefCode,
        prefName,
        result: populationQuery.data,
      });
    }
    if (populationQuery.isError) {
      failedPrefectures.push({ prefCode, prefName });
    }
  });
  const isAnyLoading = populationQueries.some(
    (populationQuery) => populationQuery.isPending,
  );

  const rows = buildChartRows(loadedPopulations, populationType);
  const projectionBoundaryYear = findProjectionBoundaryYear(loadedPopulations);

  return (
    <section className="card flex flex-col gap-2">
      {/* Announces loading to screen readers; visually the spinner does it */}
      <p role="status" aria-live="polite" className="sr-only">
        {isAnyLoading && "人口データを読み込み中…"}
      </p>

      {failedPrefectures.map((failedPrefecture) => (
        <FailedPrefectureRow
          key={failedPrefecture.prefCode}
          prefName={failedPrefecture.prefName}
          onRetry={() =>
            populationQueries[
              prefCodes.indexOf(failedPrefecture.prefCode)
            ]?.refetch()
          }
        />
      ))}

      <ChartSlot
        rows={rows}
        lines={loadedPopulations}
        projectionBoundaryYear={projectionBoundaryYear}
        overlay={resolveChartOverlay(prefCodes.length > 0, isAnyLoading)}
      />
    </section>
  );
};

type FailedPrefectureRowProps = Readonly<{
  prefName: string;
  onRetry: () => void;
}>;

const FailedPrefectureRow = ({
  prefName,
  onRetry,
}: FailedPrefectureRowProps) => (
  <p role="alert">
    {prefName} のデータ取得に失敗しました{" "}
    <button type="button" className="link-button" onClick={onRetry}>
      再試行
    </button>
  </p>
);
