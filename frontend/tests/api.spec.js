import { test, expect } from "@playwright/test";

const API_URL = "http://127.0.0.1:5001/api";

async function login(request, email, password) {
  const response = await request.post(`${API_URL}/login`, {
    data: { email, password },
  });

  const body = await response.json();

  return {
    response,
    body,
    token: body.access_token,
    user: body.user,
  };
}

test.describe("SecureBank API Tests", () => {
  test("health endpoint returns API status", async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  test("customer can login and receive JWT token", async ({ request }) => {
    const { response, body } = await login(
      request,
      "mahsa@test.com",
      "Password123"
    );

    expect(response.status()).toBe(200);
    expect(body.access_token).toBeTruthy();
    expect(body.user.email).toBe("mahsa@test.com");
    expect(body.user.role).toBe("customer");
  });

  test("invalid login is rejected", async ({ request }) => {
    const response = await request.post(`${API_URL}/login`, {
      data: {
        email: "mahsa@test.com",
        password: "WrongPassword",
      },
    });

    expect(response.status()).toBe(401);
  });

  test("protected account route rejects request without token", async ({ request }) => {
    const response = await request.get(`${API_URL}/accounts/1`);

    expect([401, 422]).toContain(response.status());
  });

  test("customer can access own account with token", async ({ request }) => {
    const { token, user } = await login(request, "mahsa@test.com", "Password123");

    const response = await request.get(`${API_URL}/accounts/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toBeTruthy();
  });

  test("customer cannot access admin users route", async ({ request }) => {
    const { token } = await login(request, "mahsa@test.com", "Password123");

    const response = await request.get(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(403);
  });

  test("admin can access users route", async ({ request }) => {
    const { token } = await login(request, "admin@test.com", "Admin123");

    const response = await request.get(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toBeTruthy();
  });

  test("transfer route rejects request without token", async ({ request }) => {
    const response = await request.post(`${API_URL}/transfer`, {
      data: {
        recipient_account_number: "10010002",
        amount: 50,
        description: "Unauthorized transfer test",
      },
    });

    expect([401, 422]).toContain(response.status());
  });

  test("customer cannot transfer more than available balance", async ({ request }) => {
    const { token } = await login(request, "mahsa@test.com", "Password123");

    const response = await request.post(`${API_URL}/transfer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        recipient_account_number: "10010002",
        amount: 999999,
        description: "Insufficient balance test",
      },
    });

    expect(response.status()).toBe(400);
  });

  test("admin can freeze and unfreeze a customer account", async ({ request }) => {
    const { token } = await login(request, "admin@test.com", "Admin123");

    const freezeResponse = await request.post(`${API_URL}/admin/freeze-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        user_id: 2,
      },
    });

    expect(freezeResponse.status()).toBe(200);

    const unfreezeResponse = await request.post(`${API_URL}/admin/unfreeze-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        user_id: 2,
      },
    });

    expect(unfreezeResponse.status()).toBe(200);
  });
});
