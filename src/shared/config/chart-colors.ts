// Line colors for the chart. A prefecture keeps its color for the whole
// session because it is picked by prefCode, not by selection order.
export const CHART_LINE_COLORS = [
  "var(--color-primary)", // the theme's blue, defined once in globals.css
  "#dc2626", // red
  "#16a34a", // green
  "#d97706", // amber
  "#9333ea", // purple
  "#0891b2", // cyan
  "#db2777", // pink
  "#65a30d", // lime
  "#7c3aed", // violet
  "#ea580c", // orange
] as const;

export const chartLineColorFor = (prefCode: number): string =>
  CHART_LINE_COLORS[(prefCode - 1) % CHART_LINE_COLORS.length];
