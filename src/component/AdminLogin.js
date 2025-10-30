import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is Admin
      if (user.email === "dharshidd339@gmail.com") {
        navigate("/admin/dashboard");
      } else {
        setError("You are not authorized as Admin.");
      }
    } catch (err) {
      // Handle Firebase auth errors more clearly
      switch (err.code) {
        case "auth/user-not-found":
          setError("User not found. Please check your email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/too-many-requests":
          setError("Too many login attempts. Please try again later.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        default:
          setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
  <div className="admin-login-card">
    <h1>Admin Login</h1>

    {error && <p className="admin-login-error">{error}</p>}

    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="admin-login-input"
      />
      <input
        type="password"
        placeholder="Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="admin-login-input"
      />
      <button type="submit" className="admin-login-button" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>

    <div className="admin-login-footer">
      © {new Date().getFullYear()} Admin Portal. All Rights Reserved.
    </div>
  </div>
</div>

  );
}
