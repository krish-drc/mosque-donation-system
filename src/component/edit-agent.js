import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../component/DashboardLayout";
import "../styles/EditAgent.css"; // Import CSS

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

  if (loading) return <p>Loading agent data...</p>;

  return (
    <DashboardLayout>
      <div className="edit-agent-container">
        <h2>Edit Collecting Agent</h2>
        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="edit-agent-row">
            <div className="edit-agent-col">
              <label>Agent ID</label>
              <input type="text" name="agentID" value={form.agentID} disabled />

              <label>Full Name</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />

              <label>Contact Number</label>
              <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} required />

              <label>Assigned Area / Zone</label>
              <input type="text" name="assignedArea" value={form.assignedArea} onChange={handleChange} required />
            </div>

            <div className="edit-agent-col">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />

              <label>Joining Date</label>
              <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} required />

              <label>Agent Type</label>
              <select name="agentType" value={form.agentType} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Paid">Paid</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
          </div>

          <div className="mb-3 secret-code-wrapper">
            <label>Secret Code</label>
            <div className="input-group">
              <input
                type={showSecret ? "text" : "password"}
                name="secretCode"
                value={form.secretCode}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button className="update-agent-btn" type="submit">Update Agent</button>
        </form>
      </div>
    </DashboardLayout>
  );
}
