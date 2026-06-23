import { useEffect, useState } from "react";
import { getAccount, getTransactions } from "../api/api";

function TransactionsPage({ user }) {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [error, setError] = useState("");

  function formatMoney(value) {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(value);
  }

  async function loadTransactions(accountId, searchValue = search, typeValue = type) {
    try {
      const data = await getTransactions(accountId, searchValue, typeValue);
      setTransactions(data.transactions);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    async function loadPage() {
      try {
        const accountData = await getAccount(user.id);
        setAccount(accountData.account);
        await loadTransactions(accountData.account.id);
      } catch (err) {
        setError(err.message);
      }
    }

    loadPage();
  }, [user.id]);

  function handleFilter(event) {
    event.preventDefault();

    if (account) {
      loadTransactions(account.id, search, type);
    }
  }

  if (error) {
    return <div className="page"><div className="error-message">{error}</div></div>;
  }

  if (!account) {
    return <div className="page">Loading transactions...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Transaction History</h1>
        <p>Search and filter account activity.</p>
      </div>

      <div className="card">
        <form onSubmit={handleFilter} className="filter-form">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search transactions..."
          />

          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="all">All</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdrawal">Withdrawal</option>
            <option value="Transfer">Transfer</option>
          </select>

          <button type="submit" className="primary-button">
            Apply Filter
          </button>
        </form>

        {transactions.length === 0 ? (
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
              {transactions.map((transaction) => (
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

export default TransactionsPage;
