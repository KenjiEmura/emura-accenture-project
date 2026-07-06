import { useState } from "react";

import type { PopulationType } from "@/entities/population";

// Holds the population series currently shown; the exam brief's default is 総人口.
export const usePopulationType = () => {
  const [populationType, setPopulationType] =
    useState<PopulationType>("総人口");

  return { populationType, setPopulationType };
};
