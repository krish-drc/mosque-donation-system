import React from "react";
import { useNavigate } from "react-router-dom";

export default function AgentHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("agentData");
    navigate("/agent/login");
  };

  return (
    <nav className="w-full bg-indigo-700 text-white flex items-center justify-between px-6 py-4 shadow-md sticky top-0 z-50">
      {/* Brand / Title */}
      <div className="text-lg md:text-xl font-semibold tracking-wide flex items-center gap-2">
        💼 <span className="font-bold">Agent</span>
        <span className="text-indigo-200">Dashboard</span>
        <span className="hidden sm:inline text-sm text-indigo-200">
          | Mosque Donation
        </span>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-sm"
      >
        🚪 Logout
      </button>
    </nav>
  );
}
