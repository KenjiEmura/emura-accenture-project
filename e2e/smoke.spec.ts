import { expect, test } from "@playwright/test";

test("the app boots and renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/都道府県別人口推移グラフ/);
  await expect(page.getByText("Hello world")).toBeVisible();
});
