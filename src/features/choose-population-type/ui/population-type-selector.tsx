"use client";

import { PopulationType } from "@/entities/population";

type Props = Readonly<{
  selectedType: PopulationType;
  onChange: (populationType: PopulationType) => void;
}>;

// Radio group for switching the displayed population series (one at a time).
export const PopulationTypeSelector = ({ selectedType, onChange }: Props) => {
  return (
    <fieldset className="card">
      <legend className="px-2 font-bold">表示する人口データ</legend>
      <div className="flex flex-wrap gap-x-4">
        {PopulationType.options.map((populationType) => (
          // The label wraps the input so button + text form one hit target
          <label key={populationType} className="choice-label">
            <input
              type="radio"
              name="population-type"
              className="choice-input"
              checked={populationType === selectedType}
              onChange={() => onChange(populationType)}
            />
            {populationType}
          </label>
        ))}
      </div>
    </fieldset>
  );
};
