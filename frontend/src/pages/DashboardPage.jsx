import { useEffect, useState } from "react";
import { getAccount, getTransactions } from "../api/api";

function DashboardPage({ user, currentUser }) {
  const loggedInUser =
    user ||
    currentUser ||
    JSON.parse(localStorage.getItem("securebank_user") || "null");

  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");
        setLoading(true);

        if (!loggedInUser?.id) {
          setError("User session not found. Please log in again.");
          return;
        }

        const accountData = await getAccount(loggedInUser.id);
        const accountInfo = accountData.account || accountData;

        setAccount(accountInfo);

        const transactionData = await getTransactions(accountInfo.id);
        setTransactions(transactionData.transactions || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [loggedInUser?.id]);

  function formatCurrency(amount) {
    return Number(amount || 0).toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    });
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Customer Dashboard</h1>
      <p>Welcome back, {loggedInUser?.name}</p>

      <div className="dashboard-grid">
        <div className="card">
          <h2>Account Balance</h2>
          <p>Account Number: {account?.account_number}</p>
          <p className="balance">{formatCurrency(account?.balance)}</p>
        </div>

        <div className="card">
          <h2>Recent Transactions</h2>

          {(transactions || []).length === 0 ? (
            <p>No recent transactions found.</p>
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
                {(transactions || []).slice(0, 5).map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.description}</td>
                    <td>{formatCurrency(transaction.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
