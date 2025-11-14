import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

export default function AgentEditMember() {
  const { id } = useParams(); // Firestore doc ID
  const navigate = useNavigate();

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

  // Get logged-in agent info
  const agentData = JSON.parse(sessionStorage.getItem("agentData")) || {};
  const agentID = agentData.agentID || "Unknown";
  const agentName = agentData.fullName || "Unknown";

  useEffect(() => {
    if (!id) return;
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      const docRef = doc(db, "members", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm({
          fullName: data.fullName || "",
          gender: data.gender || "",
          contactNumber: data.contactNumber || "",
          email: data.email || "",
          address: data.address || "",
          dateJoined: data.dateJoined || "",
          donationPreference: data.donationPreference || "",
          paymentAmount: data.paymentAmount || "",
        });
      } else {
        setMsg("❌ Member not found.");
      }
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to fetch member data.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const docRef = doc(db, "members", id);
      await updateDoc(docRef, {
        ...form,
        paymentAmount: form.paymentAmount.toString(),
      });

      setMsg("✅ Member updated successfully!");
      setTimeout(() => navigate("/agent/my-members"), 1500);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to update member.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Edit Member
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
                value={form.paymentAmount}
                onChange={handleChange}
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
                value={form.gender}
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
                value={form.donationPreference}
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
          {loading ? "Updating..." : "Update Member"}
        </button>
      </form>
    </div>
  );
}
