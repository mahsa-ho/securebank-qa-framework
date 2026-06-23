import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("securebank_user");
    onLogout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">SecureBank Lite</div>

      {user && (
        <div className="navbar-links">
          {user.role === "customer" && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/transfer">Transfer</Link>
              <Link to="/transactions">Transactions</Link>
            </>
          )}

          {user.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}

          <span className="navbar-user">{user.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
