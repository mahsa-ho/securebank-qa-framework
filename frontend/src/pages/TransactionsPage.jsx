import { useEffect, useState } from "react";
import { getAccount, getTransactions } from "../api/api";

function TransactionsPage({ user, currentUser }) {
  const loggedInUser =
    user ||
    currentUser ||
    JSON.parse(localStorage.getItem("securebank_user") || "null");

  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        setError("");
        setLoading(true);

        const accountData = await getAccount(loggedInUser.id);
        const accountInfo = accountData.account || accountData;

        const transactionData = await getTransactions(accountInfo.id);
        setTransactions(transactionData.transactions || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [loggedInUser?.id]);

  function formatCurrency(value) {
    return Number(value || 0).toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    });
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      transaction.description?.toLowerCase().includes(search) ||
      transaction.type?.toLowerCase().includes(search) ||
      transaction.date?.toLowerCase().includes(search) ||
      String(transaction.amount).includes(search);

    const matchesType =
      typeFilter === "All" || transaction.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="page">
      <h1>Transaction History</h1>
      <p>View and search your SecureBank account activity.</p>

      {error && <div className="error-message">{error}</div>}

      <div className="card">
        <div className="filter-form">
          <div>
            <label htmlFor="search">Search Transactions</label>
            <input
              id="search"
              placeholder="Search transactions"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="typeFilter">Type Filter</label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="All">All</option>
              <option value="Deposit">Deposit</option>
              <option value="Debit">Debit</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p>No matching transactions found.</p>
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
              {filteredTransactions.map((transaction) => (
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
  );
}

export default TransactionsPage;
