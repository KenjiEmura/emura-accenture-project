import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Unmount rendered components between tests (auto-cleanup only works
// when Vitest globals are enabled, which we keep off for explicit imports)
afterEach(() => cleanup());

// jsdom does not implement window.matchMedia — minimal stub so hooks that
// read media queries (e.g. prefers-reduced-motion) can run in tests
if (typeof window !== "undefined" && window.matchMedia === undefined) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}
