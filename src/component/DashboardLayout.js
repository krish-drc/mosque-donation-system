import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../styles/DashboardLayout.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-sidebar">
        <Sidebar />
      </div>

      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
