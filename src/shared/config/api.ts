// The YUMEMI exam API (docs/api.md) — only reachable from the server proxy.
export const YUMEMI_API_BASE_URL =
  "https://frontend-engineer-codecheck-api.mirai.yumemi.io";
export const YUMEMI_PREFECTURES_PATH = "/api/v1/prefectures";
export const YUMEMI_POPULATION_PATH = "/api/v1/population/composition/perYear";

// Our own proxy routes, consumed by the browser.
export const API_PREFECTURES_PATH = "/api/prefectures";
export const API_POPULATION_PATH = "/api/population";
