import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import DashboardLayout from "./DashboardLayout";
import { Modal, Button, Form } from "react-bootstrap";
import "../component/styles/PendingCollection.css";

export default function PendingCollection() {
  const [members, setMembers] = useState([]);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'sms' or 'email'
  const [modalMember, setModalMember] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch members and funds
  const fetchData = async () => {
    setLoading(true);
    try {
      const memberSnap = await getDocs(collection(db, "members"));
      const fundSnap = await getDocs(collection(db, "funds"));

      const membersData = memberSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const fundsData = fundSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setMembers(membersData);
      setFunds(fundsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to fetch data from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate pending members
  const pendingMembers = members
    .map((m) => {
      const memberFunds = funds.filter((f) => f.memberId === m.memberID);
      const totalPaid = memberFunds.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
      const totalPayment = parseFloat(m.paymentAmount) || 0;
      const pendingAmount = totalPayment - totalPaid;

      return {
        ...m,
        totalPaid,
        pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
      };
    })
    .filter((m) => m.pendingAmount > 0);

  const totalPending = pendingMembers.reduce((sum, m) => sum + m.pendingAmount, 0);
  const totalPaid = pendingMembers.reduce((sum, m) => sum + m.totalPaid, 0);

  // Open modal
  const openModal = (type, member) => {
    setModalType(type);
    setModalMember(member);
    setMessage(
      `Dear ${member.fullName || "Member"}, your pending payment is LKR ${
        member.pendingAmount || 0
      }. Please pay promptly.`
    );
    setShowModal(true);
  };

  // Send message
  const sendMessage = async () => {
    if (!modalMember) return;
    try {
      if (modalType === "sms") {
        await fetch("http://localhost:5000/api/send-sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number: modalMember.contactNumber || "", message }),
        });
        alert(`SMS sent to ${modalMember.fullName || "Member"}`);
      } else if (modalType === "email") {
        await fetch("http://localhost:5000/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: modalMember.email || "",
            subject: "Pending Payment Reminder",
            message,
          }),
        });
        alert(`Email sent to ${modalMember.fullName || "Member"}`);
      }
      setShowModal(false);
      setModalMember(null);
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mt-4 pending-collection">
        <h2 className="text-center mb-4">Pending Collections</h2>

        {/* Summary */}
        <div className="d-flex justify-content-between mb-4 flex-wrap gap-3 summary-boxes">
          <h5 className="text-danger">Total Pending: LKR {totalPending.toLocaleString()}</h5>
          <h5 className="text-success">Total Paid: LKR {totalPaid.toLocaleString()}</h5>
          <h5 className="text-primary">Members with Pending: {pendingMembers.length}</h5>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading data...</p>
        ) : pendingMembers.length === 0 ? (
          <p>No members with pending payments!</p>
        ) : (
          <div className="table-responsive shadow-sm bg-white rounded">
            <table className="table table-hover text-center mb-0">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Member ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Total Payment (LKR)</th>
                  <th>Paid (LKR)</th>
                  <th>Pending (LKR)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingMembers.map((m, index) => (
                  <tr key={m.id}>
                    <td>{index + 1}</td>
                    <td>{m.memberID || "-"}</td>
                    <td>{m.fullName || "-"}</td>
                    <td>{m.contactNumber || "-"}</td>
                    <td>{m.email || "-"}</td>
                    <td>{(parseFloat(m.paymentAmount) || 0).toLocaleString()}</td>
                    <td>{m.totalPaid.toLocaleString()}</td>
                    <td className="text-danger fw-bold">{m.pendingAmount.toLocaleString()}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => openModal("sms", m)}
                        >
                          📩 SMS
                        </button>
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => openModal("email", m)}
                        >
                          ✉️ Email
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === "sms" ? "Send SMS" : "Send Email"} to {modalMember?.fullName || "Member"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={sendMessage}>
              Send
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
