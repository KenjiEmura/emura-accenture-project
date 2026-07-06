"use client";

import type { PrefCode, Prefecture } from "@/entities/prefecture";

import { PrefectureFieldset } from "./prefecture-fieldset";

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
}: Props) => (
  <PrefectureFieldset>
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
  </PrefectureFieldset>
);
