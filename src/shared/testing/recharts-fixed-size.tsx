import type { ComponentProps } from "react";
import { vi } from "vitest";

// jsdom has no layout, so recharts' ResponsiveContainer measures 0×0 and
// renders nothing. Tests that need a chart to actually draw replace it with
// a fixed-size version:
//
//   vi.mock("recharts", async () => {
//     const { rechartsWithFixedSizeContainer } = await import("@/shared/testing");
//     return rechartsWithFixedSizeContainer();
//   });
export const rechartsWithFixedSizeContainer = async () => {
  const recharts = await vi.importActual<typeof import("recharts")>("recharts");

  const FixedSizeContainer = (
    props: ComponentProps<typeof recharts.ResponsiveContainer>,
  ) => <recharts.ResponsiveContainer {...props} width={800} height={400} />;

  return { ...recharts, ResponsiveContainer: FixedSizeContainer };
};
