import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../component/DashboardLayout";
import "../styles/EditMember.css"; // Import CSS

export default function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    memberID: "",
    fullName: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    dateJoined: "",
    donationPreference: "",
    paymentAmount: "",
    secretCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const docRef = doc(db, "members", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setForm(docSnap.data());
        } else {
          setMsg("❌ Member not found.");
        }
      } catch (error) {
        console.error(error);
        setMsg("❌ Error loading member data.");
      }
      setLoading(false);
    };
    fetchMember();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const docRef = doc(db, "members", id);
      await updateDoc(docRef, form);
      setMsg("✅ Member updated successfully!");
      setTimeout(() => navigate("/manage-members"), 1500);
    } catch (error) {
      console.error(error);
      setMsg("❌ Something went wrong. Please try again.");
    }
  };

  if (loading) return <p>Loading member data...</p>;

  return (
    <DashboardLayout>
      <div className="edit-member-container">
        <h2>Edit Mosque Member</h2>
        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="edit-member-row">
            {/* Left Column */}
            <div className="edit-member-col">
              <label>Member ID</label>
              <input type="text" name="memberID" value={form.memberID} disabled />

              <label>Full Name</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />

              <label>Contact Number</label>
              <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} required />

              <label>Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={4} required></textarea>
            </div>

            {/* Right Column */}
            <div className="edit-member-col">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />

              <label>Date Joined</label>
              <input type="date" name="dateJoined" value={form.dateJoined} onChange={handleChange} required />

              <label>Donation Preference</label>
              <select name="donationPreference" value={form.donationPreference} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="One-time">One-time</option>
              </select>

              <label>Payment Amount (LKR)</label>
              <input type="number" name="paymentAmount" value={form.paymentAmount || ""} onChange={handleChange} min={0} />
            </div>
          </div>

          {/* Secret Code */}
          <div className="secret-code-wrapper">
            <label>Secret Code</label>
            <div className="input-group">
              <input
                type={showSecret ? "text" : "password"}
                name="secretCode"
                value={form.secretCode || ""}
                onChange={handleChange}
                placeholder="Enter or update secret code"
              />
              <button type="button" onClick={() => setShowSecret(!showSecret)}>
                {showSecret ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="update-member-btn">Update Member</button>
        </form>
      </div>
    </DashboardLayout>
  );
}
