import { useEffect, useState } from "react";
import { getAccount, transferMoney } from "../api/api";

function TransferPage({ user }) {
  const [account, setAccount] = useState(null);
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("10010002");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("Test transfer");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function formatMoney(value) {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(value);
  }

  async function loadAccount() {
    try {
      const data = await getAccount(user.id);
      setAccount(data.account);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadAccount();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!recipientAccountNumber.trim()) {
      setError("Recipient account number is required.");
      return;
    }

    if (amount === "") {
      setError("Amount is required.");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (account?.is_frozen) {
      setError("Account is frozen. Transfer not allowed.");
      return;
    }

    try {
      setLoading(true);

      const data = await transferMoney(
        user.id,
        recipientAccountNumber,
        amount,
        description
      );

      setSuccess(data.message);
      setAmount("");
      await loadAccount();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!account) {
    return <div className="page">Loading transfer page...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Transfer Money</h1>
        <p>Send money to another SecureBank account.</p>
      </div>

      <div className="card">
        <h2>Current Balance: {formatMoney(account.balance)}</h2>
        <p>Account Number: {account.account_number}</p>

        {account.is_frozen && (
          <div className="warning-message">
            Account is frozen. Transfer not allowed.
          </div>
        )}

        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Recipient Account Number</label>
          <input
            type="text"
            value={recipientAccountNumber}
            onChange={(event) => setRecipientAccountNumber(event.target.value)}
            placeholder="Example: 10010002"
          />

          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter amount"
          />

          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Enter description"
          />

          <button
            type="submit"
            className="primary-button"
            disabled={loading || account.is_frozen}
          >
            {loading ? "Processing..." : "Submit Transfer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TransferPage;
