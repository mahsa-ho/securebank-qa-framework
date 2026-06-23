import { useEffect, useState } from "react";
import { freezeUser, getAdminUsers, unfreezeUser } from "../api/api";

function AdminPage({ user }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function formatMoney(value) {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(value);
  }

  async function loadUsers() {
    try {
      const data = await getAdminUsers(user.id);
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleFreeze(userId) {
    setMessage("");
    setError("");

    try {
      const data = await freezeUser(user.id, userId);
      setMessage(data.message);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUnfreeze(userId) {
    setMessage("");
    setError("");

    try {
      const data = await unfreezeUser(user.id, userId);
      setMessage(data.message);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage SecureBank users and account status.</p>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="card">
        <h2>All Users</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Account Number</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((bankUser) => (
              <tr key={bankUser.id}>
                <td>{bankUser.name}</td>
                <td>{bankUser.email}</td>
                <td>{bankUser.role}</td>
                <td>{bankUser.account_number}</td>
                <td>{formatMoney(bankUser.balance || 0)}</td>
                <td>{bankUser.is_frozen ? "Frozen" : "Active"}</td>
                <td>
                  {bankUser.role === "admin" ? (
                    <span>No action</span>
                  ) : bankUser.is_frozen ? (
                    <button
                      className="secondary-button"
                      onClick={() => handleUnfreeze(bankUser.id)}
                    >
                      Unfreeze
                    </button>
                  ) : (
                    <button
                      className="danger-button"
                      onClick={() => handleFreeze(bankUser.id)}
                    >
                      Freeze
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
