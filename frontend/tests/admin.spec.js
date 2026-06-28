import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173/";
const API_URL = "http://127.0.0.1:5001/api";

async function getAdminToken(request) {
  const response = await request.post(`${API_URL}/login`, {
    data: {
      email: "admin@test.com",
      password: "Admin123",
    },
  });

  const data = await response.json();
  return data.access_token;
}

async function resetAdminTestData(request) {
  const token = await getAdminToken(request);

  await request.post(`${API_URL}/admin/unfreeze-user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      user_id: 2,
    },
  });

  await request.post(`${API_URL}/admin/freeze-user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      user_id: 3,
    },
  });
}

async function loginAsAdmin(page) {
  await page.goto(BASE_URL);
  await page.locator("#email").fill("admin@test.com");
  await page.locator("#password").fill("Admin123");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible();
}

async function loginAsCustomer(page) {
  await page.goto(BASE_URL);
  await page.locator("#email").fill("mahsa@test.com");
  await page.locator("#password").fill("Password123");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading", { name: "Customer Dashboard" })).toBeVisible();
}

test.describe("SecureBank Admin Tests", () => {
  test.beforeEach(async ({ request }) => {
    await resetAdminTestData(request);
  });

  test("admin dashboard loads successfully", async ({ page }) => {
    await loginAsAdmin(page);

    await expect(page.getByText("Manage SecureBank users and account status.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "All Users" })).toBeVisible();
  });

  test("admin can view customer demo users", async ({ page }) => {
    await loginAsAdmin(page);

    await expect(page.getByText("Mahsa Customer")).toBeVisible();
    await expect(page.getByText("Amir Customer")).toBeVisible();
    await expect(page.getByText("Frozen User")).toBeVisible();
  });

  test("admin can freeze an active customer account", async ({ page }) => {
    await loginAsAdmin(page);

    const amirRow = page.getByRole("row", { name: /Amir Customer/ });

    await expect(amirRow).toContainText("Active");
    await amirRow.getByRole("button", { name: "Freeze" }).click();

    await expect(page.getByText("User account frozen successfully.")).toBeVisible();
    await expect(amirRow).toContainText("Frozen");
  });

  test("admin can unfreeze a frozen customer account", async ({ page }) => {
    await loginAsAdmin(page);

    const frozenUserRow = page.getByRole("row", { name: /Frozen User/ });

    await expect(frozenUserRow).toContainText("Frozen");
    await frozenUserRow.getByRole("button", { name: "Unfreeze" }).click();

    await expect(page.getByText("User account unfrozen successfully.")).toBeVisible();
    await expect(frozenUserRow).toContainText("Active");
  });

  test("customer cannot access admin page directly", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("http://localhost:5173/admin");

    await expect(page.getByRole("heading", { name: "Customer Dashboard" })).toBeVisible();
    await expect(page).toHaveURL(/dashboard/);
  });
});
