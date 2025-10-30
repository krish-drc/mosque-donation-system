import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css"; // Import CSS

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState("");

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  return (
    <div className="sidebar">
      {/* Header */}
      <h3 className="sidebar-header">🕌 Mosque Admin Panel</h3>

      {/* Menu List */}
      <ul className="sidebar-menu">
        {/* Dashboard */}
        <li>
          <Link to="/admin/dashboard" className="menu-btn dashboard-btn">
            📊 Dashboard & Reports
          </Link>
        </li>

        {/* Members */}
        <li>
          <button className="menu-btn main-btn" onClick={() => toggleMenu("members")}>
            🙋 Members
          </button>
          {openMenu === "members" && (
            <ul className="submenu">
              <li>
                <Link to="/add-member" className="submenu-btn">
                  ➕ Add Member
                </Link>
              </li>
              <li>
                <Link to="/manage-members" className="submenu-btn">
                  🧾 Manage Members
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Collecting Agents */}
        <li>
          <button className="menu-btn main-btn" onClick={() => toggleMenu("agents")}>
            💼 Collecting Agents
          </button>
          {openMenu === "agents" && (
            <ul className="submenu">
              <li>
                <Link to="/add-agent" className="submenu-btn">
                  ➕ Add Agent
                </Link>
              </li>
              <li>
                <Link to="/manage-agents" className="submenu-btn">
                  🧾 Manage Agents
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Fund Management */}
        <li>
          <button className="menu-btn main-btn" onClick={() => toggleMenu("funds")}>
            💰 Fund Management
          </button>
          {openMenu === "funds" && (
            <ul className="submenu">
              <li>
                <Link to="/view-funds" className="submenu-btn">
                  💵 View Total Funds
                </Link>
              </li>
              <li>
                <Link to="/pending_collection" className="submenu-btn">
                  🕒 Pending Collections
                </Link>
              </li>
              <li>
                <Link to="/payment_history" className="submenu-btn">
                  📑 Payment History
                </Link>
              </li>
              <li>
                <Link to="/fund-management" className="submenu-btn">
                  🔍 Fund Tracking
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}
