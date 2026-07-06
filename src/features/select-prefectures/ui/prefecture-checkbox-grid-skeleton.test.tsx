import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { PREFECTURE_COUNT } from "@/entities/prefecture";

import { PrefectureCheckboxGridSkeleton } from "./prefecture-checkbox-grid-skeleton";

test("announces loading to screen readers", () => {
  render(<PrefectureCheckboxGridSkeleton />);

  expect(screen.getByRole("status")).toHaveTextContent("都道府県を読み込み中");
});

test("reserves one placeholder row per prefecture so the layout stays put", () => {
  const { container } = render(<PrefectureCheckboxGridSkeleton />);

  expect(container.querySelectorAll('[data-slot="skeleton-row"]')).toHaveLength(
    PREFECTURE_COUNT,
  );
});

test("hides the decorative grid from assistive tech", () => {
  const { container } = render(<PrefectureCheckboxGridSkeleton />);

  expect(container.querySelector("fieldset")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});
