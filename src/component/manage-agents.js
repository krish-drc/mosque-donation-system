import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../component/DashboardLayout";

// React Icons
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ManageAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [agentsPerPage] = useState(5);
  const navigate = useNavigate();

  // Fetch agents
  const fetchAgents = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "agents"));
    setAgents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Delete agent
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      await deleteDoc(doc(db, "agents", id));
      setMsg("✅ Agent deleted successfully!");
      fetchAgents();
    }
  };

  // Filter
  const filteredAgents =
    filterType === "All"
      ? agents
      : agents.filter(
          (a) => a.agentType && a.agentType.toLowerCase() === filterType.toLowerCase()
        );

  // Pagination
  const indexOfLast = currentPage * agentsPerPage;
  const indexOfFirst = indexOfLast - agentsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <DashboardLayout>
      <div className="container mt-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
          <h2 className="fw-bold text-primary mb-2">Manage Agents</h2>
          <div className="d-flex flex-wrap align-items-center gap-3">
            <button
              className="btn btn-success"
              onClick={() => navigate("/add-agent")}
            >
              ➕ Add Agent
            </button>
            <div>
              <label className="me-2 fw-bold text-secondary">Filter by:</label>
              <select
                className="form-select d-inline-block"
                style={{ width: "180px" }}
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Paid">Paid</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
          </div>
        </div>

        {msg && <div className="alert alert-info">{msg}</div>}

        {/* Table */}
        <div className="table-responsive shadow-sm bg-white rounded p-3">
          {loading ? (
            <p className="p-3 text-center">Loading agents...</p>
          ) : currentAgents.length === 0 ? (
            <p className="p-3 text-center">No agents found.</p>
          ) : (
            <table className="table table-hover align-middle mb-0 text-center">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Agent ID</th>
                  <th>Full Name</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Assigned Area</th>
                  <th>Joining Date</th>
                  <th>Agent Type</th>
                  <th>Secret Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAgents.map((agent, index) => (
                  <tr key={agent.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{agent.agentID || "—"}</td>
                    <td>{agent.fullName}</td>
                    <td>{agent.gender || "—"}</td>
                    <td>{agent.contactNumber}</td>
                    <td>{agent.email || "—"}</td>
                    <td>{agent.assignedArea || "—"}</td>
                    <td>{agent.joiningDate || "—"}</td>
                    <td>{agent.agentType || "—"}</td>
                    <td>{agent.secretCode || "—"}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/edit-agent/${agent.id}`)}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(agent.id)}
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center align-items-center gap-4 mt-4">
          <button
            className="btn btn-outline-secondary"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            ⬅ Previous
          </button>
          <span className="fw-bold text-secondary">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            className="btn btn-outline-secondary"
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next ➡
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
