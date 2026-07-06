"use client";

import {
  PopulationTypeSelector,
  usePopulationType,
} from "@/features/choose-population-type";
import { useSelectedPrefCodes } from "@/features/select-prefectures";

import { PrefectureSelection } from "./prefecture-selection";
import { RawPopulationPreview } from "./raw-population-preview";

// Home page: pick prefectures and a population type, see the data.
// The raw preview is replaced by the line chart in a later step.
export const HomePage = () => {
  const { selectedPrefCodes, togglePrefCode } = useSelectedPrefCodes();
  const { populationType, setPopulationType } = usePopulationType();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4">
      <h1 className="text-xl font-bold">都道府県別人口推移グラフ</h1>
      <PrefectureSelection
        selectedPrefCodes={selectedPrefCodes}
        onToggle={togglePrefCode}
      />
      <PopulationTypeSelector
        selectedType={populationType}
        onChange={setPopulationType}
      />
      <RawPopulationPreview
        prefCodes={selectedPrefCodes}
        populationType={populationType}
      />
    </main>
  );
};
