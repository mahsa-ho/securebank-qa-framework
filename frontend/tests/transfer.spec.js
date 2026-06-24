import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173/";

async function loginAsCustomer(page) {
  await page.goto(BASE_URL);
  await page.locator("#email").fill("mahsa@test.com");
  await page.locator("#password").fill("Password123");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading", { name: "Customer Dashboard" })).toBeVisible();
}

async function loginAsFrozenUser(page) {
  await page.goto(BASE_URL);
  await page.locator("#email").fill("frozen@test.com");
  await page.locator("#password").fill("Password123");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading", { name: "Customer Dashboard" })).toBeVisible();
}

async function goToTransferPage(page) {
  await page.getByRole("link", { name: "Transfer", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Transfer Money" })).toBeVisible();
}

test.describe("SecureBank Transfer Tests", () => {
  test("customer can transfer money successfully", async ({ page }) => {
    await loginAsCustomer(page);
    await goToTransferPage(page);

    await page.getByPlaceholder("Example: 10010002").fill("10010002");
    await page.getByPlaceholder("Enter amount").fill("100");
    await page.getByPlaceholder("Enter description").fill("Automation test transfer");

    await page.getByRole("button", { name: "Submit Transfer" }).click();

    await expect(page.getByText("Transfer completed successfully.")).toBeVisible();
    await expect(page.getByText("Current Balance:")).toBeVisible();
  });

  test("customer cannot transfer more than available balance", async ({ page }) => {
    await loginAsCustomer(page);
    await goToTransferPage(page);

    await page.getByPlaceholder("Example: 10010002").fill("10010002");
    await page.getByPlaceholder("Enter amount").fill("999999");
    await page.getByRole("button", { name: "Submit Transfer" }).click();

    await expect(page.getByText("Insufficient balance.")).toBeVisible();
  });

  test("customer cannot transfer zero amount", async ({ page }) => {
    await loginAsCustomer(page);
    await goToTransferPage(page);

    await page.getByPlaceholder("Example: 10010002").fill("10010002");
    await page.getByPlaceholder("Enter amount").fill("0");
    await page.getByRole("button", { name: "Submit Transfer" }).click();

    await expect(page.getByText("Amount must be greater than 0.")).toBeVisible();
  });

  test("customer cannot transfer negative amount", async ({ page }) => {
    await loginAsCustomer(page);
    await goToTransferPage(page);

    await page.getByPlaceholder("Example: 10010002").fill("10010002");
    await page.getByPlaceholder("Enter amount").fill("-5");
    await page.getByRole("button", { name: "Submit Transfer" }).click();

    await expect(page.getByText("Amount must be greater than 0.")).toBeVisible();
  });

  test("customer cannot transfer to invalid recipient account", async ({ page }) => {
    await loginAsCustomer(page);
    await goToTransferPage(page);

    await page.getByPlaceholder("Example: 10010002").fill("99999999");
    await page.getByPlaceholder("Enter amount").fill("50");
    await page.getByRole("button", { name: "Submit Transfer" }).click();

    await expect(page.getByText("Recipient account not found.")).toBeVisible();
  });

  test("customer cannot transfer to own account", async ({ page }) => {
    await loginAsCustomer(page);
    await goToTransferPage(page);

    await page.getByPlaceholder("Example: 10010002").fill("10010001");
    await page.getByPlaceholder("Enter amount").fill("50");
    await page.getByRole("button", { name: "Submit Transfer" }).click();

    await expect(page.getByText("You cannot transfer money to your own account.")).toBeVisible();
  });

  test("frozen user cannot submit transfer", async ({ page }) => {
    await loginAsFrozenUser(page);
    await goToTransferPage(page);

    await expect(page.getByText("Account is frozen. Transfer not allowed.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Submit Transfer" })).toBeDisabled();
  });
});
