import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaMoneyBill,
  FaHistory,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AgentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("agentData");
    navigate("/agent/login");
  };

  const cards = [
    {
      icon: <FaUsers className="text-4xl text-blue-600 mb-2" />,
      title: "My Members",
      desc: "View and manage your assigned members.",
      path: "/agent/my-members",
    },
    {
      icon: <FaMoneyBill className="text-4xl text-green-600 mb-2" />,
      title: "Pending Collections",
      desc: "View pending donation collections.",
      path: "/agent/collections",
    },
    {
      icon: <FaHistory className="text-4xl text-yellow-500 mb-2" />,
      title: "Payment History",
      desc: "Check your completed payments.",
      path: "/agent/payments",
    },
    {
      icon: <FaUserCircle className="text-4xl text-purple-500 mb-2" />,
      title: "My Profile",
      desc: "View and manage your profile details.",
      path: "/agent/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center py-10 px-5">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to Your Dashboard
        </h2>
        <p className="text-gray-600">
          Manage your members, collections, and payments effortlessly.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.path)}
            className="cursor-pointer p-6 rounded-2xl bg-white/80 backdrop-blur-md shadow-md hover:shadow-xl 
                       transition-all duration-200 border border-gray-100 hover:scale-105 text-center"
          >
            {card.icon}
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {card.title}
            </h3>
            <p className="text-gray-500 text-sm">{card.desc}</p>
          </div>
        ))}

        {/* Logout card */}
        <div
          onClick={handleLogout}
          className="cursor-pointer p-6 rounded-2xl bg-red-100/70 backdrop-blur-md shadow-md hover:shadow-xl 
                     transition-all duration-200 border border-red-200 hover:scale-105 text-center"
        >
          <FaSignOutAlt className="text-4xl text-red-500 mb-2" />
          <h3 className="text-lg font-semibold text-red-600 mb-1">Logout</h3>
          <p className="text-red-500 text-sm">Sign out from your account.</p>
        </div>
      </div>
    </div>
  );
}
