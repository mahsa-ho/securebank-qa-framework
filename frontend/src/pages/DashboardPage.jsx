import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccount } from "../api/api";

function DashboardPage({ user }) {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");

  function formatMoney(amount) {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  }

  useEffect(() => {
    async function loadAccount() {
      try {
        const data = await getAccount(user.id);
        setAccount(data.account);
      } catch (err) {
        setError(err.message);
      }
    }

    loadAccount();
  }, [user.id]);

  if (error) {
    return <div className="page"><div className="error-message">{error}</div></div>;
  }

  if (!account) {
    return <div className="page">Loading dashboard...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Customer Dashboard</h1>
        <p>Welcome back, {account.name}</p>
      </div>

      {account.is_frozen && (
        <div className="warning-message">
          This account is frozen. Transfers are not allowed.
        </div>
      )}

      <div className="dashboard-grid">
        <div className="card">
          <h2>Account Balance</h2>
          <p className="balance">{formatMoney(account.balance)}</p>
          <p>Account Number: {account.account_number}</p>
        </div>

        <div className="card">
          <h2>Quick Actions</h2>
          <div className="button-row">
            <Link to="/transfer" className="primary-link">Transfer Money</Link>
            <Link to="/transactions" className="secondary-link">View Transactions</Link>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Transactions</h2>

        {account.recent_transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {account.recent_transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.description}</td>
                  <td>{formatMoney(transaction.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
