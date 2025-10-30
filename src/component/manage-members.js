import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/ManageMembers.css"; // Import CSS

export default function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(5);
  const navigate = useNavigate();

  // Fetch members
  const fetchMembers = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "members"));
    setMembers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Delete member
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      await deleteDoc(doc(db, "members", id));
      setMsg("✅ Member deleted successfully!");
      fetchMembers();
    }
  };

  // Filter
  const filteredMembers =
    filterType === "All"
      ? members
      : members.filter(
          (m) =>
            m.donationPreference &&
            m.donationPreference.toLowerCase() === filterType.toLowerCase()
        );

  // Pagination
  const indexOfLast = currentPage * membersPerPage;
  const indexOfFirst = indexOfLast - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Total Payment
  const totalPayment = filteredMembers.reduce(
    (sum, member) => sum + Number(member.paymentAmount || 0),
    0
  );

  return (
    <DashboardLayout>
      <div className="container mt-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
          <h2 className="fw-bold text-primary mb-2">Manage Mosque Members</h2>
          <div className="d-flex flex-wrap align-items-center gap-3">
            {/* Add Member Button */}
            <button
              className="btn btn-success"
              onClick={() => navigate("/add-member")}
            >
              ➕ Add Member
            </button>

            {/* Filter Dropdown */}
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
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="One-time">One-time</option>
              </select>
            </div>

            {/* Total Payment */}
            <h5 className="text-success mb-0">
              💰 Total ({filterType}): LKR {totalPayment.toLocaleString()}
            </h5>
          </div>
        </div>

        {msg && <div className="alert alert-info">{msg}</div>}

        {/* Table */}
        <div className="table-responsive shadow-sm bg-white rounded p-3">
          {loading ? (
            <p className="p-3 text-center">Loading members...</p>
          ) : currentMembers.length === 0 ? (
            <p className="p-3 text-center">No members found.</p>
          ) : (
            <table className="table table-hover align-middle mb-0 text-center custom-table">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Member ID</th>
                  <th>Full Name</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Date Joined</th>
                  <th>Donation Type</th>
                  <th>Payment (LKR)</th>
                  <th>Secret Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map((member, index) => (
                  <tr key={member.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {member.memberID || "—"}
                      </span>
                    </td>
                    <td>{member.fullName}</td>
                    <td>
                      <span
                        className={`badge ${
                          member.gender === "Male"
                            ? "bg-primary"
                            : "bg-pink text-white"
                        }`}
                      >
                        {member.gender || "N/A"}
                      </span>
                    </td>
                    <td>{member.contactNumber}</td>
                    <td>{member.email}</td>
                    <td className="text-wrap" style={{ maxWidth: "200px" }}>
                      {member.address}
                    </td>
                    <td>{member.dateJoined}</td>
                    <td>
                      <span
                        className={`badge ${
                          member.donationPreference === "Monthly"
                            ? "bg-success"
                            : member.donationPreference === "Yearly"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {member.donationPreference || "N/A"}
                      </span>
                    </td>
                    <td>
                      {member.paymentAmount
                        ? `LKR ${Number(member.paymentAmount).toLocaleString()}`
                        : "—"}
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {member.secretCode || "N/A"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="Edit Member"
                          onClick={() =>
                            navigate(`/edit-member/${member.id}`)
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete Member"
                          onClick={() => handleDelete(member.id)}
                        >
                          <FaTrash />
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
        <div className="pagination-container d-flex justify-content-center align-items-center gap-4 mt-4">
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
