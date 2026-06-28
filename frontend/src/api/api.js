const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api";

function getAuthHeaders() {
  const token = localStorage.getItem("securebank_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
}

export async function getAccount(userId) {
  const response = await fetch(`${API_BASE_URL}/accounts/${userId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function getTransactions(accountId) {
  const response = await fetch(`${API_BASE_URL}/transactions/${accountId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function transferMoney(transferData) {
  const response = await fetch(`${API_BASE_URL}/transfer`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(transferData),
  });

  return handleResponse(response);
}

export async function getAdminUsers() {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function freezeUser(userId) {
  const response = await fetch(`${API_BASE_URL}/admin/freeze-user`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId }),
  });

  return handleResponse(response);
}

export async function unfreezeUser(userId) {
  const response = await fetch(`${API_BASE_URL}/admin/unfreeze-user`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId }),
  });

  return handleResponse(response);
}
