import { expect, test } from "@playwright/test";

test.describe("GenUI Lab vertical slice", () => {
  test("loads, runs markdown, switches to tool UI, and shows inspector data", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Instrumented UI architecture lab/i }),
    ).toBeVisible();
    await expect(page.getByText(/Analyze vehicle telemetry for VIN DEMO-001/i)).toBeVisible();

    await page.getByTestId("run-experiment").click();
    await expect(page.getByTestId("markdown-result")).toBeVisible();
    await expect(page.getByTestId("markdown-result")).toContainText("battery");

    await page.getByRole("tab", { name: "Domain result" }).click();
    await expect(page.getByTestId("inspector-domain")).toContainText("analysis:telemetry-demo-001");

    await page.getByRole("tab", { name: "Run" }).click();
    await expect(page.getByTestId("inspector-run")).toContainText("markdown");

    await page.getByRole("radio", { name: /Tool UI/i }).click();
    await page.getByTestId("run-experiment").click();
    await expect(page.getByTestId("tool-ui-result")).toBeVisible();
    await expect(page.getByTestId("tool-ui-alert")).toBeVisible();
    await expect(page.getByTestId("chart-summary")).toContainText(/Battery temperature/i);

    await page.getByRole("tab", { name: "Representation" }).click();
    await expect(page.getByTestId("inspector-representation")).toContainText("tool-ui");

    await page.getByRole("tab", { name: "Events" }).click();
    await expect(page.getByTestId("inspector-events")).toContainText("RUN_STARTED");
    await expect(page.getByTestId("inspector-events")).toContainText("DOMAIN_ANALYSIS_FINISHED");
  });
});
