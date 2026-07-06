"use client";

import {
  PopulationTypeSelector,
  usePopulationType,
} from "@/features/choose-population-type";
import { useSelectedPrefCodes } from "@/features/select-prefectures";

import { ChartDataSection } from "./chart-data-section";
import { PrefectureSelection } from "./prefecture-selection";

// Home page: pick prefectures and a population type, see the line chart.
export const HomePage = () => {
  const { selectedPrefCodes, togglePrefCode } = useSelectedPrefCodes();
  const { populationType, setPopulationType } = usePopulationType();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 pb-[200px] sm:p-6">
      <h1 className="mt-6 text-center text-3xl font-bold sm:text-2xl">
        都道府県別人口推移グラフ
      </h1>
      <p className="text-center text-sm text-gray-600">
        都道府県を選択すると、選択した人口データの推移がグラフに表示されます
      </p>
      <PrefectureSelection
        selectedPrefCodes={selectedPrefCodes}
        onToggle={togglePrefCode}
      />
      <PopulationTypeSelector
        selectedType={populationType}
        onChange={setPopulationType}
      />
      <ChartDataSection
        prefCodes={selectedPrefCodes}
        populationType={populationType}
      />
    </main>
  );
};
