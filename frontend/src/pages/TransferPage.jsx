import { useEffect, useState } from "react";
import { getAccount, transferMoney } from "../api/api";

function TransferPage({ user, currentUser }) {
  const loggedInUser =
    user ||
    currentUser ||
    JSON.parse(localStorage.getItem("securebank_user") || "null");

  const [account, setAccount] = useState(null);
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAccount() {
      try {
        setError("");

        if (!loggedInUser?.id) {
          setError("User session not found. Please log in again.");
          return;
        }

        const data = await getAccount(loggedInUser.id);
        setAccount(data.account || data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      }
    }

    loadAccount();
  }, [loggedInUser?.id]);

  function formatCurrency(value) {
    return Number(value || 0).toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);

      const data = await transferMoney({
        recipient_account_number: recipientAccountNumber,
        amount: amount,
        description: description,
      });

      setMessage(data.message || "Transfer completed successfully.");

      const updatedAccount = await getAccount(loggedInUser.id);
      setAccount(updatedAccount.account || updatedAccount);

      setRecipientAccountNumber("");
      setAmount("");
      setDescription("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Transfer Money</h1>
      <p>Send money to another SecureBank account.</p>

      <div className="card">
        <h2>Current Balance: {formatCurrency(account?.balance)}</h2>
        <p>Account Number: {account?.account_number}</p>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {loggedInUser?.status === "Frozen" ? (
          <div className="error-message">
            Account is frozen. Transfer not allowed.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="recipient">Recipient Account Number</label>
            <input
              id="recipient"
              value={recipientAccountNumber}
              placeholder="Example: 10010002"
              onChange={(event) =>
                setRecipientAccountNumber(event.target.value)
              }
            />

            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              value={amount}
              placeholder="Enter amount"
              onChange={(event) => setAmount(event.target.value)}
            />

            <label htmlFor="description">Description</label>
            <input
              id="description"
              value={description}
              placeholder="Enter description"
              onChange={(event) => setDescription(event.target.value)}
            />

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Transfer"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default TransferPage;
