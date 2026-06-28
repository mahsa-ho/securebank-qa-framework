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
}

async function goToTransferPage(page) {
  await loginAsCustomer(page);
  await page.getByRole("link", { name: "Transfer" }).click();
  await expect(page.getByRole("heading", { name: "Transfer Money" })).toBeVisible();
}

test.describe("SecureBank Transfer Tests", () => {
  test("customer can complete a valid transfer", async ({ page }) => {
    await goToTransferPage(page);

    await page.getByLabel("Recipient Account Number").fill("10010002");
    await page.getByLabel("Amount").fill("20");
    await page.getByLabel("Description").fill("Playwright transfer test");
    await page.getByRole("button", { name: "Submit Transfer" }).click();

    await expect(page.getByText("Transfer completed successfully.")).toBeVisible();
  });

  test("customer cannot transfer more than current balance", async ({ page }) => {
    await goToTransferPage(page);

    await page.getByLabel("Recipient Account Number").fill("10010002");
    await page.getByLabel("Amount").fill("999999");
    await page.getByLabel("Description").fill("Too much money");
    await page.getByRole("button", { name: "Submit Transfer" }).click();

    await expect(page.getByText("Insufficient balance.")).toBeVisible();
  });

  test("customer cannot transfer zero amount", async ({ page }) => {
    await goToTransferPage(page);

    await page.getByLabel("Recipient Account Number").fill("10010002");
    await page.getByLabel("Amount").fill("0");
    await page.getByLabel("Description").fill("Zero amount");
    await page.getByRole("button", { name: "Submit Transfer" }).click();

    await expect(page.getByText("Amount must be greater than 0.")).toBeVisible();
  });

  test("customer cannot transfer negative amount", async ({ page }) => {
    await goToTransferPage(page);

    await page.getByLabel("Recipient Account Number").fill("10010002");
    await page.getByLabel("Amount").fill("-10");
    await page.getByLabel("Description").fill("Negative amount");
    await page.getByRole("button", { name: "Submit Transfer" }).click();

    await expect(page.getByText("Amount must be greater than 0.")).toBeVisible();
  });

  test("customer cannot transfer to invalid recipient", async ({ page }) => {
    await goToTransferPage(page);

    await page.getByLabel("Recipient Account Number").fill("99999999");
    await page.getByLabel("Amount").fill("50");
    await page.getByLabel("Description").fill("Invalid recipient");
    await page.getByRole("button", { name: "Submit Transfer" }).click();

    await expect(page.getByText("Recipient account not found.")).toBeVisible();
  });

  test("customer cannot transfer to own account", async ({ page }) => {
    await goToTransferPage(page);

    await page.getByLabel("Recipient Account Number").fill("10010001");
    await page.getByLabel("Amount").fill("50");
    await page.getByLabel("Description").fill("Own account");
    await page.getByRole("button", { name: "Submit Transfer" }).click();

    await expect(page.getByText("You cannot transfer money to your own account.")).toBeVisible();
  });

  test("frozen user cannot submit transfer", async ({ page }) => {
    await loginAsFrozenUser(page);

    await page.getByRole("link", { name: "Transfer" }).click();

    await expect(
      page.getByText("Account is frozen. Transfer not allowed.")
    ).toBeVisible();
  });
});
