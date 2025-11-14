import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AgentPaymentHistory() {
  const [donations, setDonations] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get logged-in agent data
  const agentData = JSON.parse(sessionStorage.getItem("agentData"));
  const agentId = agentData?.id;

  useEffect(() => {
    if (!agentId) return;
    fetchData();
  }, [agentId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch only members assigned to this agent
      const memberQuery = query(
        collection(db, "members"),
        where("assignedAgent", "==", agentId)
      );
      const memberSnap = await getDocs(memberQuery);
      const membersList = memberSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch all donations
      const donationSnap = await getDocs(collection(db, "donations"));
      const donationsList = donationSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter donations belonging to this agent's members
      const agentMemberIDs = membersList.map((m) => m.memberID);
      const filteredDonations = donationsList.filter((d) =>
        agentMemberIDs.includes(d.memberId)
      );

      setMembers(membersList);
      setDonations(filteredDonations);
    } catch (error) {
      console.error("Error fetching agent payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate totals
  const totalPaid = donations
    .filter((d) => d.status === "Paid")
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const totalPending = donations
    .filter((d) => d.status === "Pending")
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  // ✅ Bar chart data
  const barData = [
    { name: "Paid", value: totalPaid },
    { name: "Pending", value: totalPending },
  ];

  // ✅ Pie chart by type (only paid)
  const donationByType = { Monthly: 0, Yearly: 0, "One-time": 0 };
  donations
    .filter((d) => d.status === "Paid")
    .forEach((d) => {
      if (d.donationPreference && donationByType[d.donationPreference] !== undefined) {
        donationByType[d.donationPreference] += Number(d.amount) || 0;
      }
    });

  const pieData = [
    { name: "Monthly", value: donationByType.Monthly },
    { name: "Yearly", value: donationByType.Yearly },
    { name: "One-time", value: donationByType["One-time"] },
  ];

  const COLORS = ["#43A047", "#1E88E5", "#FB8C00"];

  return (
      <Box p={3}>
        <Typography variant="h5" color="primary" mb={3}>
          Payment History
        </Typography>

        {loading ? (
          <Typography align="center">Loading payment data...</Typography>
        ) : (
          <>
            {/* ✅ Summary */}
            <Box
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
              mb={3}
              gap={3}
            >
              <Typography color="success.main" fontWeight="bold">
                Total Paid: LKR {totalPaid.toLocaleString()}
              </Typography>
              <Typography color="error.main" fontWeight="bold">
                Total Pending: LKR {totalPending.toLocaleString()}
              </Typography>
              <Typography color="primary.main" fontWeight="bold">
                Total Records: {donations.length}
              </Typography>
            </Box>

            {/* ✅ Charts Section */}
            <Box display="grid" gridTemplateColumns="repeat(auto-fit,minmax(300px,1fr))" gap={3} mb={4}>
              {/* Bar Chart */}
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle1" mb={1}>
                  Paid vs Pending
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#1E88E5" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>

              {/* Pie Chart */}
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle1" mb={1}>
                  Donation Type (Paid)
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Box>

            {/* ✅ Table Section */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Member ID</TableCell>
                    <TableCell>Member Name</TableCell>
                    <TableCell>Donation Type</TableCell>
                    <TableCell>Amount (LKR)</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {donations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No payment history found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    donations.map((d, index) => {
                      const member = members.find(
                        (m) => m.memberID === d.memberId
                      );
                      return (
                        <TableRow key={d.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{d.memberId}</TableCell>
                          <TableCell>{member?.fullName || "—"}</TableCell>
                          <TableCell>
                            {d.donationPreference || "—"}
                          </TableCell>
                          <TableCell>
                            {(Number(d.amount) || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={d.status}
                              color={
                                d.status === "Paid"
                                  ? "success"
                                  : d.status === "Pending"
                                  ? "warning"
                                  : "default"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {d.date
                              ? new Date(d.date.seconds * 1000).toLocaleDateString()
                              : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    
  );
}
