import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Button, Form, Table, Modal } from "react-bootstrap";
import DashboardLayout from "../component/DashboardLayout";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../component/styles/FundManager.css";

export default function FundManager() {
  const [memberId, setMemberId] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [funds, setFunds] = useState([]);
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [memberSearch, setMemberSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editFund, setEditFund] = useState(null);

  const fundCollection = collection(db, "funds");
  const memberCollection = collection(db, "members");

  const fetchFunds = async () => {
    const data = await getDocs(fundCollection);
    setFunds(data.docs.map((doc) => ({ ...doc.data(), docId: doc.id })));
  };

  const fetchMembers = async () => {
    const data = await getDocs(memberCollection);
    setMembers(data.docs.map((doc) => ({ ...doc.data(), docId: doc.id })));
  };

  useEffect(() => {
    fetchFunds();
    fetchMembers();
  }, []);

  const handleMemberChange = (id) => {
    setMemberId(id);
    const member = members.find((m) => m.memberID === id);
    if (member) {
      setName(member.fullName || "");
      setMobile(member.contactNumber || "");
      setType(member.donationPreference || "");
      setAmount("");
    } else {
      setName("");
      setMobile("");
      setType("");
      setAmount("");
    }
  };

  const addFund = async (e) => {
    e.preventDefault();
    if (memberId && name && mobile && type && amount) {
      await addDoc(fundCollection, {
        memberId,
        name,
        mobile,
        type,
        amount: parseFloat(amount),
      });
      setAmount("");
      fetchFunds();
    } else {
      alert("Please fill all fields!");
    }
  };

  const deleteFund = async (docId) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      await deleteDoc(doc(db, "funds", docId));
      fetchFunds();
    }
  };

  const openEditModal = (fund) => {
    setEditFund(fund);
    setShowModal(true);
  };

  const saveEdit = async () => {
    if (!editFund.amount) {
      alert("Amount cannot be empty");
      return;
    }
    const docRef = doc(db, "funds", editFund.docId);
    await updateDoc(docRef, { amount: parseFloat(editFund.amount), type: editFund.type });
    setShowModal(false);
    setEditFund(null);
    fetchFunds();
  };

  // ✅ Filter funds based on donation type
  const filteredFunds = filter === "All" ? funds : funds.filter((f) => f.type === filter);

  // ✅ Build unique member list with filtered funds
  const membersWithFilteredFunds = members.map((m) => {
    const memberFunds = filteredFunds.filter((f) => f.memberId === m.memberID);
    const totalPaid = memberFunds.reduce((sum, f) => sum + f.amount, 0);
    const pending = (parseFloat(m.paymentAmount) || 0) - totalPaid;
    const lastFund = memberFunds.length > 0 ? memberFunds[memberFunds.length - 1] : null;
    return { ...m, memberFunds, totalPaid, pending, lastFund };
  });

  return (
    <DashboardLayout>
      <div className="fund-manager mt-4">
        <h3 className="text-center mb-4">🕌 Mosque Fund Management</h3>

        {/* Add Fund Form */}
        <Form onSubmit={addFund} className="mb-4 fund-form p-3 shadow-sm rounded bg-white">
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              placeholder="Search Member by ID or Name"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Select value={memberId} onChange={(e) => handleMemberChange(e.target.value)}>
              <option value="">Select Member ID</option>
              {members
                .filter((m) =>
                  m.memberID.toLowerCase().includes(memberSearch.toLowerCase()) ||
                  m.fullName.toLowerCase().includes(memberSearch.toLowerCase())
                )
                .map((m) => (
                  <option key={m.docId} value={m.memberID}>
                    {m.memberID} - {m.fullName}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control type="text" placeholder="Member Name" value={name} readOnly />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control type="text" placeholder="Mobile Number" value={mobile} readOnly />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select Donation Type</option>
              <option value="One-time">One-time</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              type="number"
              placeholder="Donation Amount (Rs)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">Add Fund</Button>
        </Form>

        {/* Filter Dropdown */}
        <Form.Group className="mb-3">
          <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Donations</option>
            <option value="One-time">One-time</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </Form.Select>
        </Form.Group>

        {/* Funds Table */}
        <div className="table-responsive shadow-sm rounded bg-white p-3">
          <Table striped bordered hover className="align-middle text-center mb-0 custom-fund-table">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Member ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Donation Type</th>
                <th>Payment Amount (LKR)</th>
                <th>Total Paid (LKR)</th>
                <th>Pending (LKR)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {membersWithFilteredFunds.map((m, index) => (
                <tr key={m.docId}>
                  <td>{index + 1}</td>
                  <td>{m.memberID}</td>
                  <td>{m.fullName}</td>
                  <td>{m.contactNumber}</td>
                  <td>{m.donationPreference || "N/A"}</td>
                  <td>{m.paymentAmount || 0}</td>
                  <td>{m.totalPaid}</td>
                  <td>{m.pending >= 0 ? m.pending : 0}</td>
                  <td>
                    {m.lastFund ? (
                      <div className="d-flex justify-content-center gap-2">
                        <FaEdit
                          style={{ cursor: "pointer", color: "#ffc107" }}
                          size={18}
                          onClick={() => openEditModal(m.lastFund)}
                          title="Edit"
                        />
                        <FaTrash
                          style={{ cursor: "pointer", color: "#dc3545" }}
                          size={18}
                          onClick={() => deleteFund(m.lastFund.docId)}
                          title="Delete"
                        />
                      </div>
                    ) : (
                      <span>N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Fund</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editFund && (
              <>
                <Form.Group className="mb-2">
                  <Form.Label>Donation Type</Form.Label>
                  <Form.Select
                    value={editFund.type}
                    onChange={(e) =>
                      setEditFund({ ...editFund, type: e.target.value })
                    }
                  >
                    <option value="One-time">One-time</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Amount (Rs)</Form.Label>
                  <Form.Control
                    type="number"
                    value={editFund.amount}
                    onChange={(e) =>
                      setEditFund({ ...editFund, amount: e.target.value })
                    }
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveEdit}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
