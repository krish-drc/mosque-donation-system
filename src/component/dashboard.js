import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import DashboardLayout from "../component/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../styles/Dashboard.css"; // ✅ import external css

export default function Dashboard() {
  const [stats, setStats] = useState({
    members: 0,
    agents: 0,
    totalFunds: 0,
    pendingCollections: 0,
  });

  const [donationData, setDonationData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const membersSnap = await getDocs(collection(db, "members"));
        const agentsSnap = await getDocs(collection(db, "agents"));
        const fundsSnap = await getDocs(collection(db, "donations"));

        let totalAmount = 0;
        let pending = 0;
        let donationByType = { Monthly: 0, Yearly: 0, "One-time": 0 };

        fundsSnap.forEach((doc) => {
          const data = doc.data();
          totalAmount += data.amount || 0;
          if (data.status === "Pending") pending += 1;

          if (data.donationPreference) {
            donationByType[data.donationPreference] += data.amount || 0;
          }
        });

        setStats({
          members: membersSnap.size,
          agents: agentsSnap.size,
          totalFunds: totalAmount,
          pendingCollections: pending,
        });

        setDonationData([
          { name: "Monthly", amount: donationByType.Monthly },
          { name: "Yearly", amount: donationByType.Yearly },
          { name: "One-time", amount: donationByType["One-time"] },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchStats();
  }, []);

  const COLORS = ["#1E88E5", "#43A047", "#FB8C00"];

  const cards = [
    { label: "Total Members", value: stats.members, icon: "👥" },
    { label: "Collecting Agents", value: stats.agents, icon: "🧾" },
    { label: "Total Funds (₹)", value: stats.totalFunds.toLocaleString(), icon: "💰" },
    { label: "Pending Collections", value: stats.pendingCollections, icon: "⏳" },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <h2 className="dashboard-title">Mosque Donation Dashboard</h2>

        {/* Cards Section */}
        <div className="dashboard-cards">
          {cards.map((item, index) => (
            <div className="dashboard-card" key={index}>
              <div className="dashboard-card-icon">{item.icon}</div>
              <h3 className="dashboard-card-value">{item.value}</h3>
              <p className="dashboard-card-label">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="dashboard-charts">
          <div className="dashboard-chart">
            <h4 className="chart-title">Donation Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donationData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {donationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-chart">
            <h4 className="chart-title">Members vs Agents Overview</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: "Counts", Members: stats.members, Agents: stats.agents }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Members" fill="#1E88E5" />
                <Bar dataKey="Agents" fill="#43A047" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
