import { useState } from "react";

import type { PrefCode } from "@/entities/prefecture";

// Holds which prefectures are checked; toggling flips one code in and out.
export const useSelectedPrefCodes = () => {
  const [selectedPrefCodes, setSelectedPrefCodes] = useState<PrefCode[]>([]);

  const togglePrefCode = (prefCode: PrefCode) => {
    setSelectedPrefCodes((currentCodes) =>
      currentCodes.includes(prefCode)
        ? currentCodes.filter((code) => code !== prefCode)
        : [...currentCodes, prefCode],
    );
  };

  return { selectedPrefCodes, togglePrefCode };
};
