import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TransferPage from "./pages/TransferPage";
import TransactionsPage from "./pages/TransactionsPage";
import AdminPage from "./pages/AdminPage";
import "./styles.css";

function getStoredUser() {
  const savedUser = localStorage.getItem("securebank_user");

  if (!savedUser) {
    return null;
  }

  return JSON.parse(savedUser);
}

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AdminRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function CustomerRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "customer") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(getStoredUser());

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={() => setUser(null)} />

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              user.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <LoginPage onLogin={setUser} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <CustomerRoute user={user}>
              <DashboardPage user={user} />
            </CustomerRoute>
          }
        />

        <Route
          path="/transfer"
          element={
            <CustomerRoute user={user}>
              <TransferPage user={user} />
            </CustomerRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <CustomerRoute user={user}>
              <TransactionsPage user={user} />
            </CustomerRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute user={user}>
              <AdminPage user={user} />
            </AdminRoute>
          }
        />

        <Route
          path="*"
          element={
            <ProtectedRoute user={user}>
              <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} replace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
