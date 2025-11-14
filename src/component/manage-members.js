import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { FaEdit, FaTrash } from "react-icons/fa";

function Row({ member, index, handleDelete, agentName }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{member.memberID || "—"}</TableCell>
        <TableCell>{member.fullName}</TableCell>
        <TableCell>{member.gender || "N/A"}</TableCell>
        <TableCell>{member.contactNumber}</TableCell>
        <TableCell>{member.email}</TableCell>
        <TableCell>{member.dateJoined}</TableCell>
        <TableCell>{member.donationPreference || "N/A"}</TableCell>
        <TableCell>
          {member.paymentAmount
            ? `LKR ${Number(member.paymentAmount).toLocaleString()}`
            : "—"}
        </TableCell>
        <TableCell>{agentName || "Unassigned"}</TableCell>
        <TableCell>{member.secretCode || "N/A"}</TableCell>
        <TableCell>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/edit-member/${member.id}`)}
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

      <TableRow>
        <TableCell colSpan={13} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="subtitle2" gutterBottom>
                Address:
              </Typography>
              <Typography variant="body2">{member.address || "N/A"}</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  member: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  agentName: PropTypes.string,
};

export default function ManageMembersMUI() {
  const [members, setMembers] = useState([]);
  const [agents, setAgents] = useState([]); // ✅ store all agents
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage, setMembersPerPage] = useState(5);
  const navigate = useNavigate();

  // Fetch members
  const fetchMembers = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "members"));
    setMembers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  // Fetch agents
  const fetchAgents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "agents"));
      setAgents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error loading agents:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchAgents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      await deleteDoc(doc(db, "members", id));
      setMsg("✅ Member deleted successfully!");
      fetchMembers();
    }
  };

  // Filter & Pagination
  const filteredMembers =
    filterType === "All"
      ? members
      : members.filter(
          (m) =>
            m.donationPreference?.toLowerCase() ===
            filterType.toLowerCase()
        );

  const indexOfLast = currentPage * membersPerPage;
  const indexOfFirst = indexOfLast - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const totalPayment = filteredMembers.reduce(
    (sum, member) => sum + Number(member.paymentAmount || 0),
    0
  );

  // Helper: Get Agent Name by ID
  const getAgentName = (agentId) => {
    const agent = agents.find((a) => a.id === agentId);
    return agent ? agent.fullName || agent.agentName || agent.email : "";
  };

  return (
    <DashboardLayout>
      <Box p={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" color="primary">
            Manage Mosque Members
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/add-member")}
          >
            ➕ Add Member
          </Button>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          mb={2}
          flexWrap="wrap"
          gap={2}
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
              value={membersPerPage}
              label="Rows per page"
              onChange={(e) => {
                setMembersPerPage(Number(e.target.value));
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
          <Typography color="info.main" mb={1}>
            {msg}
          </Typography>
        )}

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
                <TableCell>Assigned Agent</TableCell> {/* ✅ NEW */}
                <TableCell>Secret Code</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    Loading members...
                  </TableCell>
                </TableRow>
              ) : currentMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    No members found.
                  </TableCell>
                </TableRow>
              ) : (
                currentMembers.map((member, idx) => (
                  <Row
                    key={member.id}
                    member={member}
                    index={indexOfFirst + idx}
                    handleDelete={handleDelete}
                    agentName={getAgentName(member.assignedAgent)} // ✅ show name
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          mt={2}
        >
          <Button
            variant="outlined"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            ⬅ Previous
          </Button>
          <Typography>
            Page {currentPage} of {totalPages || 1}
          </Typography>
          <Button
            variant="outlined"
            onClick={nextPage}
            disabled={
              currentPage === totalPages || totalPages === 0
            }
          >
            Next ➡
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
