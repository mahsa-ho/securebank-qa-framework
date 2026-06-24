import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("mahsa@test.com");
  const [password, setPassword] = useState("Password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(email, password);

      localStorage.setItem("securebank_user", JSON.stringify(data.user));
      if (typeof onLogin === "function") onLogin(data.user);

      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page center-page">
      <div className="card login-card">
        <h1>SecureBank Lite</h1>
        <p className="subtitle">Mock banking app for QA automation testing</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="Enter email"
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter password"
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="demo-box">
          <h3>Demo Users</h3>
          <p>
            <strong>Customer:</strong> mahsa@test.com / Password123
          </p>
          <p>
            <strong>Frozen User:</strong> frozen@test.com / Password123
          </p>
          <p>
            <strong>Admin:</strong> admin@test.com / Admin123
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;