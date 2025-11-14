import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaKey,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

export default function AgentProfile() {
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("agentData");
    if (!storedData) {
      setAgentData(null);
      setLoading(false);
      return;
    }

    const parsedData = JSON.parse(storedData);
    setAgentData(parsedData);
    setFormData(parsedData);
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      if (!agentData || !agentData.id) {
        alert("Agent document ID missing!");
        return;
      }

      setUpdating(true);
      const docRef = doc(db, "agents", agentData.id);
      await updateDoc(docRef, {
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        assignedArea: formData.assignedArea,
      });

      const updatedSnap = await getDoc(docRef);
      const updatedData = { id: updatedSnap.id, ...updatedSnap.data() };

      sessionStorage.setItem("agentData", JSON.stringify(updatedData));
      setAgentData(updatedData);
      setFormData(updatedData);
      setEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Failed to update profile. Try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading profile...
      </div>
    );

  if (!agentData)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        ❌ Agent data not found or invalid credentials.
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 p-4">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 max-w-lg w-full text-white border border-white/20">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <FaUser className="text-5xl text-blue-300" />
          </div>
          <h2 className="text-2xl font-semibold">{agentData.fullName}</h2>
          <p className="text-sm text-gray-300">{agentData.agentType}</p>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-2">
            <FaEnvelope className="text-blue-300" />
            {editing ? (
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="flex-1 bg-transparent border border-white/20 rounded px-2 py-1 text-white focus:outline-none"
              />
            ) : (
              <span>{agentData.email}</span>
            )}
          </div>

          {/* Contact Number */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-2">
            <FaPhone className="text-blue-300" />
            {editing ? (
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber || ""}
                onChange={handleChange}
                className="flex-1 bg-transparent border border-white/20 rounded px-2 py-1 text-white focus:outline-none"
              />
            ) : (
              <span>{agentData.contactNumber}</span>
            )}
          </div>

          {/* Assigned Area */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-2">
            <FaMapMarkerAlt className="text-blue-300" />
            {editing ? (
              <input
                type="text"
                name="assignedArea"
                value={formData.assignedArea || ""}
                onChange={handleChange}
                className="flex-1 bg-transparent border border-white/20 rounded px-2 py-1 text-white focus:outline-none"
              />
            ) : (
              <span>{agentData.assignedArea}</span>
            )}
          </div>

          {/* Static Info */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-2">
            <FaIdBadge className="text-blue-300" />
            <span>Agent ID: {agentData.agentID}</span>
          </div>

          <div className="flex items-center gap-3 border-b border-white/10 pb-2">
            <FaKey className="text-blue-300" />
            <span>Secret Code: {agentData.secretCode}</span>
          </div>

          <div className="flex items-center gap-3 border-b border-white/10 pb-2">
            <FaCalendarAlt className="text-blue-300" />
            <span>Joined: {agentData.joiningDate}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          {editing ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-md transition-all"
              >
                <FaSave />
                {updating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md transition-all"
              >
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition-all"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
