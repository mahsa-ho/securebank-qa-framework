const API_BASE_URL = "http://127.0.0.1:5001/api";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
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
  const response = await fetch(`${API_BASE_URL}/accounts/${userId}`);
  return handleResponse(response);
}

export async function getTransactions(accountId, search = "", type = "all") {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (type) {
    params.append("type", type);
  }

  const response = await fetch(`${API_BASE_URL}/transactions/${accountId}?${params}`);
  return handleResponse(response);
}

export async function transferMoney(userId, recipientAccountNumber, amount, description) {
  const response = await fetch(`${API_BASE_URL}/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      recipient_account_number: recipientAccountNumber,
      amount,
      description,
    }),
  });

  return handleResponse(response);
}

export async function getAdminUsers(adminUserId) {
  const response = await fetch(`${API_BASE_URL}/admin/users?admin_user_id=${adminUserId}`);
  return handleResponse(response);
}

export async function freezeUser(adminUserId, userId) {
  const response = await fetch(`${API_BASE_URL}/admin/freeze-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      admin_user_id: adminUserId,
      user_id: userId,
    }),
  });

  return handleResponse(response);
}

export async function unfreezeUser(adminUserId, userId) {
  const response = await fetch(`${API_BASE_URL}/admin/unfreeze-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      admin_user_id: adminUserId,
      user_id: userId,
    }),
  });

  return handleResponse(response);
}
