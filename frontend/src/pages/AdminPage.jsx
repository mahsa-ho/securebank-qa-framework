import { useEffect, useState } from "react";
import { getAdminUsers, freezeUser, unfreezeUser } from "../api/api";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      setError("");
      setLoading(true);

      const data = await getAdminUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleFreeze(userId) {
    try {
      setMessage("");
      setError("");

      const data = await freezeUser(userId);
      setMessage(data.message || "User account frozen successfully.");

      await loadUsers();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  async function handleUnfreeze(userId) {
    try {
      setMessage("");
      setError("");

      const data = await unfreezeUser(userId);
      setMessage(data.message || "User account unfrozen successfully.");

      await loadUsers();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  function formatCurrency(value) {
    return Number(value || 0).toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    });
  }

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <p>Manage SecureBank users and account status.</p>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="card">
        <h2>All Users</h2>

        {loading ? (
          <p>Loading users...</p>
        ) : (
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
              {(users || []).map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.account_number}</td>
                  <td>{formatCurrency(user.balance)}</td>
                  <td>{user.status}</td>
                  <td>
                    {user.status === "Frozen" ? (
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => handleUnfreeze(user.id)}
                      >
                        Unfreeze
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleFreeze(user.id)}
                      >
                        Freeze
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
