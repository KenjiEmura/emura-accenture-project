import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { PrefectureCheckboxGrid } from "./prefecture-checkbox-grid";

const prefectures = [
  { prefCode: 1, prefName: "北海道" },
  { prefCode: 2, prefName: "青森県" },
  { prefCode: 13, prefName: "東京都" },
];

test("renders one labeled checkbox per prefecture", () => {
  render(
    <PrefectureCheckboxGrid
      prefectures={prefectures}
      selectedPrefCodes={[]}
      onToggle={vi.fn()}
    />,
  );

  expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  expect(screen.getByRole("checkbox", { name: "東京都" })).toBeInTheDocument();
});

test("checks exactly the selected prefectures", () => {
  render(
    <PrefectureCheckboxGrid
      prefectures={prefectures}
      selectedPrefCodes={[2]}
      onToggle={vi.fn()}
    />,
  );

  expect(screen.getByRole("checkbox", { name: "青森県" })).toBeChecked();
  expect(screen.getByRole("checkbox", { name: "北海道" })).not.toBeChecked();
});

test("clicking a prefecture name reports its prefCode", async () => {
  const user = userEvent.setup();
  const onToggle = vi.fn();
  render(
    <PrefectureCheckboxGrid
      prefectures={prefectures}
      selectedPrefCodes={[]}
      onToggle={onToggle}
    />,
  );

  // Clicking the visible text must work — the label is the hit target
  await user.click(screen.getByText("東京都"));

  expect(onToggle).toHaveBeenCalledExactlyOnceWith(13);
});
