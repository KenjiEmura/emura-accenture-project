import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/shared/api";
import { API_PREFECTURES_PATH } from "@/shared/config";

import type { Prefecture } from "../model/prefecture";

// Fetches the 47-prefecture list through our proxy, once per session.
export const usePrefectures = () =>
  useQuery({
    queryKey: ["prefectures"],
    queryFn: () => fetchJson<Prefecture[]>(API_PREFECTURES_PATH),
  });
