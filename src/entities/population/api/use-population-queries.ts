import { useQueries } from "@tanstack/react-query";

import type { PrefCode } from "@/entities/prefecture";
import { fetchJson } from "@/shared/api";
import { API_POPULATION_PATH } from "@/shared/config";

import type { PopulationResult } from "../model/population";

// One query per selected prefecture, cached by prefCode — unchecking and
// rechecking a prefecture never refetches, and each query carries its own
// loading/error state so one failure never blanks the others.
export const usePopulationQueries = (prefCodes: PrefCode[]) =>
  useQueries({
    queries: prefCodes.map((prefCode) => ({
      queryKey: ["population", prefCode],
      queryFn: () =>
        fetchJson<PopulationResult>(
          `${API_POPULATION_PATH}?prefCode=${prefCode}`,
        ),
    })),
  });
