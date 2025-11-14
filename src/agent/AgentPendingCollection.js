import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
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
  Button,
} from "@mui/material";

export default function AgentPendingCollection() {
  const [members, setMembers] = useState([]);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get agent ID from session storage
  const agentData = JSON.parse(sessionStorage.getItem("agentData"));
  const agentId = agentData?.id;

  useEffect(() => {
    if (!agentId) return;
    fetchData();
  }, [agentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // ✅ Fetch only members added by this agent
      const memberQuery = query(
        collection(db, "members"),
        where("assignedAgent", "==", agentId)
      );
      const memberSnap = await getDocs(memberQuery);
      const fundSnap = await getDocs(collection(db, "funds"));

      const membersData = memberSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const fundsData = fundSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMembers(membersData);
      setFunds(fundsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate pending amounts
  const pendingMembers = members
    .map((m) => {
      const memberFunds = funds.filter((f) => f.memberId === m.memberID);
      const totalPaid = memberFunds.reduce(
        (sum, f) => sum + (parseFloat(f.amount) || 0),
        0
      );
      const totalPayment = parseFloat(m.paymentAmount) || 0;
      const pendingAmount = totalPayment - totalPaid;

      return {
        ...m,
        totalPaid,
        pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
      };
    })
    .filter((m) => m.pendingAmount > 0);

  const totalPending = pendingMembers.reduce(
    (sum, m) => sum + m.pendingAmount,
    0
  );
  const totalPaid = pendingMembers.reduce((sum, m) => sum + m.totalPaid, 0);

  return (
    
      <Box p={2}>
        <Typography variant="h5" color="primary" mb={3}>
          Pending Collections
        </Typography>

        <Box display="flex" gap={3} flexWrap="wrap" mb={2}>
          <Typography color="error.main" fontWeight="bold">
            Total Pending: LKR {totalPending.toLocaleString()}
          </Typography>
          <Typography color="success.main" fontWeight="bold">
            Total Paid: LKR {totalPaid.toLocaleString()}
          </Typography>
          <Typography color="info.main" fontWeight="bold">
            Members with Pending: {pendingMembers.length}
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Member ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Total Payment (LKR)</TableCell>
                <TableCell>Paid (LKR)</TableCell>
                <TableCell>Pending (LKR)</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading data...
                  </TableCell>
                </TableRow>
              ) : pendingMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No pending payments found.
                  </TableCell>
                </TableRow>
              ) : (
                pendingMembers.map((m, index) => (
                  <TableRow key={m.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{m.memberID || "—"}</TableCell>
                    <TableCell>{m.fullName || "—"}</TableCell>
                    <TableCell>{m.contactNumber || "—"}</TableCell>
                    <TableCell>{m.email || "—"}</TableCell>
                    <TableCell>
                      {(parseFloat(m.paymentAmount) || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>{m.totalPaid.toLocaleString()}</TableCell>
                    <TableCell sx={{ color: "error.main", fontWeight: "bold" }}>
                      {m.pendingAmount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    
  );
}
