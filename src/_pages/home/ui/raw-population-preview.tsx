"use client";

import type { UseQueryResult } from "@tanstack/react-query";

import type { PopulationResult, PopulationType } from "@/entities/population";
import { usePopulationQueries } from "@/entities/population";
import type { PrefCode } from "@/entities/prefecture";

type Props = Readonly<{
  prefCodes: PrefCode[];
  populationType: PopulationType;
}>;

// TEMPORARY: renders the fetched population data as raw text so the full
// pipeline (checkbox → query → proxy → YUMEMI) can be verified by eye.
// Replaced by the line chart in a later step.
export const RawPopulationPreview = ({ prefCodes, populationType }: Props) => {
  const populationQueries = usePopulationQueries(prefCodes);

  if (prefCodes.length === 0) {
    return <p>都道府県を選択してください</p>;
  }

  return (
    <section className="flex flex-col gap-4">
      {populationQueries.map((populationQuery, index) => (
        <SinglePrefecturePreview
          key={prefCodes[index]}
          prefCode={prefCodes[index]}
          populationType={populationType}
          populationQuery={populationQuery}
        />
      ))}
    </section>
  );
};

type SinglePrefecturePreviewProps = Readonly<{
  prefCode: PrefCode;
  populationType: PopulationType;
  populationQuery: UseQueryResult<PopulationResult, Error>;
}>;

// One prefecture's raw data. One early return per state:
// loading, error, then the happy path.
const SinglePrefecturePreview = ({
  prefCode,
  populationType,
  populationQuery,
}: SinglePrefecturePreviewProps) => {
  if (populationQuery.isPending) {
    return <p>prefCode {prefCode}: 読み込み中…</p>;
  }

  if (populationQuery.isError) {
    return (
      <p role="alert">
        prefCode {prefCode}: {populationQuery.error.message}
      </p>
    );
  }

  // Show only the series the user selected (総人口, 年少人口, …)
  const selectedSeries = populationQuery.data.data.find(
    (populationSeries) => populationSeries.label === populationType,
  );

  return (
    <div>
      <h2 className="font-bold">
        prefCode {prefCode}（{populationType}）
      </h2>
      <pre className="overflow-x-auto text-xs">
        {JSON.stringify(selectedSeries?.data)}
      </pre>
    </div>
  );
};
