import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AgentFundManager() {
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
  const [agentId, setAgentId] = useState(null);

  const fundCollection = collection(db, "funds");
  const memberCollection = collection(db, "members");

  useEffect(() => {
    const storedAgent = JSON.parse(sessionStorage.getItem("agentData"));
    if (storedAgent && storedAgent.agentID) {
      setAgentId(storedAgent.agentID);
    }
  }, []);

  useEffect(() => {
    if (agentId) {
      fetchAgentMembers();
      fetchFunds();
    }
  }, [agentId]);

  const fetchAgentMembers = async () => {
    const membersQuery = query(memberCollection, where("agentID", "==", agentId));
    const data = await getDocs(membersQuery);
    setMembers(data.docs.map((doc) => ({ ...doc.data(), docId: doc.id })));
  };

  const fetchFunds = async () => {
    const data = await getDocs(fundCollection);
    setFunds(data.docs.map((doc) => ({ ...doc.data(), docId: doc.id })));
  };

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

  const filteredFunds = filter === "All" ? funds : funds.filter((f) => f.type === filter);
  const agentMemberIds = members.map((m) => m.memberID);
  const agentFunds = filteredFunds.filter((f) => agentMemberIds.includes(f.memberId));

  const membersWithFunds = members.map((m) => {
    const memberFunds = agentFunds.filter((f) => f.memberId === m.memberID);
    const totalPaid = memberFunds.reduce((sum, f) => sum + f.amount, 0);
    const pending = (parseFloat(m.paymentAmount) || 0) - totalPaid;
    const lastFund = memberFunds.length > 0 ? memberFunds[memberFunds.length - 1] : null;
    return { ...m, memberFunds, totalPaid, pending, lastFund };
  });

  return (
    <div className="p-6">
      <h2 className="text-center text-2xl font-semibold mb-6">💼 My Members Fund Management</h2>

      {/* Add Fund Form */}
      <form
        onSubmit={addFund}
        className="bg-white shadow-md rounded-lg p-5 mb-6 border border-gray-100"
      >
        <input
          type="text"
          placeholder="Search Member by ID or Name"
          value={memberSearch}
          onChange={(e) => setMemberSearch(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />

        <select
          value={memberId}
          onChange={(e) => handleMemberChange(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        >
          <option value="">Select Member ID</option>
          {members
            .filter(
              (m) =>
                m.memberID.toLowerCase().includes(memberSearch.toLowerCase()) ||
                m.fullName.toLowerCase().includes(memberSearch.toLowerCase())
            )
            .map((m) => (
              <option key={m.docId} value={m.memberID}>
                {m.memberID} - {m.fullName}
              </option>
            ))}
        </select>

        <input
          type="text"
          placeholder="Member Name"
          value={name}
          readOnly
          className="w-full mb-3 p-2 border border-gray-300 rounded bg-gray-100"
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          readOnly
          className="w-full mb-3 p-2 border border-gray-300 rounded bg-gray-100"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        >
          <option value="">Select Donation Type</option>
          <option value="One-time">One-time</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>

        <input
          type="number"
          placeholder="Donation Amount (Rs)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Add Fund
        </button>
      </form>

      {/* Filter */}
      <div className="mb-5">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="All">All Donations</option>
          <option value="One-time">One-time</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-100">
        <table className="min-w-full text-center border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Member ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Type</th>
              <th className="p-3">Expected</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Pending</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {membersWithFunds.map((m, index) => (
              <tr
                key={m.docId}
                className="border-t hover:bg-gray-50 transition-all duration-200"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{m.memberID}</td>
                <td className="p-3">{m.fullName}</td>
                <td className="p-3">{m.contactNumber}</td>
                <td className="p-3">{m.donationPreference || "N/A"}</td>
                <td className="p-3">{m.paymentAmount || 0}</td>
                <td className="p-3">{m.totalPaid}</td>
                <td className="p-3 text-yellow-700 font-medium">
                  {m.pending >= 0 ? m.pending : 0}
                </td>
                <td className="p-3">
                  {m.lastFund ? (
                    <div className="flex justify-center gap-3">
                      <FaEdit
                        className="text-yellow-500 cursor-pointer"
                        size={18}
                        onClick={() => openEditModal(m.lastFund)}
                      />
                      <FaTrash
                        className="text-red-600 cursor-pointer"
                        size={18}
                        onClick={() => deleteFund(m.lastFund.docId)}
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Fund</h3>
            {editFund && (
              <>
                <label className="block mb-2 font-medium">Donation Type</label>
                <select
                  value={editFund.type}
                  onChange={(e) => setEditFund({ ...editFund, type: e.target.value })}
                  className="w-full mb-3 p-2 border border-gray-300 rounded"
                >
                  <option value="One-time">One-time</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>

                <label className="block mb-2 font-medium">Amount (Rs)</label>
                <input
                  type="number"
                  value={editFund.amount}
                  onChange={(e) => setEditFund({ ...editFund, amount: e.target.value })}
                  className="w-full mb-3 p-2 border border-gray-300 rounded"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
