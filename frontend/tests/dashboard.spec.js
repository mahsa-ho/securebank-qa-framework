import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173/";

async function loginAsCustomer(page) {
  await page.goto(BASE_URL);
  await page.locator("#email").fill("mahsa@test.com");
  await page.locator("#password").fill("Password123");
  await page.getByRole("button", { name: "Login" }).click();
}

test.describe("SecureBank Dashboard Tests", () => {
  test("customer dashboard loads successfully", async ({ page }) => {
    await loginAsCustomer(page);

    await expect(page.getByRole("heading", { name: "Customer Dashboard" })).toBeVisible();
    await expect(page.getByText("Welcome back, Mahsa Customer")).toBeVisible();
  });

test("dashboard shows account balance and account number", async ({ page }) => {
  await loginAsCustomer(page);

  await expect(page.getByText("Account Balance")).toBeVisible();
  await expect(page.getByText("Account Number: 10010001")).toBeVisible();
  await expect(page.locator(".balance")).toBeVisible();
  await expect(page.locator(".balance")).toContainText("$");
});

  test("dashboard shows recent transactions section", async ({ page }) => {
    await loginAsCustomer(page);

    await expect(page.getByRole("heading", { name: "Recent Transactions" })).toBeVisible();
    await expect(page.getByText("Initial account deposit")).toBeVisible();
    await expect(page.getByText("Grocery purchase")).toBeVisible();
  });

  test("customer can navigate from dashboard to transfer page", async ({ page }) => {
    await loginAsCustomer(page);

    await page.getByRole("link", { name: "Transfer", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Transfer Money" })).toBeVisible();
  });

  test("customer can navigate from dashboard to transactions page", async ({ page }) => {
    await loginAsCustomer(page);

    await page.getByRole("link", { name: "Transactions", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Transaction History" })).toBeVisible();
  });
});
