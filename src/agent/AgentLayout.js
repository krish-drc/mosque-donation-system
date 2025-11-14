import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom"; // ✅ import Outlet
import AgentSidebar from "./AgentSidebar";
import AgentHeader from "./AgentHeader";
import "../agent/styles/AgentLayout.css";

export default function AgentLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const agentData = sessionStorage.getItem("agentData");
    if (!agentData) {
      navigate("/agent/login");
    }
  }, [navigate]);

  return (
    <div className="agent-dashboard-wrapper">
      <div className="agent-dashboard-sidebar">
        <AgentSidebar />
      </div>
      <div className="agent-dashboard-main">
        <AgentHeader />
        <div className="agent-dashboard-content">
          <Outlet /> {/* 🔹 this renders child routes */}
        </div>
      </div>
    </div>
  );
}
