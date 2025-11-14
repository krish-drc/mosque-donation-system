import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AgentAddMember() {
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    dateJoined: "",
    donationPreference: "",
    paymentAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [generatedID, setGeneratedID] = useState("");
  const [secretCode, setSecretCode] = useState("");

  // Get logged-in agent info from sessionStorage
  const agentData = JSON.parse(sessionStorage.getItem("agentData")) || {};
  const agentID = agentData.agentID || "Unknown"; // readable ID
  const agentName = agentData.fullName || "Unknown";
  const assignedAgentID = agentData.id || agentID; // Firestore doc ID

  // Generate random Member ID
  const generateMemberID = () =>
    `MBR${Math.floor(1000 + Math.random() * 9000)}`;

  // Generate random secret code
  const generateSecretCode = (length = 8) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const memberID = generateMemberID();
      const secret = generateSecretCode();

      await addDoc(collection(db, "members"), {
        fullName: form.fullName,
        gender: form.gender,
        contactNumber: form.contactNumber,
        email: form.email,
        address: form.address,
        dateJoined: form.dateJoined,
        donationPreference: form.donationPreference,
        paymentAmount: form.paymentAmount.toString(), // store as string
        memberID,
        secretCode: secret,
        agentID,
        agentName,
        assignedAgent: assignedAgentID, // Firestore doc ID
        createdAt: serverTimestamp(),
      });

      setGeneratedID(memberID);
      setSecretCode(secret);
      setMsg("✅ Member added successfully!");

      // Reset form
      setForm({
        fullName: "",
        gender: "",
        contactNumber: "",
        email: "",
        address: "",
        dateJoined: "",
        donationPreference: "",
        paymentAmount: "",
      });
    } catch (error) {
      console.error(error);
      setMsg("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Add Mosque Member
      </h2>

      {msg && (
        <div
          className={`mb-4 p-3 rounded ${
            msg.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Agent Info */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Agent ID</label>
            <input
              type="text"
              value={agentID}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />

            <label className="block mt-4 mb-1 font-medium text-gray-700">Agent Name</label>
            <input
              type="text"
              value={agentName}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                rows={4}
                value={form.address}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Payment Amount (LKR)</label>
              <input
                type="number"
                name="paymentAmount"
                value={form.paymentAmount || ""}
                onChange={handleChange}
                placeholder="Enter amount in LKR"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Date Joined</label>
              <input
                type="date"
                name="dateJoined"
                value={form.dateJoined}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Donation Preference</label>
              <select
                name="donationPreference"
                value={form.donationPreference || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="One-time">One-time</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Adding..." : "Add Member"}
        </button>
      </form>

      {generatedID && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded space-y-2">
          <div>
            <strong>Member ID:</strong> {generatedID}
          </div>
          <div>
            <strong>Secret Code:</strong> {secretCode}
          </div>
          <div>
            <strong>Added by:</strong> {agentName}
          </div>
        </div>
      )}
    </div>
  );
}
