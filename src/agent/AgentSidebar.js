import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AgentSidebar() {
  const [openMenu, setOpenMenu] = useState("");
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("agentData");
    navigate("/agent/login");
  };

  return (
    <div className="h-screen w-64 bg-indigo-700 from-indigo-800 to-indigo-900 text-white flex flex-col shadow-2xl fixed top-0 left-0 border-r border-indigo-700 font-sans select-none">
      {/* Header */}
      <div className="p-6 border-b border-indigo-700 flex items-center justify-center">
        <h3 className="text-2xl font-semibold tracking-wide flex items-center gap-2">
          💼 <span>Agent Panel</span>
        </h3>
      </div>

      {/* Menu List */}
      <ul className="flex-1 overflow-y-auto mt-6 space-y-2 px-4">
        {/* Dashboard */}
        <li>
          <Link
            to="/agent/agent-dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-700 hover:translate-x-1 transition-all duration-200 text-base font-medium text-white no-underline"
          >
            📊 <span>Dashboard</span>
          </Link>
        </li>

        {/* My Members */}
        <li>
          <button
            onClick={() => toggleMenu("members")}
            className="w-full flex justify-between items-center px-4 py-2 rounded-lg hover:bg-indigo-700 hover:translate-x-1 transition-all duration-200 text-base font-medium text-white no-underline"
          >
            <span className="flex items-center gap-3">🙋 My Members</span>
            <span className="text-xs">{openMenu === "members" ? "▲" : "▼"}</span>
          </button>
          {openMenu === "members" && (
            <ul className="ml-8 mt-1 space-y-1">
              <li>
                <Link
                  to="/agent/add-member"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-all duration-200 text-sm font-normal text-white no-underline"
                >
                  ➕ <span>Add Member</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/agent/my-members"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-all duration-200 text-sm font-normal text-white no-underline"
                >
                  🧾 <span>View Members</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Fund Management */}
        <li>
          <button
            onClick={() => toggleMenu("collections")}
            className="w-full flex justify-between items-center px-4 py-2 rounded-lg hover:bg-indigo-700 hover:translate-x-1 transition-all duration-200 text-base font-medium text-white no-underline whitespace-nowrap"
          >
            <span className="flex items-center gap-3 whitespace-nowrap">
              💰 Fund Management
            </span>
            <span className="text-xs">{openMenu === "collections" ? "▲" : "▼"}</span>
          </button>
          {openMenu === "collections" && (
            <ul className="ml-8 mt-1 space-y-1">
              <li>
                <Link
                  to="/agent/AgentViewFunds"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-all duration-200 text-sm font-normal text-white no-underline"
                >
                  💵 <span>View Funds</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/agent/AgentPendingCollection"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-all duration-200 text-sm font-normal text-white no-underline"
                >
                  🕒 <span>Pending Collections</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/agent/AgentPaymentHistory"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-all duration-200 text-sm font-normal text-white no-underline"
                >
                  📑 <span>Payment History</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/agent/AgentFundManager"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-all duration-200 text-sm font-normal text-white no-underline"
                >
                  🔍 <span>Fund Tracking</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Profile */}
        <li>
          <Link
            to="/agent/profile"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-700 hover:translate-x-1 transition-all duration-200 text-base font-medium text-white no-underline"
          >
            👤 <span>My Profile</span>
          </Link>
        </li>
      </ul>

      {/* Footer */}
      <div className="p-4 border-t border-indigo-700 text-center text-xs text-indigo-200">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-all duration-200 font-semibold shadow-md"
        >
          🚪 Logout
        </button>
        <p className="mt-3 text-indigo-300 tracking-wide">
          © {new Date().getFullYear()} Agent Panel
        </p>
      </div>
    </div>
  );
}
