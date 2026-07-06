import { PrefecturesResponse } from "@/entities/prefecture";
import { YUMEMI_PREFECTURES_PATH } from "@/shared/config";

import { proxyYumemiApiRequest } from "./yumemi-api";

// GET /api/prefectures — proxies the YUMEMI API prefecture list.
export const GET = async () =>
  proxyYumemiApiRequest(
    YUMEMI_PREFECTURES_PATH,
    PrefecturesResponse,
    "prefectures",
  );
