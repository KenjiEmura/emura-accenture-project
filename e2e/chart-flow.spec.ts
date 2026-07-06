import { expect, test } from "@playwright/test";

// E2E never hits the real YUMEMI API — our proxy routes are mocked.
const mockedPrefectures = [{ prefCode: 1, prefName: "北海道" }];

const mockedPopulationResult = {
  boundaryYear: 2020,
  data: [
    {
      label: "総人口",
      data: [
        { year: 1980, value: 5575989 },
        { year: 2000, value: 5683062 },
        { year: 2020, value: 5224614 },
        { year: 2045, value: 4004973 },
      ],
    },
    {
      label: "老年人口",
      data: [
        { year: 1980, value: 559943, rate: 10.0 },
        { year: 2000, value: 1031552, rate: 18.2 },
        { year: 2020, value: 1664023, rate: 31.8 },
        { year: 2045, value: 1729745, rate: 43.2 },
      ],
    },
  ],
};

test("checking a prefecture draws its line and the type switch redraws it", async ({
  page,
}) => {
  await page.route("**/api/prefectures", (route) =>
    route.fulfill({ json: mockedPrefectures }),
  );
  await page.route("**/api/population**", (route) =>
    route.fulfill({ json: mockedPopulationResult }),
  );

  await page.goto("/");

  // Checking a prefecture draws exactly one line
  await page.getByRole("checkbox", { name: "北海道" }).check();
  const chartLine = page.locator(".recharts-line-curve");
  await expect(chartLine).toHaveCount(1);
  const totalPopulationPath = await chartLine.getAttribute("d");

  // Switching the population type redraws the same line with new data
  await page.getByRole("radio", { name: "老年人口" }).check();
  await expect(chartLine).toHaveCount(1);
  await expect
    .poll(async () => chartLine.getAttribute("d"))
    .not.toBe(totalPopulationPath);

  // Unchecking returns to the empty state
  await page.getByRole("checkbox", { name: "北海道" }).uncheck();
  await expect(page.getByText("都道府県を選択してください")).toBeVisible();
});
