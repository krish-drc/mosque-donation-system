import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/Header.css";

export default function Header() {
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/"; // redirect to login
  };

  return (
    <nav className="header">
      {/* Brand */}
      <div className="header-brand">
        🕌 Mosque <span>Donation</span>
        <span>| Admin Dashboard</span>
      </div>

      {/* Logout Button */}
      <button className="header-logout" onClick={handleLogout}>
        🚪 Logout
      </button>
    </nav>
  );
}
