import { expect, test } from "vitest";

import { formatPopulation } from "./format-population";

test("formats populations in compact Japanese units", () => {
  expect(formatPopulation(5039206)).toBe("504万");
  expect(formatPopulation(9683802)).toBe("968万");
  expect(formatPopulation(128000000)).toBe("1.3億");
  expect(formatPopulation(500)).toBe("500");
});
