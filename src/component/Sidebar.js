import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState("");

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  return (
    <div className="h-screen w-64 bg-indigo-700 text-white flex flex-col shadow-lg fixed top-0 left-0">
      {/* Header */}
      <div className="p-5 border-b border-indigo-500">
        <h3 className="text-xl font-bold flex items-center gap-2">
          🕌 <span>Mosque Admin Panel</span>
        </h3>
      </div>

      {/* Menu List */}
      <ul className="flex-1 overflow-y-auto mt-4 space-y-1 px-2">
        {/* Dashboard */}
        <li>
          <Link
            to="/admin/dashboard"
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            📊 Dashboard & Reports
          </Link>
        </li>

        {/* Members */}
        <li>
          <button
            onClick={() => toggleMenu("members")}
            className="w-full flex justify-between items-center px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <span>🙋 Members</span>
            <span className="text-sm">{openMenu === "members" ? "▲" : "▼"}</span>
          </button>
          {openMenu === "members" && (
            <ul className="ml-6 mt-1 space-y-1">
              <li>
                <Link
                  to="/add-member"
                  className="block px-3 py-1 rounded-md hover:bg-indigo-500 text-sm"
                >
                  ➕ Add Member
                </Link>
              </li>
              <li>
                <Link
                  to="/manage-members"
                  className="block px-3 py-1 rounded-md hover:bg-indigo-500 text-sm"
                >
                  🧾 Manage Members
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Collecting Agents */}
        <li>
          <button
            onClick={() => toggleMenu("agents")}
            className="w-full flex justify-between items-center px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <span>💼 Collecting Agents</span>
            <span className="text-sm">{openMenu === "agents" ? "▲" : "▼"}</span>
          </button>
          {openMenu === "agents" && (
            <ul className="ml-6 mt-1 space-y-1">
              <li>
                <Link
                  to="/add-agent"
                  className="block px-3 py-1 rounded-md hover:bg-indigo-500 text-sm"
                >
                  ➕ Add Agent
                </Link>
              </li>
              <li>
                <Link
                  to="/manage-agents"
                  className="block px-3 py-1 rounded-md hover:bg-indigo-500 text-sm"
                >
                  🧾 Manage Agents
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Fund Management */}
        <li>
          <button
            onClick={() => toggleMenu("funds")}
            className="w-full flex justify-between items-center px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <span>💰 Fund Management</span>
            <span className="text-sm">{openMenu === "funds" ? "▲" : "▼"}</span>
          </button>
          {openMenu === "funds" && (
            <ul className="ml-6 mt-1 space-y-1">
              <li>
                <Link
                  to="/view-funds"
                  className="block px-3 py-1 rounded-md hover:bg-indigo-500 text-sm"
                >
                  💵 View Total Funds
                </Link>
              </li>
              <li>
                <Link
                  to="/pending_collection"
                  className="block px-3 py-1 rounded-md hover:bg-indigo-500 text-sm"
                >
                  🕒 Pending Collections
                </Link>
              </li>
              <li>
                <Link
                  to="/payment_history"
                  className="block px-3 py-1 rounded-md hover:bg-indigo-500 text-sm"
                >
                  📑 Payment History
                </Link>
              </li>
              <li>
                <Link
                  to="/fund-management"
                  className="block px-3 py-1 rounded-md hover:bg-indigo-500 text-sm"
                >
                  🔍 Fund Tracking
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Footer */}
      <div className="p-4 border-t border-indigo-500 text-center text-xs text-indigo-200">
        © {new Date().getFullYear()} Mosque Admin
      </div>
    </div>
  );
}
