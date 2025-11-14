import React, { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../agent/styles/AgentLogin.css";

export default function AgentLogin() {
  const [agentID, setAgentID] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const agentsRef = collection(db, "agents");

      const q = query(
        agentsRef,
        where("agentID", "==", agentID.trim()),
        where("secretCode", "==", secretCode.trim())
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const agentData = { id: docSnap.id, ...docSnap.data() };

        sessionStorage.setItem("agentData", JSON.stringify(agentData));
        navigate("/agent/agent-dashboard");
      } else {
        setError("Invalid Agent ID or Secret Code. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agent-login-container">
      <div className="agent-login-card">
        <h1>Agent Login</h1>

        {error && <p className="agent-login-error">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Agent ID"
            value={agentID}
            onChange={(e) => setAgentID(e.target.value)}
            className="agent-login-input"
            required
          />

          <div className="password-field">
            <input
              type={showSecret ? "text" : "password"}
              placeholder="Secret Code"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              className="agent-login-input"
              required
            />
            <span
              className="toggle-eye"
              onClick={() => setShowSecret(!showSecret)}
            >
              {showSecret ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="agent-login-button"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <div className="agent-login-footer">
          © {new Date().getFullYear()} Agent Portal. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}