import { act, renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

import { useSelectedPrefCodes } from "./use-selected-pref-codes";

test("starts with no prefecture selected", () => {
  const { result } = renderHook(() => useSelectedPrefCodes());

  expect(result.current.selectedPrefCodes).toEqual([]);
});

test("toggling adds a prefecture, toggling again removes it", () => {
  const { result } = renderHook(() => useSelectedPrefCodes());

  act(() => result.current.togglePrefCode(13));
  expect(result.current.selectedPrefCodes).toEqual([13]);

  act(() => result.current.togglePrefCode(13));
  expect(result.current.selectedPrefCodes).toEqual([]);
});

test("keeps selection in the order prefectures were checked", () => {
  const { result } = renderHook(() => useSelectedPrefCodes());

  act(() => result.current.togglePrefCode(13));
  act(() => result.current.togglePrefCode(1));
  act(() => result.current.togglePrefCode(47));

  expect(result.current.selectedPrefCodes).toEqual([13, 1, 47]);
});
