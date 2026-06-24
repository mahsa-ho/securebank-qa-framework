import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173/";

test.describe("SecureBank Login Tests", () => {
  test("customer can log in successfully", async ({ page }) => {
    await page.goto(BASE_URL);

    await page.locator("#email").fill("mahsa@test.com");
    await page.locator("#password").fill("Password123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByRole("heading", { name: "Customer Dashboard" })).toBeVisible();
    await expect(page.getByText("Welcome back, Mahsa Customer")).toBeVisible();
  });

  test("admin can log in successfully", async ({ page }) => {
    await page.goto(BASE_URL);

    await page.locator("#email").fill("admin@test.com");
    await page.locator("#password").fill("Admin123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible();
    await expect(page.getByText("Manage SecureBank users and account status.")).toBeVisible();
  });

  test("wrong password shows error message", async ({ page }) => {
    await page.goto(BASE_URL);

    await page.locator("#email").fill("mahsa@test.com");
    await page.locator("#password").fill("wrong");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Invalid email or password.")).toBeVisible();
  });

  test("empty email shows required error", async ({ page }) => {
    await page.goto(BASE_URL);

    await page.locator("#email").fill("");
    await page.locator("#password").fill("Password123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Email is required.")).toBeVisible();
  });

  test("empty password shows required error", async ({ page }) => {
    await page.goto(BASE_URL);

    await page.locator("#email").fill("mahsa@test.com");
    await page.locator("#password").fill("");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Password is required.")).toBeVisible();
  });
});