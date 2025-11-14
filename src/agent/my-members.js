import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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
  Collapse,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

// Row component
function Row({ member, index, handleDelete }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{member.memberID || "—"}</TableCell>
        <TableCell>{member.fullName || "—"}</TableCell>
        <TableCell>{member.gender || "—"}</TableCell>
        <TableCell>{member.contactNumber || "—"}</TableCell>
        <TableCell>{member.email || "—"}</TableCell>
        <TableCell>{member.dateJoined || "—"}</TableCell>
        <TableCell>{member.donationPreference || "N/A"}</TableCell>
        <TableCell>
          {member.paymentAmount
            ? `LKR ${Number(member.paymentAmount).toLocaleString()}`
            : "—"}
        </TableCell>
        <TableCell>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/agent/edit-member/${member.id}`)}
            >
              <FaEdit />
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(member.id)}
            >
              <FaTrash />
            </Button>
          </Box>
        </TableCell>
      </TableRow>

      {/* Expandable row */}
      <TableRow>
        <TableCell colSpan={11} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="subtitle2">Address:</Typography>
              <Typography variant="body2">{member.address || "N/A"}</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function AgentManageMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const agentData = JSON.parse(sessionStorage.getItem("agentData"));
  const agentId = agentData?.id;

  useEffect(() => {
    if (!agentId) {
      navigate("/agent/login");
      return;
    }
    fetchMembers();
  }, [agentId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "members"),
        where("assignedAgent", "==", agentId)
      );
      const snapshot = await getDocs(q);
      const membersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(membersList);
    } catch (err) {
      console.error("Error fetching members:", err);
      setMsg("❌ Failed to fetch members.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteDoc(doc(db, "members", id));
        setMsg("✅ Member deleted successfully!");
        fetchMembers();
      } catch (err) {
        console.error("Error deleting member:", err);
        setMsg("❌ Failed to delete member.");
      }
    }
  };

  // Filtered members
  const filteredMembers =
    filterType === "All"
      ? members
      : members.filter(
          (m) => m.donationPreference?.toLowerCase() === filterType.toLowerCase()
        );

  // Total payment for filtered members
  const totalPayment = filteredMembers.reduce(
    (sum, member) => sum + (Number(member.paymentAmount) || 0),
    0
  );

  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);
  const displayedMembers = filteredMembers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Pagination handlers
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <Box p={2}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" color="primary">
          Manage Mosque Members
        </Typography>
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          onClick={() => navigate("/agent/add-member")}
        >
          Add Member
        </Button>
      </Box>

      {/* Filters & Total */}
      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        mb={2}
        alignItems="center"
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter by</InputLabel>
          <Select
            value={filterType}
            label="Filter by"
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Yearly">Yearly</MenuItem>
            <MenuItem value="One-time">One-time</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="subtitle1" color="success.main">
          💰 Total ({filterType}): LKR {totalPayment.toLocaleString()}
        </Typography>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={rowsPerPage}
            label="Rows per page"
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 20, 50, 100].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {msg && (
        <Typography color={msg.startsWith("✅") ? "success.main" : "error"} mb={1}>
          {msg}
        </Typography>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>#</TableCell>
              <TableCell>Member ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date Joined</TableCell>
              <TableCell>Donation Type</TableCell>
              <TableCell>Payment (LKR)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  Loading members...
                </TableCell>
              </TableRow>
            ) : displayedMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              displayedMembers.map((member, idx) => (
                <Row
                  key={member.id}
                  member={member}
                  index={idx + (currentPage - 1) * rowsPerPage}
                  handleDelete={handleDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={2}>
        <Button variant="outlined" onClick={prevPage} disabled={currentPage === 1}>
          ⬅ Previous
        </Button>
        <Typography>
          Page {currentPage} of {totalPages || 1}
        </Typography>
        <Button
          variant="outlined"
          onClick={nextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next ➡
        </Button>
      </Box>
    </Box>
  );
}
