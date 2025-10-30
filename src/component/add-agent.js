import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import DashboardLayout from "../component/DashboardLayout";
import "../styles/AddAgent.css"; // Import CSS

export default function AddAgent() {
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    contactNumber: "",
    email: "",
    assignedArea: "",
    joiningDate: "",
    agentType: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [generatedID, setGeneratedID] = useState("");
  const [secretCode, setSecretCode] = useState("");

  const generateAgentID = () => `AGT${Math.floor(1000 + Math.random() * 9000)}`;
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
      const agentID = generateAgentID();
      const secret = generateSecretCode();

      await addDoc(collection(db, "agents"), {
        ...form,
        agentID,
        secretCode: secret,
        createdAt: serverTimestamp(),
      });

      setGeneratedID(agentID);
      setSecretCode(secret);
      setMsg("✅ Agent added successfully!");
      setForm({
        fullName: "",
        gender: "",
        contactNumber: "",
        email: "",
        assignedArea: "",
        joiningDate: "",
        agentType: "",
      });
    } catch (error) {
      console.error(error);
      setMsg("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="add-agent-container">
        <h2>Add Collecting Agent</h2>
        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={handleSubmit}>
          {/* Row 1: Full Name + Gender */}
          <div className="add-agent-row">
            <div className="add-agent-col">
              <label>Full Name</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
            </div>
            <div className="add-agent-col">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 2: Contact + Email */}
          <div className="add-agent-row">
            <div className="add-agent-col">
              <label>Contact Number</label>
              <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} required />
            </div>
            <div className="add-agent-col">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>
          </div>

          {/* Row 3: Assigned Area + Joining Date */}
          <div className="add-agent-row">
            <div className="add-agent-col">
              <label>Assigned Area / Zone</label>
              <input
                type="text"
                name="assignedArea"
                value={form.assignedArea}
                onChange={handleChange}
                placeholder="e.g. North Block, Ward 3, Mosque A"
                required
              />
            </div>
            <div className="add-agent-col">
              <label>Joining Date</label>
              <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} required />
            </div>
          </div>

          {/* Row 4: Agent Type */}
          <div className="add-agent-row">
            <div className="add-agent-col">
              <label>Agent Type</label>
              <select name="agentType" value={form.agentType} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Paid">Paid</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
          </div>

          <button className="add-agent-btn" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Agent"}
          </button>
        </form>

        {generatedID && (
          <div className="agent-info">
            <div>
              <strong>Agent ID:</strong> {generatedID}
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
