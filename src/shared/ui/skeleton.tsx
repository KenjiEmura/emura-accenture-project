import type { ComponentProps } from "react";

type Props = Readonly<ComponentProps<"div">>;

// Pulsing gray placeholder that reserves space while real content loads.
// The pulse stops when the OS asks for reduced motion.
export const Skeleton = ({ className = "", ...props }: Props) => (
  <div
    data-slot="skeleton"
    className={`animate-pulse rounded-md bg-gray-200 motion-reduce:animate-none ${className}`}
    {...props}
  />
);
