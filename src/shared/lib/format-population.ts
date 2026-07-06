// Compact Japanese population format for axis ticks and tooltips:
// 5039206 -> "504万", 128000000 -> "1.3億"
const compactJapaneseNumber = new Intl.NumberFormat("ja-JP", {
  notation: "compact",
});

export const formatPopulation = (population: number): string =>
  compactJapaneseNumber.format(population);
