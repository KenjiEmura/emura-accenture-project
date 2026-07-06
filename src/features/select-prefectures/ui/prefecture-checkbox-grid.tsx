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
    <fieldset>
      <legend className="mb-2 font-bold">都道府県</legend>
      <div className="grid grid-cols-2 gap-x-2 sm:grid-cols-4 md:grid-cols-6">
        {prefectures.map((prefecture) => (
          // The label wraps the input so box + text form one hit target
          <label
            key={prefecture.prefCode}
            className="flex cursor-pointer items-center gap-2 py-2"
          >
            <input
              type="checkbox"
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
