import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173/";

async function loginAsCustomer(page) {
  await page.goto(BASE_URL);
  await page.locator("#email").fill("mahsa@test.com");
  await page.locator("#password").fill("Password123");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading", { name: "Customer Dashboard" })).toBeVisible();
}

async function goToTransactionsPage(page) {
  await loginAsCustomer(page);
  await page.getByRole("link", { name: "Transactions" }).click();
  await expect(page.getByRole("heading", { name: "Transaction History" })).toBeVisible();
}

test.describe("SecureBank Transactions Tests", () => {
  test("transactions page loads successfully", async ({ page }) => {
    await goToTransactionsPage(page);
  });

  test("transaction table displays transaction data", async ({ page }) => {
    await goToTransactionsPage(page);

    await expect(page.getByText("Grocery purchase")).toBeVisible();
    await expect(page.getByText("Initial account deposit")).toBeVisible();
  });

  test("customer can search for an existing transaction", async ({ page }) => {
    await goToTransactionsPage(page);

    await page.locator("#search").fill("Grocery");

    await expect(page.getByText("Grocery purchase")).toBeVisible();
  });

  test("customer sees no results message for unmatched search", async ({ page }) => {
    await goToTransactionsPage(page);

    await page.locator("#search").fill("randomtext123");

    await expect(page.getByText("No matching transactions found.")).toBeVisible();
  });

  test("customer can filter transactions by transfer type", async ({ page }) => {
    await goToTransactionsPage(page);

    await page.locator("#typeFilter").selectOption("Transfer");

    await expect(page.locator("#typeFilter")).toHaveValue("Transfer");
  });
});
