"use client";

import type { PrefCode } from "@/entities/prefecture";
import { usePrefectures } from "@/entities/prefecture";
import { PrefectureCheckboxGrid } from "@/features/select-prefectures";

type Props = Readonly<{
  selectedPrefCodes: PrefCode[];
  onToggle: (prefCode: PrefCode) => void;
}>;

// Loads the prefecture list and renders the checkbox grid.
// One early return per state: loading, error, then the happy path.
export const PrefectureSelection = ({ selectedPrefCodes, onToggle }: Props) => {
  const { data: prefectures, isPending, isError, refetch } = usePrefectures();

  if (isPending) {
    return <p>都道府県を読み込み中…</p>;
  }

  if (isError) {
    return (
      <p role="alert">
        都道府県の取得に失敗しました{" "}
        <button type="button" className="underline" onClick={() => refetch()}>
          再試行
        </button>
      </p>
    );
  }

  return (
    <PrefectureCheckboxGrid
      prefectures={prefectures}
      selectedPrefCodes={selectedPrefCodes}
      onToggle={onToggle}
    />
  );
};
