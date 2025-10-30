import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import DashboardLayout from "./DashboardLayout";
import "../styles/PaymentHistory.css"; // Custom CSS
import { Table } from "react-bootstrap";

export default function PaymentHistory() {
  const [members, setMembers] = useState([]);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");

  // Fetch members
  const fetchMembers = async () => {
    const snapshot = await getDocs(collection(db, "members"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Fetch funds/donations
  const fetchFunds = async () => {
    const snapshot = await getDocs(collection(db, "funds"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const membersData = await fetchMembers();
      const fundsData = await fetchFunds();
      setMembers(membersData);
      setFunds(fundsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter funds by type
  const filteredFunds =
    filterType === "All"
      ? funds
      : funds.filter((f) => f.type.toLowerCase() === filterType.toLowerCase());

  // Calculate totals
  const totalPayment = members.reduce(
    (sum, m) => sum + Number(m.paymentAmount || 0),
    0
  );
  const totalPaid = funds.reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const totalPending = totalPayment - totalPaid;

  // Sort funds by recent
  const recentFunds = [...funds].sort(
    (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
  );

  return (
    <DashboardLayout>
      <div className="container mt-4">
        <h2 className="fw-bold text-primary mb-3">💰 Payment History</h2>

        {/* Summary Boxes */}
        <div className="d-flex gap-4 flex-wrap mb-4">
          <div className="p-3 shadow rounded flex-fill text-center">
            <h6>Total Payment</h6>
            <h5>LKR {totalPayment.toLocaleString()}</h5>
          </div>
          <div className="p-3 shadow rounded flex-fill text-center">
            <h6>Total Paid</h6>
            <h5>LKR {totalPaid.toLocaleString()}</h5>
          </div>
          <div className="p-3 shadow rounded flex-fill text-center">
            <h6>Pending Payment</h6>
            <h5>LKR {totalPending.toLocaleString()}</h5>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="me-2 fw-bold text-secondary">Filter by:</label>
            <select
              className="form-select d-inline-block"
              style={{ width: "180px" }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All</option>
              <option value="One-time">One-time</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="mb-4">
          <h5>🔹 Recent Activity</h5>
          <div className="table-responsive shadow-sm">
            {loading ? (
              <p className="p-3">Loading recent payments...</p>
            ) : recentFunds.length === 0 ? (
              <p className="p-3">No transactions found.</p>
            ) : (
              <Table hover bordered className="align-middle text-center mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Member ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Amount (LKR)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFunds.slice(0, 5).map((f, index) => {
                    const member = members.find((m) => m.memberID === f.memberId);
                    return (
                      <tr key={f.id}>
                        <td>{index + 1}</td>
                        <td>{f.memberId}</td>
                        <td>{member?.fullName || "N/A"}</td>
                        <td className={f.type.toLowerCase()}>{f.type}</td>
                        <td>LKR {Number(f.amount).toLocaleString()}</td>
                        <td>{f.date || f.createdAt || "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
        </div>

        {/* All Transactions */}
        <div className="mb-4">
          <h5>🔹 All Transactions</h5>
          <div className="table-responsive shadow-sm">
            {loading ? (
              <p className="p-3">Loading transactions...</p>
            ) : filteredFunds.length === 0 ? (
              <p className="p-3">No transactions found.</p>
            ) : (
              <Table hover bordered className="align-middle text-center mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Member ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Amount (LKR)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFunds.map((f, index) => {
                    const member = members.find((m) => m.memberID === f.memberId);
                    return (
                      <tr key={f.id}>
                        <td>{index + 1}</td>
                        <td>{f.memberId}</td>
                        <td>{member?.fullName || "N/A"}</td>
                        <td className={f.type.toLowerCase()}>{f.type}</td>
                        <td>LKR {Number(f.amount).toLocaleString()}</td>
                        <td>{f.date || f.createdAt || "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
