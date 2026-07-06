import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Unmount rendered components between tests (auto-cleanup only works
// when Vitest globals are enabled, which we keep off for explicit imports)
afterEach(() => cleanup());
