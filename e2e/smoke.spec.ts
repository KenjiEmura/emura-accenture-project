import { expect, test } from "@playwright/test";

// E2E never hits the real YUMEMI API — our proxy routes are mocked.
const mockedPrefectures = [
  { prefCode: 1, prefName: "北海道" },
  { prefCode: 13, prefName: "東京都" },
];

test("the app boots and renders the prefecture checkboxes", async ({
  page,
}) => {
  await page.route("**/api/prefectures", (route) =>
    route.fulfill({ json: mockedPrefectures }),
  );

  await page.goto("/");

  await expect(page).toHaveTitle(/都道府県別人口推移グラフ/);
  await expect(page.getByRole("checkbox", { name: "東京都" })).toBeVisible();
  await expect(page.getByText("都道府県を選択してください")).toBeVisible();
});
