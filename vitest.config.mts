import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Reuse the "@/*" alias from tsconfig.json
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Playwright owns the e2e directory
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
