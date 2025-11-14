import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../component/DashboardLayout";

export default function EditAgent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    agentID: "",
    fullName: "",
    gender: "",
    contactNumber: "",
    email: "",
    assignedArea: "",
    joiningDate: "",
    agentType: "",
    secretCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  // Fetch agent data
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const docRef = doc(db, "agents", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setForm(docSnap.data());
        } else {
          setMsg("❌ Agent not found.");
        }
      } catch (error) {
        console.error(error);
        setMsg("❌ Error loading agent data.");
      }
      setLoading(false);
    };
    fetchAgent();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const docRef = doc(db, "agents", id);
      await updateDoc(docRef, form);
      setMsg("✅ Agent updated successfully!");
      setTimeout(() => navigate("/manage-agents"), 1500);
    } catch (error) {
      console.error(error);
      setMsg("❌ Something went wrong. Please try again.");
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <p className="text-center text-gray-600 mt-10">Loading agent data...</p>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8 mt-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Edit Collecting Agent
        </h2>

        {msg && (
          <div
            className={`text-center py-2 px-4 rounded-md mb-6 ${
              msg.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent ID
              </label>
              <input
                type="text"
                name="agentID"
                value={form.agentID}
                disabled
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Area / Zone
              </label>
              <input
                type="text"
                name="assignedArea"
                value={form.assignedArea}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joining Date
              </label>
              <input
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent Type
              </label>
              <select
                name="agentType"
                value={form.agentType}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Paid">Paid</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
          </div>

          {/* Secret Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret Code
            </label>
            <div className="flex">
              <input
                type={showSecret ? "text" : "password"}
                name="secretCode"
                value={form.secretCode}
                onChange={handleChange}
                required
                className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="bg-gray-200 px-4 rounded-r-lg text-sm font-medium hover:bg-gray-300 transition"
              >
                {showSecret ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Update Agent
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
