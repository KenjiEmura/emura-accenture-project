"use client";

import type { PrefCode, Prefecture } from "@/entities/prefecture";

type Props = Readonly<{
  prefectures: Prefecture[];
  selectedPrefCodes: PrefCode[];
  onToggle: (prefCode: PrefCode) => void;
}>;

// Checkbox grid for picking prefectures — fully controlled by the parent.
export const PrefectureCheckboxGrid = ({
  prefectures,
  selectedPrefCodes,
  onToggle,
}: Props) => {
  return (
    <fieldset className="card">
      <legend className="px-2 font-bold">都道府県</legend>
      <div className="grid grid-cols-2 gap-x-2 sm:grid-cols-4 md:grid-cols-6">
        {prefectures.map((prefecture) => (
          // The label wraps the input so box + text form one hit target
          <label key={prefecture.prefCode} className="choice-label">
            <input
              type="checkbox"
              className="choice-input"
              checked={selectedPrefCodes.includes(prefecture.prefCode)}
              onChange={() => onToggle(prefecture.prefCode)}
            />
            {prefecture.prefName}
          </label>
        ))}
      </div>
    </fieldset>
  );
};
