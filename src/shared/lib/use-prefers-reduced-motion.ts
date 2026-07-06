import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeToMotionPreference = (onChange: () => void) => {
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", onChange);
  return () => mediaQueryList.removeEventListener("change", onChange);
};

// True when the OS asks for reduced motion — used to disable chart animation.
// Server snapshot is false; the client corrects it right after hydration.
export const usePrefersReducedMotion = () =>
  useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
