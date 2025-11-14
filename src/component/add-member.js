import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import DashboardLayout from "../component/DashboardLayout";

export default function AddMember() {
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    dateJoined: "",
    donationPreference: "",
    paymentAmount: "",
    agentId: "",
  });

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [generatedID, setGeneratedID] = useState("");
  const [secretCode, setSecretCode] = useState("");

  // 🔹 Fetch agents from Firestore
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "agents"));
        const agentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAgents(agentsList);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  const generateMemberID = () => `MBR${Math.floor(1000 + Math.random() * 9000)}`;
  const generateSecretCode = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const memberID = generateMemberID();
      const secret = generateSecretCode();

      await addDoc(collection(db, "members"), {
        ...form,
        memberID,
        secretCode: secret,
        createdAt: serverTimestamp(),
      });

      setGeneratedID(memberID);
      setSecretCode(secret);
      setMsg("✅ Member added successfully!");
      setForm({
        fullName: "",
        gender: "",
        contactNumber: "",
        email: "",
        address: "",
        dateJoined: "",
        donationPreference: "",
        paymentAmount: "",
        agentId: "",
      });
    } catch (error) {
      console.error(error);
      setMsg("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-5xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
          Add Mosque Member
        </h2>

        {msg && (
          <div
            className={`p-3 mb-4 rounded-md text-center ${
              msg.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address</label>
                <textarea
                  name="address"
                  rows={5}
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Payment Amount (LKR)</label>
                <input
                  type="number"
                  name="paymentAmount"
                  value={form.paymentAmount}
                  onChange={handleChange}
                  placeholder="Enter amount in LKR"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Date Joined</label>
                <input
                  type="date"
                  name="dateJoined"
                  value={form.dateJoined}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Donation Preference</label>
                <select
                  name="donationPreference"
                  value={form.donationPreference}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="One-time">One-time</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Assign Agent</label>
                <select
                  name="agentId"
                  value={form.agentId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">Select Agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.fullName || agent.agentName || `Agent ${agent.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            className="w-full md:w-auto bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </form>

        {generatedID && (
          <div className="mt-6 bg-gray-100 rounded-md p-4 text-gray-700 text-center">
            <div>
              <strong>Member ID:</strong> {generatedID}
            </div>
            <div>
              <strong>Secret Code:</strong> {secretCode}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
